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
  const articleData = {
    image: `item01.jpg`,
    title: `Как начать программировать за 21 день.`,
    announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
    fullText: `Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    categories: [1],
  };
  const firstCommentData = {
    text: `Это где ж такие красоты? Совсем немного... Давно не пользуюсь стационарными компьютерами.`,
  };
  const secondCommentData = {
    text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
  };
  const headers = {};
  let articles = [];
  let articleId;
  let articleCommentsPath;

  beforeEach(async () => {
    await testDataBase.resetDataBase({categories});
    await request(server).post(`/api/user`).send(userData);

    const {body: loginBody} = await request(server).post(`/api/user/login`).send({email: userData.email, password: userData.password});

    headers.authorization = `Bearer ${loginBody.accessToken} ${loginBody.refreshToken}`;

    await request(server).post(`/api/articles`).send(articleData).set(headers);

    const {body: articlesBody} = await request(server).get(`/api/articles`).send(articleData);

    articles = articlesBody.articles;
    articleId = articles[0].id;
    articleCommentsPath = `/api/articles/${articleId}/comments`;
  });

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`GET api/articles/:articleId/comments`, () => {
    beforeEach(async () => {
      await request(server).post(articleCommentsPath).send(firstCommentData).set(headers);
      await request(server).post(articleCommentsPath).send(secondCommentData).set(headers);
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
    it(`should return status 404 if article doesn't exist`, async () => {
      const data = {
        text: `New comment`,
      };
      const res = await request(server).post(`/api/articles/1234/comments`).send(data).set(headers);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 400 if have sent text shorter that 20 letters`, async () => {
      const data = {
        text: `New comment`,
      };
      const res = await request(server).post(articleCommentsPath).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if didnt send text`, async () => {
      const data = {
        message: `New comment`,
      };
      const res = await request(server).post(articleCommentsPath).send(data).set(headers);

      expect(res.statusCode).toBe(400);
    });


    it(`should return status 401 if didnt send authorization headers`, async () => {
      const data = {
        text: `New comment`,
      };
      const res = await request(server).post(articleCommentsPath).send(data);

      expect(res.statusCode).toBe(401);
    });

    it(`should return status 201 if new comment was created`, async () => {
      const data = {
        text: `New awesome user's comment`,
      };
      const res = await request(server).post(articleCommentsPath).send(data).set(headers);

      expect(res.statusCode).toBe(201);
    });

    it(`should return new comment if new comment was created`, async () => {
      const data = {
        text: `New awesome user's comment`,
      };
      const expectedComment = {
        message: `New awesome user's comment`,
      };

      const res = await request(server).post(articleCommentsPath).send(data).set(headers);

      expect(res.body).toHaveProperty(`id`);
      expect(res.body).toMatchObject(expectedComment);
    });

    it(`should return comments with new comment if new comment was created`, async () => {
      const data = {
        text: `New awesome user's comment`,
      };
      const {body: newComment} = await request(server).post(articleCommentsPath).send(data).set(headers);
      const res = await request(server).get(articleCommentsPath).set(headers);

      expect(res.body).toContainEqual(newComment);
    });
  });

  describe(`DELETE api/articles/:articleId/comments/:commentId`, () => {
    let comments = [];
    let commentId;

    beforeEach(async () => {
      await request(server).post(articleCommentsPath).send(firstCommentData).set(headers);
      await request(server).post(articleCommentsPath).send(secondCommentData).set(headers);

      const {body: commentsBody} = await request(server).get(articleCommentsPath);

      comments = commentsBody;
      commentId = commentsBody[1].id;
    });

    it(`should return status 400 if have sent invalid article id`, async () => {
      const res = await request(server).delete(`/api/articles/abc/comments/${comments[0].id}`).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent invalid comment id`, async () => {
      const res = await request(server).delete(`/api/articles/${articleId}/comments/abc`).set(headers);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 404 if article doesn't exist`, async () => {
      const res = await request(server).delete(`/api/articles/1234/comments/1`).set(headers);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 404 if comment doesn't exist`, async () => {
      const res = await request(server).delete(`/api/articles/${articleId}/comments/1234`).set(headers);

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 401 if haven't sent headers`, async () => {
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

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

      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`).set({authorization: authorizationHeader});

      expect(res.statusCode).toBe(403);
    });

    it(`should return status 200 if comment was deleted`, async () => {
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`).set(headers);

      expect(res.statusCode).toBe(200);
    });

    it(`should return deleted comment if comment was deleted`, async () => {
      const expectedComment = {
        message: secondCommentData.text,
      };

      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`).set(headers);

      expect(res.body).toMatchObject(expectedComment);
    });

    it(`should return comments without deleted comment if comment was deleted`, async () => {
      const {body: deletedComment} = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`).set(headers);
      const res = await request(server).get(articleCommentsPath).set(headers);

      expect(res.body).not.toContainEqual(deletedComment);
    });
  });
});
