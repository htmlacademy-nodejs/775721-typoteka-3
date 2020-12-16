'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../../server`);
const testDataBase = require(`../../database/test-data-base`);

describe(`Article API end-points`, () => {
  const server = createServer({dataBase: testDataBase});
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
    {
      id: 3,
      title: `Железо`,
    },
  ];
  const firstArticleData = {
    image: `item01.jpg`,
    title: `Как начать программировать за 21 день.`,
    announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
    fullText: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    categories: [1, 2],
  };
  const secondArticleData = {
    image: `item02.jpg`,
    title: `Обзор новейшего смартфона BFG-9000`,
    announce: `Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    categories: [3],
  };
  const headers = {};

  beforeEach(async () => {
    await testDataBase.resetDataBase({categories});

    await request(server).post(`/api/user`).send(userData);

    const {body: loginBody} = await request(server).post(`/api/user/login`).send({email: userData.email, password: userData.password});
    headers.authorization = `Bearer ${loginBody.accessToken} ${loginBody.refreshToken}`;

    await request(server).post(`/api/articles`).send(firstArticleData).set(headers);
    await request(server).post(`/api/articles`).send(secondArticleData).set(headers);
  });

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`GET api/articles`, () => {
    it(`should return status 200 if request was successful`, async () => {
      const res = await request(server).get(`/api/articles`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return correct quantity of articles`, async () => {
      const res = await request(server).get(`/api/articles`);

      expect(res.body.quantity).toEqual(2);
    });

    it(`should return correct articles if request was successful`, async () => {
      const expectedFirstArticle = {
        id: 1,
        image: `item01.jpg`,
        title: `Как начать программировать за 21 день.`,
        announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
        fullText: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        categories: [
          {
            id: 1,
            title: `Программирование`,
          },
          {
            id: 2,
            title: `Кино и сериалы`,
          }
        ],
        comments: [],
      };
      const expectedSecondArticle = {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [{
          id: 3,
          title: `Железо`,
        }],
        comments: [],
      };

      const res = await request(server).get(`/api/articles`);

      const [firstArticle, secondArticle] = res.body.articles;

      expect(firstArticle).toMatchObject(expectedSecondArticle);
      expect(secondArticle).toMatchObject(expectedFirstArticle);
    });

    it(`with offset = 1 should return first article`, async () => {
      const offset = 1;
      const expectedFirstArticle = {
        id: 1,
        image: `item01.jpg`,
        title: `Как начать программировать за 21 день.`,
        announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
        fullText: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        categories: [
          {
            id: 1,
            title: `Программирование`,
          },
          {
            id: 2,
            title: `Кино и сериалы`,
          }
        ],
        comments: [],
      };

      const res = await request(server).get(`/api/articles?offset=${ offset }`);
      const [firstArticle] = res.body.articles;

      expect(firstArticle).toMatchObject(expectedFirstArticle);
    });

    it(`with limit = 1 should return second article`, async () => {
      const limit = 1;
      const expectedArticle = {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [{
          id: 3,
          title: `Железо`,
        }],
        comments: [],
      };

      const res = await request(server).get(`/api/articles?limit=${ limit }`);
      const [article] = res.body.articles;

      expect(article).toMatchObject(expectedArticle);
    });

    it(`with offset = 1 and limit = 1 should return article with id = 1`, async () => {
      const offset = 1;
      const limit = 1;
      const expectedArticle = {
        id: 1,
        image: `item01.jpg`,
        title: `Как начать программировать за 21 день.`,
        announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
        fullText: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        categories: [
          {
            id: 1,
            title: `Программирование`,
          },
          {
            id: 2,
            title: `Кино и сериалы`,
          }
        ],
        comments: [],
      };

      const res = await request(server).get(`/api/articles?offset=${ offset }&limit=${ limit }`);
      const [article] = res.body.articles;

      expect(article).toMatchObject(expectedArticle);
    });

    it(`with categoryId = 1 should return articles from category "Программирование"`, async () => {
      const categoryId = 1;
      const expectedArticle = {
        id: 1,
        image: `item01.jpg`,
        title: `Как начать программировать за 21 день.`,
        announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
        fullText: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
        categories: [
          {
            id: 1,
            title: `Программирование`,
          },
          {
            id: 2,
            title: `Кино и сериалы`,
          }
        ],
        comments: [],
      };

      const res = await request(server).get(`/api/articles?categoryId=${categoryId}`);
      const [article] = res.body.articles;

      expect(article).toMatchObject(expectedArticle);
    });
  });

  describe(`GET ape/articles/most_commented`, () => {
    const firstCommentData = {
      text: `Это где ж такие красоты? Совсем немного... Давно не пользуюсь стационарными компьютерами.`,
    };
    const secondCommentData = {
      text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
    };
    const thirdCommentData = {
      text: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    };

    beforeEach(async () => {
      const {body} = await request(server).get(`/api/articles`);

      const articles = body.articles;

      await request(server).post(`/api/articles/${articles[0].id}/comments`).send(firstCommentData).set(headers);
      await request(server).post(`/api/articles/${articles[1].id}/comments`).send(secondCommentData).set(headers);
      await request(server).post(`/api/articles/${articles[1].id}/comments`).send(thirdCommentData).set(headers);
    });

    it(`should return status 200 if request was successful`, async () => {
      const res = await request(server).get(`/api/articles/most_commented`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return array with 2 articles`, async () => {
      const {body} = await request(server).get(`/api/articles/most_commented`);

      expect(body.length).toBe(2);
    });

    it(`should return array where first article with 2 comments`, async () => {
      const {body} = await request(server).get(`/api/articles/most_commented`);

      expect(body[0].commentsQuantity).toBe(`2`);
    });

    it(`should return status 500 if sent invalid params`, async () => {
      const {statusCode} = await request(server).get(`/api/articles/most_commented?limit=abc`);

      expect(statusCode).toBe(500);
    });

    it(`should return array with one article if sent limit = 1`, async () => {
      const {body} = await request(server).get(`/api/articles/most_commented?limit=1`);

      expect(body.length).toBe(1);
    });
  });

  describe(`POST api/articles`, () => {
    it(`should return status 400 if have sent title shorter than 30 letters`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent title longer than 250 letters`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent title`, async () => {
      const data = {
        image: `item01.jpg`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent not jpg or png picture`, async () => {
      const data = {
        image: `item01.gif`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent announce shorter than 30 letters`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent announce longer than 250 letters`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем. Он обязательно понравится геймерам со стажем. Он обязательно понравится геймерам со стажем. Он обязательно понравится геймерам со стажем. Он обязательно понравится геймерам со стажем. Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent announce`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent text longer than 1000 letters`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent wrong type of categories`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [{id: 1}],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent empty categories`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent category`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 401 if didn't send headers`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 201 if sent valid data`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.statusCode).toBe(201);
    });

    it(`should return article with id and sent title if sent valid data`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };
      const expectedArticle = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [{
          id: 1,
          title: `Программирование`,
        }],
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body).toMatchObject(expectedArticle);
    });

    it(`should return article without extra properties if sent data with extra property`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
        token: `token`,
      };

      const res = await request(server).post(`/api/articles`).send(data).set(headers);

      expect(res.body).not.toHaveProperty(`token`);
    });

    it(`should return articles with new article`, async () => {
      const data = {
        image: `item01.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const {body: newArticle} = await request(server).post(`/api/articles`).send(data).set(headers);
      const res = await request(server).get(`/api/articles`).set(headers);

      expect(res.body.articles).toContainEqual(newArticle);
    });
  });

  describe(`GET api/articles/:articleId`, () => {
    it(`should return status 400 if have sent invalid id`, async () => {
      const res = await request(server).get(`/api/articles/abc`);

      expect(res.statusCode).toBe(400);
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
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [{
          id: 3,
          title: `Железо`,
        }],
        comments: [],
      };

      expect(res.body).toMatchObject(expectedArticle);
    });
  });

  describe(`PUT api/articles/:articleId`, () => {
    it(`should return status 400 if have sent invalid id`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [2],
      };
      const res = await request(server).put(`/api/articles/abc`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [2],
      };
      const res = await request(server).put(`/api/articles/1234`).send(data).set(headers);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if have sent title shorter than 30 letters`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent title longer than 250 letters`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent title`, async () => {
      const data = {
        image: `item02.jpg`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent not jpg or png picture`, async () => {
      const data = {
        image: `item02.gif`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent announce shorter than 30 letters`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent announce longer than 250 letters`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем. Он обязательно понравится геймерам со стажем. Он обязательно понравится геймерам со стажем. Он обязательно понравится геймерам со стажем. Он обязательно понравится геймерам со стажем. Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent announce`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent text longer than 1000 letters`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [1],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent wrong type of categories`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [{id: 1}],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent empty categories`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Он обязательно понравится геймерам со стажем.`,
        fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent category`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-3000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
      };
      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 401 if didn't send valid headers`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [2],
      };
      const res = await request(server).put(`/api/articles/1`).send(data);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 403 if tried to update someone else's article`, async () => {
      const secondUserData = {
        firstName: `Ivan`,
        lastName: `Ivanov`,
        email: `ivanIvamon@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };
      await request(server).post(`/api/user`).send(secondUserData);

      const {body: loginBody} = await request(server).post(`/api/user/login`).send({email: secondUserData.email, password: secondUserData.password});
      const authorizationHeader = `Bearer ${loginBody.accessToken} ${loginBody.refreshToken}`;

      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [2],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set({authorization: authorizationHeader});

      expect(res.statusCode).toBe(403);
    });

    it(`should return status 200 if article was updated`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [2],
      };
      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.statusCode).toBe(200);
    });

    it(`should return article with updated title if article was updated`, async () => {
      const data = {
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [2],
      };
      const expectedArticle = {
        id: 1,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [{
          id: 2,
          title: `Кино и сериалы`,
        }],
      };

      const res = await request(server).put(`/api/articles/1`).send(data).set(headers);

      expect(res.body).toMatchObject(expectedArticle);
    });
  });

  describe(`DELETE api/articles/:articleId`, () => {
    it(`should return status 400 if have sent invalid id`, async () => {
      const res = await request(server).delete(`/api/articles/abc`).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 404 if articles doesn't exist`, async () => {
      const res = await request(server).delete(`/api/articles/1234`).set(headers);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 401 if didn't send headers`, async () => {
      const res = await request(server).delete(`/api/articles/2`);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 403 if tried to delete someone else's article`, async () => {
      const secondUserData = {
        firstName: `Ivan`,
        lastName: `Ivanov`,
        email: `ivanIvamon@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };
      await request(server).post(`/api/user`).send(secondUserData);

      const {body: loginBody} = await request(server).post(`/api/user/login`).send({email: secondUserData.email, password: secondUserData.password});
      const authorizationHeader = `Bearer ${loginBody.accessToken} ${loginBody.refreshToken}`;

      const res = await request(server).delete(`/api/articles/2`).set({authorization: authorizationHeader});

      expect(res.statusCode).toBe(403);
    });

    it(`should return status 200 if articles was deleted`, async () => {
      const res = await request(server).delete(`/api/articles/2`).set(headers);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted article if article was deleted`, async () => {
      const expectedArticle = {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [{
          id: 3,
          title: `Железо`,
        }],
      };

      const res = await request(server).delete(`/api/articles/2`).set(headers);

      expect(res.body).toMatchObject(expectedArticle);
    });

    it(`should return articles without deleted article`, async () => {
      const expectedArticle = {
        id: 2,
        image: `item02.jpg`,
        title: `Обзор новейшего смартфона BFG-9000`,
        announce: `Простые ежедневные упражнения помогут достичь успеха.`,
        fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
        categories: [{
          id: 1,
          title: `Программирование`,
        }],
      };

      await request(server).delete(`/api/articles/2`);
      const res = await request(server).get(`/api/articles`).set(headers);

      expect(res.body).not.toContainEqual(expectedArticle);
    });
  });
});
