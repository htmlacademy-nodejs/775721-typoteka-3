'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../../server`);
const testDataBase = require(`../../database/test-data-base`);

describe(`Comment API end-points`, () => {
  const server = createServer({dataBase: testDataBase});

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
  ];
  const articlesCategories = [
    {
      articleId: 1,
      categoriesIds: [1],
    },
  ];

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`GET api/articles/:articleId/comments`, () => {
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
        article_id: 1, /* eslint-disable-line */
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, articles, articlesCategories, comments});
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const res = await request(server).get(`/api/articles/1234/comments`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if article exist`, async () => {
      const res = await request(server).get(`/api/articles/1/comments`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return comments`, async () => {
      const expectedFirstComment = {
        id: 1,
        message: `Это где ж такие красоты? Совсем немного... Давно не пользуюсь стационарными компьютерами.`,
      };
      const expectedSecondComment = {
        id: 2,
        message: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      };

      const res = await request(server).get(`/api/articles/1/comments`);
      const [firstComment, secondComment] = res.body;

      expect(firstComment).toMatchObject(expectedFirstComment);
      expect(secondComment).toMatchObject(expectedSecondComment);
    });
  });

  describe(`POST api/articles/:articleId/comments`, () => {
    const comments = [
      {
        message: `Это где ж такие красоты? Совсем немного... Давно не пользуюсь стационарными компьютерами.`,
        user_id: 1, /* eslint-disable-line */
        article_id: 1, /* eslint-disable-line */
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, articles, articlesCategories, comments});
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const data = {
        text: `New comment`,
      };
      const res = await request(server).post(`/api/articles/1234/comments`).send(data);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if didnt send text`, async () => {
      const data = {
        message: `New comment`,
      };
      const res = await request(server).post(`/api/articles/1/comments`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if new comment was created`, async () => {
      const data = {
        text: `New comment`,
      };
      const res = await request(server).post(`/api/articles/1/comments`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return new comment if new comment was created`, async () => {
      const data = {
        text: `New comment`,
      };
      const expectedComment = {
        message: `New comment`,
      };

      const res = await request(server).post(`/api/articles/1/comments`).send(data);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body).toMatchObject(expectedComment);
    });

    it(`should return comments with new comment if new comment was created`, async () => {
      const data = {
        text: `New comment`,
      };
      const {body: newComment} = await request(server).post(`/api/articles/1/comments`).send(data);
      const res = await request(server).get(`/api/articles/1/comments`);

      expect(res.body).toContainEqual(newComment);
    });
  });

  describe(`DELETE api/articles/:articleId/comments/:commentId`, () => {
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
        article_id: 1, /* eslint-disable-line */
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users, categories, articles, articlesCategories, comments});
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const res = await request(server).delete(`/api/articles/1234/comments/1`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 404 if comment doesn't exist`, async () => {
      const res = await request(server).delete(`/api/articles/1/comments/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if comment was deleted`, async () => {
      const res = await request(server).delete(`/api/articles/1/comments/2`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted comment if comment was deleted`, async () => {
      const expectedComment = {
        id: 2,
        message: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      };

      const res = await request(server).delete(`/api/articles/1/comments/2`);

      expect(res.body).toMatchObject(expectedComment);
    });

    it(`should return comments without deleted comment if comment was deleted`, async () => {
      const {body: deletedComment} = await request(server).delete(`/api/articles/1/comments/2`);
      const res = await request(server).get(`/api/articles/1/comments`);

      expect(res.body).not.toContainEqual(deletedComment);
    });
  });
});
