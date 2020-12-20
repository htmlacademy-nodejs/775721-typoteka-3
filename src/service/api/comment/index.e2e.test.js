'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../../server`);
const testDataBase = require(`../../database/test-data-base`);

describe(`Comment API end-points`, () => {
  const server = createServer({dataBase: testDataBase});
  const categories = [
    {
      id: 1,
      title: `Программирование`,
    },
  ];
  const userData = {
    firstName: `James`,
    lastName: `Bond`,
    email: `jamesBond@mail.com`,
    password: `123456`,
    passwordRepeat: `123456`,
    avatar: `avatar.png`,
  };
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
    categories: [1],
  };
  const headers = {};
  let articleId;

  beforeEach(async () => {
    await testDataBase.resetDataBase({categories});
    await request(server).post(`/api/user`).send(userData);

    const {body: loginBody} = await request(server).post(`/api/user/login`).send({email: userData.email, password: userData.password});

    headers.authorization = `Bearer ${loginBody.accessToken} ${loginBody.refreshToken}`;

    await request(server).post(`/api/articles`).send(firstArticleData).set(headers);
    await request(server).post(`/api/articles`).send(secondArticleData).set(headers);

    const {body: articlesBody} = await request(server).get(`/api/articles`);

    const articles = articlesBody.articles;

    articleId = articles[0].id;

    await request(server).post(`/api/comments`).send({
      articleId,
      text: `Это где ж такие красоты? Совсем немного... Давно не пользуюсь стационарными компьютерами.`,
    }).set(headers);
    await request(server).post(`/api/comments`).send({
      articleId,
      text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
    }).set(headers);
    await request(server).post(`/api/comments`).send({
      articleId: articles[1].id,
      text: `Совсем немного... Давно не пользуюсь стационарными компьютерами. Это где ж такие красоты?`,
    }).set(headers);
  });

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`GET api/comments`, () => {
    it(`should return status 200 if request was successful`, async () => {
      const res = await request(server).get(`/api/comments`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return array of 3 comments`, async () => {
      const res = await request(server).get(`/api/comments`);

      expect(res.body.length).toBe(3);
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const res = await request(server).get(`/api/comments?articleId=1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if article exist`, async () => {
      const res = await request(server).get(`/api/comments?articleId=${articleId}`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return status 404 if user doesn't exist`, async () => {
      const res = await request(server).get(`/api/comments?userId=1234`);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if user exist`, async () => {
      const res = await request(server).get(`/api/comments?userId=1`);

      expect(res.statusCode).toBe(200);
    });

    it(`should return 2 comments of second article`, async () => {
      const expectedFirstComment = {
        articleId,
        message: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      };
      const expectedSecondComment = {
        articleId,
        message: `Это где ж такие красоты? Совсем немного... Давно не пользуюсь стационарными компьютерами.`,
      };

      const res = await request(server).get(`/api/comments?articleId=${articleId}`);
      const [firstComment, secondComment] = res.body;

      expect(firstComment).toMatchObject(expectedFirstComment);
      expect(secondComment).toMatchObject(expectedSecondComment);
    });
  });

  describe(`POST api/comments`, () => {
    it(`should return status 404 if article doesn't exist`, async () => {
      const data = {
        articleId: `1234`,
        text: `New awesome user's comment`,
      };
      const res = await request(server).post(`/api/comments`).send(data).set(headers);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if have sent text shorter that 20 letters`, async () => {
      const data = {
        articleId,
        text: `New comment`,
      };
      const res = await request(server).post(`/api/comments`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if didnt send text`, async () => {
      const data = {
        articleId,
        message: `New awesome user's comment`,
      };
      const res = await request(server).post(`/api/comments`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if didnt send articleId`, async () => {
      const data = {
        message: `New awesome user's comment`,
      };
      const res = await request(server).post(`/api/comments`).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 401 if didnt send authorization headers`, async () => {
      const data = {
        articleId,
        text: `New awesome user's comment`,
      };
      const res = await request(server).post(`/api/comments`).send(data);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 201 if new comment was created`, async () => {
      const data = {
        articleId,
        text: `New awesome user's comment`,
      };
      const res = await request(server).post(`/api/comments`).send(data).set(headers);

      expect(res.statusCode).toBe(201);
    });

    it(`should return new comment if new comment was created`, async () => {
      const data = {
        articleId,
        text: `New awesome user's comment`,
      };
      const expectedComment = {
        articleId,
        message: `New awesome user's comment`,
      };

      const res = await request(server).post(`/api/comments`).send(data).set(headers);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body).toMatchObject(expectedComment);
    });

    it(`should return comments with new comment if new comment was created`, async () => {
      const data = {
        articleId,
        text: `New awesome user's comment`,
      };
      const {body: newComment} = await request(server).post(`/api/comments`).send(data).set(headers);
      const res = await request(server).get(`/api/comments`).set(headers);

      expect(res.body).toContainEqual(newComment);
    });
  });

  describe(`DELETE api/comments/:commentId`, () => {
    let commentId;

    beforeEach(async () => {
      const res = await request(server).get(`/api/comments`);

      commentId = res.body[0].id;
    });

    it(`should return status 400 if have sent invalid comment id`, async () => {
      const res = await request(server).delete(`/api/comments/abc`).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 404 if comment doesn't exist`, async () => {
      const res = await request(server).delete(`/api/comments/1234`).set(headers);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 401 if haven't sent headers`, async () => {
      const res = await request(server).delete(`/api/comments/${commentId}`);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 403 if tried to delete someone else's comment`, async () => {
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

      const res = await request(server).delete(`/api/comments/${commentId}`).set({authorization: authorizationHeader});

      expect(res.statusCode).toBe(403);
    });

    it(`should return status 200 if comment was deleted`, async () => {
      const res = await request(server).delete(`/api/comments/${commentId}`).set(headers);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted comment if comment was deleted`, async () => {
      const expectedComment = {
        message: `Совсем немного... Давно не пользуюсь стационарными компьютерами. Это где ж такие красоты?`,
      };

      const res = await request(server).delete(`/api/comments/${commentId}`).set(headers);

      expect(res.body).toMatchObject(expectedComment);
    });

    it(`should return comments without deleted comment if comment was deleted`, async () => {
      const {body: deletedComment} = await request(server).delete(`/api/comments/${commentId}`).set(headers);
      const res = await request(server).get(`/api/comments`);

      expect(res.body).not.toContainEqual(deletedComment);
    });
  });
});
