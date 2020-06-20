'use strict';

const {describe, it, expect, beforeEach} = require(`@jest/globals`);

const request = require(`supertest`);

const {createServer} = require(`../../server`);

describe(`Comment API end-points`, () => {
  describe(`GET api/articles/:articleId/comments`, () => {
    const mockComment = {
      id: `ORF5b1`,
      text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы!`,
    };
    const mockArticle = {
      id: `7hd_rn`,
      title: `Лучше рок-музыканты 20-века`,
      createdDate: `24.04.2020, 11:19:41`,
      announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
      fullText: `Достичь успеха помогут ежедневные повторения.`,
      category: [],
      comments: [mockComment],
    };
    const mockArticles = [mockArticle];
    let server;

    beforeEach(async () => {
      server = await createServer({articles: mockArticles});
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const res = await request(server).get(`/api/articles/1234/comments`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if article exist`, async () => {
      const res = await request(server).get(`/api/articles/${ mockArticle.id }/comments`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return comments`, async () => {
      const res = await request(server).get(`/api/articles/${ mockArticle.id }/comments`);

      expect(res.body).toEqual(mockArticle.comments);
    });
  });

  describe(`POST api/articles/:articleId/comments`, () => {
    const mockArticle = {
      id: `7hd_rn`,
      title: `Лучше рок-музыканты 20-века`,
      createdDate: `24.04.2020, 11:19:41`,
      announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
      fullText: `Достичь успеха помогут ежедневные повторения.`,
      category: [],
      comments: [
        {
          id: `ORF5b1`,
          text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы!`,
        },
      ],
    };
    const mockArticles = [mockArticle];
    let server;

    beforeEach(async () => {
      server = await createServer({articles: mockArticles});
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
      const res = await request(server).post(`/api/articles/${ mockArticle.id }/comments`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if new comment was created`, async () => {
      const data = {
        text: `New comment`,
      };
      const res = await request(server).post(`/api/articles/${ mockArticle.id }/comments`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return new comment if new comment was created`, async () => {
      const data = {
        text: `New comment`,
      };
      const res = await request(server).post(`/api/articles/${ mockArticle.id }/comments`).send(data);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body.text).toBe(data.text);
    });

    it(`should return comments with new comment if new comment was created`, async () => {
      const data = {
        text: `New comment`,
      };
      const {body} = await request(server).post(`/api/articles/${ mockArticle.id }/comments`).send(data);
      const res = await request(server).get(`/api/articles/${ mockArticle.id }/comments`);

      expect(res.body).toContainEqual(body);
    });
  });

  describe(`DELETE api/articles/:articleId/comments/:commentId`, () => {
    const mockComment1 = {
      id: `WNP24E`,
      text: `Согласен с автором!`,
    };
    const mockComment2 = {
      id: `I4KyE3`,
      text: `Мне кажется или я уже читал это где-то? Хочу такую же футболку :-)`,
    };
    const mockArticle = {
      id: `Fwt8UQ`,
      title: `Борьба с прокрастинацией`,
      createdDate: `22.03.2020, 08:35:48`,
      announce: `Он написал больше 30 хитов.`,
      fullText: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать?`,
      category: [
        `Разное`,
        `Программирование`,
        `IT`,
      ],
      comments: [mockComment1, mockComment2],
    };
    const mockArticles = [mockArticle];
    let server;

    beforeEach(async () => {
      server = await createServer({articles: mockArticles});
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const res = await request(server).delete(`/api/articles/1234/comments/${ mockComment1.id }`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const res = await request(server).delete(`/api/articles/${ mockArticle.id }/comments/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if comment was deleted`, async () => {
      const res = await request(server).delete(`/api/articles/${ mockArticle.id }/comments/${ mockComment2.id }`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted comment if comment was deleted`, async () => {
      const res = await request(server).delete(`/api/articles/${ mockArticle.id }/comments/${ mockComment1.id }`);

      expect(res.body).toEqual(mockComment1);
    });

    it(`should return comment without deleted comment if comment was deleted`, async () => {
      await request(server).delete(`/api/articles/${ mockArticle.id }/comments/${ mockComment2.id }`);
      const res = await request(server).get(`/api/articles/${ mockArticle.id }/comments`);

      expect(res.body).not.toContainEqual(mockComment2);
    });
  });
})
;
