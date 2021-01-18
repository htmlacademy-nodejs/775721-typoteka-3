'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../../server`);
const testDataBase = require(`../../database/test-data-base`);
const {UserRole} = require(`../../../constants`);

describe(`Search API end-points`, () => {
  const server = createServer({dataBase: testDataBase});

  describe(`GET api/search`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Абрамов`,
        email: `ivan_abramov@mail.local`,
        password: 123456,
        avatar: `avatar01.jpg`,
        role: UserRole.READER,
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

    afterAll(() => {
      testDataBase.sequelize.close();
    });

    it(`should return status 404 if no articles with passed query`, async () => {
      const res = await request(server).get(`/api/search?query=query`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if articles contains query in title`, async () => {
      const res = await request(server).get(`/api/search?query=BFG`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return array with article which contain query in title`, async () => {
      const expectedArticle = {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [{
          id: 2,
          title: `Кино и сериалы`,
        }],
        comments: [{
          id: 2,
          message: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        }],
      };

      const res = await request(server).get(`/api/search?query=BFG`);
      const [article] = res.body;

      expect(article).toMatchObject(expectedArticle);
    });
  });
});
