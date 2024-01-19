import pg from 'pg';

const connectionString = process.env["DATABASE_CONNECTION_STRING"];
if (!connectionString) throw new Error("DATABASE_CONNECTION_STRING NOT FOUND");

export interface IDBUser {
  id: string;
  email: string;
  last_name: string;
  first_name: string;
  password_hash: string;
  avatar_url: string;
  joined_at: Date;
  blog: string;
  bio: string;
}

export interface IDBContent {
  id: string;
  markdown: string;
  author_id: string;
  author: IDBUser;
}

export interface File {
  file_path: string;
  content_id: string;
  content: IDBContent;
}

interface IDBBaseArgs {
  client: pg.PoolClient
}

export interface ICreateUserArgs extends IDBBaseArgs {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  avatar_url: string;
  blog: string;
  profile_id: string;
}

export async function createUserX(args: ICreateUserArgs) {
  await args.client.query(`--sql
      INSERT INTO "profile" (id)
      VALUES ($1)
  `, [args.profile_id]);

  await args.client.query(`--sql
      INSERT INTO "user" (id, email, first_name, last_name, password_hash, avatar_url, blog, profile_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [args.id, args.email, args.first_name, args.last_name,
    args.password_hash, args.avatar_url, args.blog, args.profile_id]);

}

const pool = new pg.Pool({ connectionString });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('Connected to database');
});

pool.on('acquire', () => {
  console.log('Client acquired');
});

pool.on('remove', () => {
  console.log('Client removed');
});


export async function userExistsByEmail(email: string) {
  try {

    const result = await pool.query(`--sql
      SELECT EXISTS (SELECT 1 FROM "user" WHERE email = $1) AS user_exists
    `, [email]);

    return result.rows[0].user_exists as boolean;
  } catch (error) {
    console.error('Error checking user existence by email:', error);
    throw error;
  }
}

export async function userExistsByBlog(blog: string) {
  try {

    const result = await pool.query(`--sql
      SELECT EXISTS (SELECT 1 FROM "user" WHERE blog = $1) AS user_exists
    `, [blog]);

    return result.rows[0].user_exists as boolean;
  } catch (error) {
    console.error('Error checking user existence by blog:', error);
    throw error;
  }
}

/**
 * don't forgat to release client ok
*/

// eslint-disable-next-line @typescript-eslint/ban-types
const submit = pg.Query.prototype.submit as Function;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
pg.Query.prototype.submit = function (this: any) {
  const text = this.text as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values = this.values as any[];
  const query = values.reduce((q, v, i) => q.replace(`$${i + 1}`, v), text);
  console.log(query);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-rest-params
  submit.apply(this, arguments as any);
};

export const getClient = async () => {
  const client = await pool.connect();

  client.on("notice", (notice) => {
    console.log('Notice:', notice);
  })

  client.on("notification", (notification) => {
    console.log('Notice:', notification);
  })

  return client
}

export const transaction = async (func: (client: pg.PoolClient) => Promise<void>) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    await func(client)
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in transaction:', error);
    throw error;
  } finally {
    client.release();
  }
}


export default pool;
