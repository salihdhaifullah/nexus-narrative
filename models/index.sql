CREATE TABLE IF NOT EXISTS "category" (
  id VARCHAR(26) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE INDEX idx_category_name_desc ON category (name DESC);

CREATE TABLE IF NOT EXISTS "tag" (
  id VARCHAR(26) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE INDEX idx_tag_name_desc ON tag (name DESC);

CREATE TABLE IF NOT EXISTS "post" (
  id VARCHAR(26) PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  images JSON,
  author_id INT,
  comments_id INT,
  slug VARCHAR(255) UNIQUE,
  category_Id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  background_image VARCHAR(255),
  likes_count INT DEFAULT 0,
  dislikes_count INT DEFAULT 0,
  FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE INDEX idx_post_title_desc ON post (title DESC);
CREATE INDEX idx_post_description_desc ON post (description DESC);
CREATE INDEX idx_post_createdAt_desc ON post (created_at DESC);

CREATE TABLE IF NOT EXISTS "view" (
  id VARCHAR(26) PRIMARY KEY,
  IP_address VARCHAR(255),
  post_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Like" (
  id VARCHAR(26) PRIMARY KEY,
  isLike BOOLEAN,
  userId INT,
  postId INT,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "User" (
  id VARCHAR(26) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  lastName VARCHAR(255),
  firstName VARCHAR(255),
  password VARCHAR(255),
  avatarUrl VARCHAR(255),
  joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  blog VARCHAR(255) UNIQUE,
  bio TEXT,
  profile TEXT
);

CREATE INDEX idx_user_blog_joinedAt_desc ON User (blog, joinedAt DESC);

CREATE TABLE IF NOT EXISTS "Content" (
  id VARCHAR(26) PRIMARY KEY,
  markdown TEXT,
  authorId INT,
  FOREIGN KEY (authorId) REFERENCES User(id) ON DELETE CASCADE
);
