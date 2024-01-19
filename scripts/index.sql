-- CREATE TABLE IF NOT EXISTS "category" (
--   id VARCHAR(26) PRIMARY KEY,
--   name VARCHAR(255) UNIQUE NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS "tag" (
--   id VARCHAR(26) PRIMARY KEY,
--   name VARCHAR(255) UNIQUE NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS "post" (
--   id VARCHAR(26) PRIMARY KEY,
--   title VARCHAR(255),
--   content TEXT,
--   images JSON,
--   author_id VARCHAR(26),
--   comments_id VARCHAR(26),
--   slug VARCHAR(255) UNIQUE,
--   category_Id VARCHAR(26),
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--   background_image VARCHAR(255),
--   likes_count INT DEFAULT 0,
--   dislikes_count INT DEFAULT 0,
--   FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
--   FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
-- );

-- CREATE INDEX idx_post_title_desc ON post (title DESC);
-- CREATE INDEX idx_post_description_desc ON post (description DESC);
-- CREATE INDEX idx_post_createdAt_desc ON post (created_at DESC);

-- CREATE TABLE IF NOT EXISTS "view" (
--   id VARCHAR(26) PRIMARY KEY,
--   IP_address VARCHAR(255),
--   post_id INT,
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS "Like" (
--   id VARCHAR(26) PRIMARY KEY,
--   isLike BOOLEAN,
--   userId INT,
--   postId INT,
--   FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
--   FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE
-- );

CREATE TABLE IF NOT EXISTS "user" (
  id VARCHAR(26) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255) NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  blog VARCHAR(255) UNIQUE NOT NULL,
  bio VARCHAR(255) DEFAULT '' NOT NULL
);

CREATE INDEX idx_user_joined_at ON "user" (joined_at);
CREATE INDEX idx_user_blog ON "user" (blog);

CREATE TABLE IF NOT EXISTS "content" (
  id VARCHAR(26) PRIMARY KEY,
  markdown TEXT NOT NULL,
  author_id VARCHAR(26) NOT NULL,
  FOREIGN KEY (author_id) REFERENCES "user" (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "file" (
  file_path VARCHAR(255) PRIMARY KEY,
  content_id VARCHAR(26) NOT NULL,
  FOREIGN KEY (content_id) REFERENCES "content" (id) ON DELETE CASCADE
)
