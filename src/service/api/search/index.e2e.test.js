'use strict';

const {describe, it, expect, beforeEach} = require(`@jest/globals`);

const request = require(`supertest`);

const {createServer} = require(`../../server`);

describe(`Search API end-points`, () => {
  describe(`GET apo/search`, () => {
    const mockArticle1 = {
      id: `PfdAxn`,
      title: `Article-1`,
      createdDate: `11.05.2020, 20:22:02`,
      announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи.`,
      fullText: `Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь.`,
      category: [
        `Программирование`,
        `Железо`,
        `IT`,
        `Разное`,
        `Музыка`,
        `За жизнь`,
      ],
      comments: [],
    };
    const mockArticle2 = {
      id: `8MqcDu`,
      title: `Article-2`,
      createdDate: `21.05.2020, 08:55:16`,
      announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Программировать не настолько сложно, как об этом говорят.`,
      fullText: `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Процессор заслуживает особого внимания.`,
      category: [
        `IT`,
      ],
      comments: [
        {
          id: `ENMOl2`,
          text: `Совсем немного... Это где ж такие красоты? Согласен с автором!`,
        },
      ],
    };
    const mockArticles = [mockArticle1, mockArticle2];
    let server;

    beforeEach(async () => {
      server = await createServer({articles: mockArticles});
    });

    it(`should return status 404 if no articles with passed query`, async () => {
      const res = await request(server).get(`/api/search?query=query`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if articles contains query in title`, async () => {
      const res = await request(server).get(`/api/search?query=Article`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return array with articles which contain query in title`, async () => {
      const res = await request(server).get(`/api/search?query=Article-1`);

      expect(res.body).toContainEqual(mockArticle1);
    });
  });
});
