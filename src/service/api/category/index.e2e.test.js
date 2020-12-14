'use strict';

const {describe, it, expect, afterAll, beforeEach} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../../server`);
const testDataBase = require(`../../database/test-data-base`);

describe(`Category API end-points`, () => {
  const server = createServer({dataBase: testDataBase});

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`GET api/categories`, () => {
    it(`should return empty array if no articles`, async () => {
      await testDataBase.resetDataBase({});

      const res = await request(server).get(`/api/categories`);

      expect(res.body).toEqual([]);
    });

    it(`should return "Программирование" with quantity = 1 and "Кино и сериалы" with quantity = 2`, async () => {
      const userData = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };
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
      const firstArticleData = {
        image: `item01.jpg`,
        title: `Как начать программировать за 21 день.`,
        announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
        fullText: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        categories: [1],
      };
      const secondArticleData = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [2],
      };
      const expectedCategories = [
        {
          id: 2,
          title: `Кино и сериалы`,
          quantity: `2`,
        },
        {
          id: 1,
          title: `Программирование`,
          quantity: `1`,
        },
      ];

      await testDataBase.resetDataBase({categories});

      await request(server).post(`/api/user`).send(userData);

      const {body: loginBody} = await request(server).post(`/api/user/login`).send({email: userData.email, password: userData.password});
      const headers = {
        authorization: `Bearer ${loginBody.accessToken} ${loginBody.refreshToken}`
      };

      await Promise.all([
        request(server).post(`/api/articles`).send(firstArticleData).set(headers),
        request(server).post(`/api/articles`).send(secondArticleData).set(headers),
        request(server).post(`/api/articles`).send(secondArticleData).set(headers),
      ]);

      const res = await request(server).get(`/api/categories`);

      expect(res.body).toEqual(expectedCategories);
    });
  });

  describe(`GET api/categories/:categoryId`, () => {
    beforeEach(async () => {
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

      await testDataBase.resetDataBase({categories});
    });

    it(`should return status 500 if sent invalid id`, async () => {
      const categoryId = `abc`;
      const {statusCode} = await request(server).get(`/api/categories/${categoryId}`);

      expect(statusCode).toBe(400);
    });

    it(`should return status 404 if can't find category with sent id`, async () => {
      const categoryId = 5;
      const {statusCode} = await request(server).get(`/api/categories/${categoryId}`);

      expect(statusCode).toBe(404);
    });

    it(`should return status 200 if sent id = 1`, async () => {
      const categoryId = 1;
      const {statusCode} = await request(server).get(`/api/categories/${categoryId}`);

      expect(statusCode).toBe(200);
    });

    it(`should return "Программирование" category if sent id = 1`, async () => {
      const categoryId = 1;
      const expectedCategory = {
        id: 1,
        title: `Программирование`,
      };
      const {body} = await request(server).get(`/api/categories/${categoryId}`);

      expect(body).toMatchObject(expectedCategory);
    });
  });
});
