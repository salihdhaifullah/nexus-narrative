import { transaction } from '~/db.server';

const userTable = `--sql
    CREATE TABLE IF NOT EXISTS "user" (
        id VARCHAR(26) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255) NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        blog VARCHAR(255) UNIQUE NOT NULL,
        bio VARCHAR(255) DEFAULT '' NOT NULL,
        profile_id VARCHAR(26) NOT NULL,
        FOREIGN KEY (profile_id) REFERENCES "profile" (id) ON DELETE CASCADE
    );

    CREATE INDEX idx_user_joined_at ON "user" (joined_at);
    CREATE INDEX idx_user_blog ON "user" (blog);
`;


const profileTable = `--sql
    CREATE TABLE IF NOT EXISTS "profile" (
        id VARCHAR(26) PRIMARY KEY,
        markdown TEXT DEFAULT '' NOT NULL
    );
`;

const fileTable = `--sql
    CREATE TABLE IF NOT EXISTS "file" (
        file_path VARCHAR(255) PRIMARY KEY,
        profile_id VARCHAR(26) NOT NULL,
        FOREIGN KEY (profile_id) REFERENCES "profile" (id) ON DELETE CASCADE
    )
`;

await transaction(async (client) => {
    await client.query(`--sql
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
    `);

    await client.query(profileTable);
    await client.query(userTable);
    await client.query(fileTable);
})
