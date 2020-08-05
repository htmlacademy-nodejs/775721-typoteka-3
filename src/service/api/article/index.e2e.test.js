'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../../server`);
const testDataBase = require(`../../database/test-data-base`);

describe(`Article API end-points`, () => {
  const server = createServer({dataBase: testDataBase});

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`GET api/articles`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];
    const categories = [
      {
        id: 1,
        title: `Программирование`,
      },
      {
        id: 2,
        title: `Кино и сериалы`,
      },
      {
        id: 3,
        title: `Железо`,
      },
    ];
    const articles = [
      {
        id: 1,
        image: `item01.jpg`,
        title: `Как начать программировать за 21 день.`,
        announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
        text: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        user_id: 1, /* eslint-disable-line */
      },
      {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        text: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        user_id: 1, /* eslint-disable-line */
      },
    ];
    const comments = [
      {
        id: 1,
        message: `Это где ж такие красоты? Совсем немного... Давно не пользуюсь стационарными компьютерами.`,
        user_id: 1, /* eslint-disable-line */
        article_id: 1, /* eslint-disable-line */
      },
      {
        id: 2,
        message: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        user_id: 1, /* eslint-disable-line */
        article_id: 2, /* eslint-disable-line */
      },
    ];
    const articlesCategories = [
      {
        articleId: 1,
        categoriesIds: [1, 2],
      },
      {
        articleId: 2,
        categoriesIds: [3],
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, articles, comments, articlesCategories});
    });

    it(`should return status 200 if request was successful`, async () => {
      const res = await request(server).get(`/api/articles`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return correct articles if request was successful`, async () => {
      const expectedFirstArticle = {
        id: 1,
        image: `item01.jpg`,
        title: `Как начать программировать за 21 день.`,
        announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
        fullText: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        category: [`Программирование`, `Кино и сериалы`],
        comments: [{
          id: 1,
          message: `Это где ж такие красоты? Совсем немного... Давно не пользуюсь стационарными компьютерами.`,
        }],
      };
      const expectedSecondArticle = {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [`Железо`],
        comments: [{
          id: 2,
          message: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        }],
      };

      const res = await request(server).get(`/api/articles`);

      const [firstArticle, secondArticle] = res.body;

      expect(firstArticle).toMatchObject(expectedFirstArticle);
      expect(secondArticle).toMatchObject(expectedSecondArticle);
    });
  });

  describe(`POST api/articles`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];
    const categories = [
      {
        id: 1,
        title: `Программирование`,
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories});
    });

    it(`should return status 400 if didn't send category`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
      };

      const res = await request(server).post(`/api/articles`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if sent valid data`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return article with id and sent title if sent valid data`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [1],
      };
      const expectedArticle = {
        id: 1,
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [`Программирование`],
      };

      const res = await request(server).post(`/api/articles`).send(data);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body).toMatchObject(expectedArticle);
    });

    it(`should return article without extra properties if sent data with extra property`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [1],
        token: `token`,
      };

      const res = await request(server).post(`/api/articles`).send(data);

      expect(res.body).not.toHaveProperty(`token`);
    });

    it(`should return articles with new article`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [1],
      };

      const {body: newArticle} = await request(server).post(`/api/articles`).send(data);
      const res = await request(server).get(`/api/articles`);

      expect(res.body).toContainEqual(newArticle);
    });
  });

  describe(`GET api/articles/:articleId`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];
    const categories = [
      {
        id: 1,
        title: `Программирование`,
      },
      {
        id: 2,
        title: `Кино и сериалы`,
      },
    ];
    const articles = [
      {
        id: 1,
        image: `item01.jpg`,
        title: `Как начать программировать за 21 день.`,
        announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
        text: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        user_id: 1, /* eslint-disable-line */
      },
      {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        text: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        user_id: 1, /* eslint-disable-line */
      },
    ];
    const comments = [
      {
        id: 1,
        message: `Это где ж такие красоты? Совсем немного... Давно не пользуюсь стационарными компьютерами.`,
        user_id: 1, /* eslint-disable-line */
        article_id: 2, /* eslint-disable-line */
      },
    ];
    const articlesCategories = [
      {
        articleId: 1,
        categoriesIds: [1],
      },
      {
        articleId: 2,
        categoriesIds: [2],
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, articles, comments, articlesCategories});
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const res = await request(server).get(`/api/articles/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if article exists`, async () => {
      const res = await request(server).get(`/api/articles/2`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return article if article exists`, async () => {
      const res = await request(server).get(`/api/articles/2`);
      const expectedArticle = {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [`Кино и сериалы`],
        comments: [{
          id: 1,
          message: `Это где ж такие красоты? Совсем немного... Давно не пользуюсь стационарными компьютерами.`,
        }],
      };

      expect(res.body).toMatchObject(expectedArticle);
    });
  });

  describe(`PUT api/articles/:articleId`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];
    const categories = [
      {
        id: 1,
        title: `Программирование`,
      },
      {
        id: 2,
        title: `Кино и сериалы`,
      },
    ];
    const articles = [
      {
        id: 1,
        image: `item01.jpg`,
        title: `Как начать программировать за 21 день.`,
        announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
        text: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        user_id: 1, /* eslint-disable-line */
      },
    ];
    const articlesCategories = [
      {
        articleId: 1,
        categoriesIds: [1],
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, articles, articlesCategories});
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [2],
      };
      const res = await request(server).put(`/api/articles/1234`).send(data);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if didn't send title`, async () => {
      const data = {
        image: `item02.jpg`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [2],
      };
      const res = await request(server).put(`/api/articles/1`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 200 if article was updated`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [2],
      };
      const res = await request(server).put(`/api/articles/1`).send(data);

      expect(res.statusCode).toBe(200);
    });

    it(`should return article with updated title if article was updated`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [2],
      };
      const expectedArticle = {
        id: 1,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [`Кино и сериалы`],
      };

      const res = await request(server).put(`/api/articles/1`).send(data);

      expect(res.body).toMatchObject(expectedArticle);
    });
  });

  describe(`DELETE api/articles/:articleId`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
      },
    ];
    const categories = [
      {
        id: 1,
        title: `Программирование`,
      },
    ];
    const articles = [
      {
        id: 1,
        image: `item01.jpg`,
        title: `Как начать программировать за 21 день.`,
        announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
        text: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        user_id: 1, /* eslint-disable-line */
      },
      {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        text: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        user_id: 1, /* eslint-disable-line */
      },
    ];
    const articlesCategories = [
      {
        articleId: 1,
        categoriesIds: [1],
      },
      {
        articleId: 2,
        categoriesIds: [1],
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, articles, articlesCategories});
    });

    it(`should return status 404 if articles doesn't exist`, async () => {
      const res = await request(server).delete(`/api/articles/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if articles was deleted`, async () => {
      const res = await request(server).delete(`/api/articles/2`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted article if article was deleted`, async () => {
      const expectedArticle = {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [`Программирование`],
      };

      const res = await request(server).delete(`/api/articles/2`);

      expect(res.body).toMatchObject(expectedArticle);
    });

    it(`should return articles without deleted article`, async () => {
      const expectedArticle = {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        category: [`Программирование`],
      };

      await request(server).delete(`/api/articles/2`);
      const res = await request(server).get(`/api/articles`);

      expect(res.body).not.toContainEqual(expectedArticle);
    });
  });
});
