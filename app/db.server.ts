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

export interface ICreateContentArgs extends IDBBaseArgs {
  id: string;
  author_id: string;
  markdown?: string;
}

export interface ICreateUserArgs extends IDBBaseArgs {
  id: string;
  about_id: string;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  avatar_url: string;
  blog: string;
}

export async function createContent(args: ICreateContentArgs) {
  await args.client.query(`--sql
      INSERT INTO "content" (id, author_id${args.markdown !== undefined ? ', markdown' : ''})
      VALUES ($1, $2${args.markdown !== undefined ? ', $3' : ''})
    `,
    args.markdown ? [args.id, args.author_id, args.markdown] : [args.id, args.author_id]
  );
}


export async function createUserX(args: ICreateUserArgs) {
  await args.client.query(`--sql
      INSERT INTO "user" (id, about_id, email, first_name, last_name, password_hash, avatar_url, blog)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [args.id, args.about_id, args.email, args.first_name,
      args.last_name, args.password_hash, args.avatar_url, args.blog]
  );
}

const pool = new pg.Pool({ connectionString });

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
export const getClient = async () => {
  return await pool.connect();
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
