'use strict';

const {describe, it, expect, afterAll} = require(`@jest/globals`);
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

    it(`should return ["Животные", "Посуда"]`, async () => {
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

      const res = await request(server).get(`/api/categories`);

      expect(res.body).toEqual(categories);
    });
  });
});
