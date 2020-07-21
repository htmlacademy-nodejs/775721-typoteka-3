DROP DATABASE IF EXISTS academy_typoteka;
DROP ROLE IF EXISTS academy_typoteka;

CREATE ROLE academy_typoteka WITH
  PASSWORD ''
	LOGIN
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1;

CREATE DATABASE academy_typoteka WITH
  OWNER = academy_typoteka
  TEMPLATE = template0
  ENCODING = 'UTF8'
  LC_COLLATE = 'C'
  LC_CTYPE = 'C'
  TABLESPACE = pg_default
  CONNECTION LIMIT = -1;

DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
	id BIGSERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email VARCHAR(320) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL CHECK (char_length(password) >= 6),
	avatar TEXT
);

CREATE UNIQUE INDEX email_idx ON users ((lower(email)));

CREATE TABLE categories
(
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(30) NOT NULL CHECK (char_length(title) >= 5)
);

CREATE TABLE articles
(
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  image TEXT,
  created_date TIMESTAMP NOT NULL,
  title VARCHAR(250) NOT NULL CHECK (char_length(title) >= 30),
  announce VARCHAR(250) NOT NULL CHECK (char_length(announce) >= 30),
  text VARCHAR(1000),
  FOREIGN KEY(user_id) REFERENCES users
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX title_idx ON articles ((lower(title)));
CREATE INDEX articles_created_date_idx ON articles (created_date);

CREATE TABLE articles_categories
(
  article_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  CONSTRAINT articles_categories_pk PRIMARY KEY(article_id, category_id),
  FOREIGN KEY(article_id) REFERENCES articles
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY(category_id) REFERENCES categories
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE comments
(
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  article_id BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL,
  message VARCHAR(300) NOT NULL CHECK (char_length(message) >= 20),
  FOREIGN KEY(user_id) REFERENCES users
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY(article_id) REFERENCES articles
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX user_id_idx ON comments (user_id);
CREATE INDEX article_id_idx ON comments (article_id);
CREATE INDEX comments_created_date_idx ON comments (created_date);
