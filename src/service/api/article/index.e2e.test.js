'use strict';

const {describe, it, expect, beforeEach} = require(`@jest/globals`);

const request = require(`supertest`);

const {createServer} = require(`../../server`);

describe(`Article API end-points`, () => {
  describe(`GET api/articles`, () => {
    const mockArticles = [
      {
        id: `BNe8ED`,
        title: `Как начать программировать`,
        createdDate: `20.05.2020, 04:51:59`,
        announce: `Первая большая ёлка была установлена только в 1938 году.`,
        fullText: `Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
        category: [
          `Без рамки`,
          `Музыка`,
          `За жизнь`,
          `Железо`,
        ],
        comments: [
          {
            'id': `bA0DIb`,
            'text': `Плюсую, но слишком много буквы!`,
          },
          {
            'id': `hpnG7J`,
            'text': `Это где ж такие красоты? Планируете записать видосик на эту тему?`,
          },
        ],
      },
      {
        id: `8MqcDu`,
        title: `Ёлки. История деревьев`,
        createdDate: `21.05.2020, 08:55:16`,
        announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Программировать не настолько сложно, как об этом говорят. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов.`,
        fullText: `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
        category: [
          `За жизнь`,
          `Программирование`,
          `IT`,
        ],
        comments: [
          {
            'id': `ENMOl2`,
            'text': `Совсем немного... Это где ж такие красоты? Согласен с автором!`,
          },
        ],
      },
    ];
    let server;

    beforeEach(async () => {
      server = await createServer({articles: mockArticles});
    });

    it(`should return status 200 if request was successful`, async () => {
      const res = await request(server).get(`/api/articles`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return correct articles if request was successful`, async () => {
      const res = await request(server).get(`/api/articles`);

      expect(res.body).toEqual(mockArticles);
    });
  });

  describe(`POST api/articles`, () => {
    let server;

    beforeEach(async () => {
      server = await createServer({articles: []});
    });

    it(`should return status 400 if didn't send category`, async () => {
      const data = {
        title: `Заголовок`,
        announce: `Announce`,
        fullText: `FullText`,
      };

      const res = await request(server).post(`/api/articles`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if sent valid data`, async () => {
      const data = {
        title: `Заголовок`,
        announce: `Announce`,
        fullText: `FullText`,
        category: [`Категория`],
      };

      const res = await request(server).post(`/api/articles`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return article with id and sent title if sent valid data`, async () => {
      const data = {
        title: `Заголовок`,
        announce: `Announce`,
        fullText: `FullText`,
        category: [`Категория`],
      };

      const res = await request(server).post(`/api/articles`).send(data);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body.title).toBe(data.title);
    });

    it(`should return article without extra properties if sent data with extra property`, async () => {
      const data = {
        title: `Заголовок`,
        announce: `Announce`,
        fullText: `FullText`,
        category: [`Категория`],
        token: `token`,
      };

      const res = await request(server).post(`/api/articles`).send(data);

      expect(res.body).not.toHaveProperty(`token`);
    });

    it(`should return articles with new article`, async () => {
      const data = {
        title: `Заголовок`,
        announce: `Announce`,
        fullText: `FullText`,
        category: [`Категория`],
        token: `token`,
      };

      const {body: newArticle} = await request(server).post(`/api/articles`).send(data);
      const res = await request(server).get(`/api/articles`);

      expect(res.body).toContainEqual(newArticle);
    });
  });

  describe(`GET api/articles/:articleId`, () => {
    const mockArticle = {
      id: `BNe8ED`,
      title: `Как начать программировать`,
      createdDate: `20.05.2020, 04:51:59`,
      announce: `Первая большая ёлка была установлена только в 1938 году.`,
      fullText: `Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
      category: [
        `Без рамки`,
        `Музыка`,
        `За жизнь`,
        `Железо`,
      ],
      comments: [
        {
          id: `bA0DIb`,
          text: `Плюсую, но слишком много буквы!`,
        },
        {
          id: `hpnG7J`,
          text: `Это где ж такие красоты? Планируете записать видосик на эту тему?`,
        },
      ],
    };
    const mockArticles = [mockArticle];
    let server;

    beforeEach(async () => {
      server = await createServer({articles: mockArticles});
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const res = await request(server).get(`/api/articles/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if article exists`, async () => {
      const res = await request(server).get(`/api/articles/${ mockArticle.id }`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return article if article exists`, async () => {
      const res = await request(server).get(`/api/articles/${ mockArticle.id }`);

      expect(res.body).toEqual(mockArticle);
    });
  });

  describe(`PUT api/articles/:articleId`, () => {
    const mockArticle = {
      id: `BNe8ED`,
      title: `Как начать программировать`,
      createdDate: `20.05.2020, 04:51:59`,
      announce: `Первая большая ёлка была установлена только в 1938 году.`,
      fullText: `Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
      category: [
        `Без рамки`,
        `Музыка`,
        `За жизнь`,
        `Железо`,
      ],
      comments: [
        {
          id: `bA0DIb`,
          text: `Плюсую, но слишком много буквы!`,
        },
        {
          id: `hpnG7J`,
          text: `Это где ж такие красоты? Планируете записать видосик на эту тему?`,
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
        title: `Заголовок`,
        announce: `Announce`,
        fullText: `FullText`,
        category: [`Категория`],
      };
      const res = await request(server).put(`/api/articles/1234`).send(data);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if didn't send title`, async () => {
      const data = {
        announce: `Announce`,
        fullText: `FullText`,
        category: [`Категория`],
      };
      const res = await request(server).put(`/api/articles/${ mockArticle.id }`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 200 if article was updated`, async () => {
      const data = {
        title: `Заголовок`,
        announce: `Announce`,
        fullText: `FullText`,
        category: [`Категория`],
      };
      const res = await request(server).put(`/api/articles/${ mockArticle.id }`).send(data);

      expect(res.statusCode).toBe(200);
    });

    it(`should return article with updated title if article was updated`, async () => {
      const data = {
        title: `Заголовок`,
        announce: `Announce`,
        fullText: `FullText`,
        category: [`Категория`],
      };
      const res = await request(server).put(`/api/articles/${ mockArticle.id }`).send(data);

      expect(res.body.title).toBe(data.title);
    });
  });

  describe(`DELETE api/articles/:articleId`, () => {
    const mockArticle1 = {
      id: `BNe8ED`,
      title: `Как начать программировать`,
      createdDate: `20.05.2020, 04:51:59`,
      announce: `Первая большая ёлка была установлена только в 1938 году.`,
      fullText: `Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
      category: [
        `Без рамки`,
        `Музыка`,
        `За жизнь`,
        `Железо`,
      ],
      comments: [
        {
          id: `bA0DIb`,
          text: `Плюсую, но слишком много буквы!`,
        },
        {
          id: `hpnG7J`,
          text: `Это где ж такие красоты? Планируете записать видосик на эту тему?`,
        },
      ],
    };
    const mockArticle2 = {
      id: `8MqcDu`,
      title: `Ёлки. История деревьев`,
      createdDate: `21.05.2020, 08:55:16`,
      announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Программировать не настолько сложно, как об этом говорят. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов.`,
      fullText: `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
      category: [
        `За жизнь`,
        `Программирование`,
        `IT`,
      ],
      comments: [
        {
          'id': `ENMOl2`,
          'text': `Совсем немного... Это где ж такие красоты? Согласен с автором!`,
        },
      ],
    };
    const mockArticles = [mockArticle1, mockArticle2];
    let server;

    beforeEach(async () => {
      server = await createServer({articles: mockArticles});
    });

    it(`should return status 404 if articles doesn't exist`, async () => {
      const res = await request(server).delete(`/api/articles/1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if articles was deleted`, async () => {
      const res = await request(server).delete(`/api/articles/${ mockArticle2.id }`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted article if article was deleted`, async () => {
      const res = await request(server).delete(`/api/articles/${ mockArticle2.id }`);

      expect(res.body).toEqual(mockArticle2);
    });

    it(`should return article if articles was deleted`, async () => {
      const res = await request(server).delete(`/api/articles/${ mockArticle2.id }`);

      expect(res.body).toEqual(mockArticle2);
    });

    it(`should return articles without deleted article`, async () => {
      await request(server).delete(`/api/articles/${ mockArticle2.id }`);
      const res = await request(server).get(`/api/articles`);

      expect(res.body).not.toContainEqual(mockArticle2);
    });
  });
});
