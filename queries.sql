--Получить список всех категорий (идентификатор, наименование категории);
SELECT
  categories.id AS "Идентификатор",
  categories.title AS "Наименование категории"
FROM categories;

--Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);
SELECT
  categories.id AS "Идентификатор",
  categories.title AS "Наименование категории"
FROM articles_categories
  INNER JOIN categories
    ON categories.id = articles_categories.category_id
GROUP BY categories.id, categories.title;

--Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);
SELECT
  categories.id AS "Идентификатор",
  categories.title AS "Наименование категории",
  count(articles_categories.article_id) AS "Количество публикаций в категории"
FROM articles_categories
  INNER JOIN categories
    ON categories.id = articles_categories.category_id
GROUP BY categories.id, categories.title;

--Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации,
--имя и фамилия автора, контактный email, количество комментариев, наименование категорий).
--Сначала свежие публикации;
SELECT
  articles.id AS "Идентификатор",
  articles.title AS "Заголовок публикации",
  articles.announce AS "Анонс публикации",
  articles.created_date AS "Анонс публикации",
  concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия автора",
  users.email AS "Контактный email",
  count(distinct comments.id) AS "Количество комментариев",
  string_agg(distinct categories.title, ', ') AS "Наименование категорий"
FROM articles
  INNER JOIN users
    ON users.id = articles.user_id
  INNER JOIN articles_categories
    ON articles_categories.article_id = articles.id
  INNER JOIN categories
    ON categories.id = articles_categories.category_id
  INNER JOIN comments
    ON comments.article_id = articles.id
GROUP BY
    articles.id,
    articles.title,
    articles.announce,
    articles.created_date,
    concat(users.first_name, ' ', users.last_name),
    users.email
ORDER BY
  articles.created_date DESC;

--Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации,
--анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора,
--контактный email, количество комментариев, наименование категорий);
SELECT
  articles.id AS "Идентификатор",
  articles.title AS "Заголовок публикации",
  articles.announce AS "Анонс публикации",
  articles.created_date AS "Анонс публикации",
  concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия автора",
  users.email AS "Контактный email",
  count(distinct comments.id) AS "Количество комментариев",
  string_agg(distinct categories.title, ', ') AS "Наименование категорий"
FROM articles
  INNER JOIN users
    ON users.id = articles.user_id
  INNER JOIN articles_categories
    ON articles_categories.article_id = articles.id
  INNER JOIN categories
    ON categories.id = articles_categories.category_id
  INNER JOIN comments
    ON comments.article_id = articles.id
WHERE articles.id = 1
GROUP BY
    articles.id,
    articles.title,
    articles.announce,
    articles.created_date,
    concat(users.first_name, ' ', users.last_name),
    users.email;

--Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации,
--имя и фамилия автора, текст комментария);
SELECT
  comments.id AS "Идентификатор комментария",
  comments.article_id AS "Идентификатор публикации",
  concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия автора",
  comments.message AS "Текст комментария"
FROM comments
  INNER JOIN users
    ON users.id = comments.user_id
ORDER BY
  comments.created_date DESC
LIMIT 5;

--Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации,
--имя и фамилия автора, текст комментария).
--Сначала новые комментарии;
SELECT
  comments.id AS "Идентификатор комментария",
  comments.article_id AS "Идентификатор публикации",
  concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия автора",
  comments.message AS "Текст комментария"
FROM comments
  INNER JOIN users
    ON users.id = comments.user_id
WHERE comments.article_id = 1
ORDER BY
  comments.created_date DESC;

--Обновить заголовок определённой публикации на «Как я весело встретил Новый год»;
UPDATE articles
  set title = 'Как я весело встретил Новый год'
WHERE articles.id = 1;
