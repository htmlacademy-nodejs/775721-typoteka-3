'use strict';

const {describe, it, expect, beforeEach, afterAll} = require(`@jest/globals`);
const request = require(`supertest`);

const {createServer} = require(`../../server`);
const testDataBase = require(`../../database/test-data-base`);

describe(`User API end-points`, () => {
  const server = createServer({dataBase: testDataBase});

  afterAll(() => {
    testDataBase.sequelize.close();
  });

  describe(`POST api/user`, () => {
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Иванович`,
        email: `ivan@mail.com`,
        password: `123456`,
        avatar: `avatar01.jpg`,
      },
    ];

    beforeEach(async () => {
      await testDataBase.resetDataBase({users});
    });

    it(`should return status 400 if firstName contain numbers`, async () => {
      const data = {
        firstName: `James1`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if firstName contain special symbols`, async () => {
      const data = {
        firstName: `James@#!`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if firstName longer than 50 letters`, async () => {
      const data = {
        firstName: `JamesJamesJamesJamesJamesJamesJamesJamesJamesJamesJamesJames`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent firstName`, async () => {
      const data = {
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if lastName contain numbers`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond1`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if lastName contain special symbols`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond@#!`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if lastName longer than 50 letters`, async () => {
      const data = {
        firstName: `James`,
        lastName: `BondBondBondBondBondBondBondBondBondBondBondBondBondBondBondBond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent lastName`, async () => {
      const data = {
        firstName: `James`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent invalid email`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have password shorter than 6 symbols`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123`,
        passwordRepeat: `123`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent password`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if haven't sent passwordRepeat`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if password and passwordRepeat are not equal`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123457`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if have sent not jpg or png avatar`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.gif`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if exist user with the same email`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `ivan@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.jpg`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 201 if have sent valid data`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return status 201 if have sent cyrillic symbols`, async () => {
      const data = {
        firstName: `Иван`,
        lastName: `Иванович`,
        email: `ivan-ivanovich@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };
      const res = await request(server).post(`/api/user`).send(data);

      expect(res.statusCode).toBe(201);
    });

    it(`should return user data with id and password if have sent valid data`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };

      const expectedUserData = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        avatar: `avatar.png`,
      };

      const {body} = await request(server).post(`/api/user`).send(data);

      expect(body).toHaveProperty(`id`);
      expect(body).toHaveProperty(`password`);
      expect(body).toMatchObject(expectedUserData);
    });

    it(`should return the hash sum of the password`, async () => {
      const data = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };

      const {body} = await request(server).post(`/api/user`).send(data);

      expect(body.password).not.toEqual(data.password);
    });
  });

  describe(`POST api/user/login`, () => {
    const PATH = `/api/user/login`;

    beforeEach(async () => {
      const userData = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };

      await testDataBase.resetDataBase();
      await request(server).post(`/api/user`).send(userData);
    });

    it(`should return status 400 if sent invalid email`, async () => {
      const data = {
        email: `jamesBond@mail`,
        password: `123456`,
      };
      const res = await request(server).post(PATH).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if didn't send email`, async () => {
      const data = {
        password: `123456`,
      };
      const res = await request(server).post(PATH).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if password shorter than 6 symbols`, async () => {
      const data = {
        email: `jamesBond@mail.com`,
        password: `123`,
      };
      const res = await request(server).post(PATH).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if didn't send password`, async () => {
      const data = {
        email: `jamesBond@mail.com`,
      };
      const res = await request(server).post(PATH).send(data);

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 403 if didn't find user with email ivan_ivanov@mail.com`, async () => {
      const data = {
        email: `ivan_ivanov@mail.com`,
        password: `123456`,
      };
      const res = await request(server).post(PATH).send(data);

      expect(res.statusCode).toBe(403);
    });

    it(`should return status 403 if sent incorrect password`, async () => {
      const data = {
        email: `jamesBond@mail.com`,
        password: `654321`,
      };
      const res = await request(server).post(PATH).send(data);

      expect(res.statusCode).toBe(403);
    });

    it(`should return status 200 if sent correct data`, async () => {
      const data = {
        email: `jamesBond@mail.com`,
        password: `123456`,
      };
      const res = await request(server).post(PATH).send(data);

      expect(res.statusCode).toBe(200);
    });

    it(`should return access and refresh tokens if sent correct data`, async () => {
      const data = {
        email: `jamesBond@mail.com`,
        password: `123456`,
      };
      const {body} = await request(server).post(PATH).send(data);

      expect(body).toHaveProperty(`accessToken`);
      expect(body).toHaveProperty(`refreshToken`);
    });

    it(`should return user information if sent correct data`, async () => {
      const data = {
        email: `jamesBond@mail.com`,
        password: `123456`,
      };
      const expectedUserData = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
      };

      const {body: {user}} = await request(server).post(PATH).send(data);

      expect(user).toMatchObject(expectedUserData);
    });
  });

  describe(`POST api/user/refresh`, () => {
    const PATH = `/api/user/refresh`;

    beforeEach(async () => {
      const tokens = [
        {
          id: 1,
          value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjA1NzEzMTc2fQ.hzY0AvYGpeBagHnrECWH46apmpK9p8xJ8cUhFCI3z3Y`,
        }
      ];
      const users = [
        {
          id: 1,
          firstName: `James`,
          lastName: `Bond`,
          email: `jamesBond@mail.com`,
          password: `123456`,
          avatar: `avatar.png`,
        }
      ];

      await testDataBase.resetDataBase({tokens, users});
    });

    it(`should return status 400 if sent invalid token`, async () => {
      const token = {};
      const res = await request(server).post(PATH).send({token});

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if dint send token`, async () => {
      const res = await request(server).post(PATH).send({});

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 404 if didnt find token`, async () => {
      const token = `abc`;
      const res = await request(server).post(PATH).send({token});

      expect(res.statusCode).toBe(404);
    });

    it(`should return status 200 if token was refreshed`, async () => {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjA1NzEzMTc2fQ.hzY0AvYGpeBagHnrECWH46apmpK9p8xJ8cUhFCI3z3Y`;
      const res = await request(server).post(PATH).send({token});

      expect(res.statusCode).toBe(200);
    });

    it(`should return new access and refresh tokens if token was refreshed`, async () => {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjA1NzEzMTc2fQ.hzY0AvYGpeBagHnrECWH46apmpK9p8xJ8cUhFCI3z3Y`;
      const {body} = await request(server).post(PATH).send({token});

      expect(body).toHaveProperty(`accessToken`);
      expect(body).toHaveProperty(`refreshToken`);
    });

    it(`should return user information if token was refreshed`, async () => {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjA1NzEzMTc2fQ.hzY0AvYGpeBagHnrECWH46apmpK9p8xJ8cUhFCI3z3Y`;
      const expectedUserData = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
      };
      const {body: {user}} = await request(server).post(PATH).send({token});

      expect(user).toMatchObject(expectedUserData);
    });

    it(`should return another refresh token if token was refreshed`, async () => {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjA1NzEzMTc2fQ.hzY0AvYGpeBagHnrECWH46apmpK9p8xJ8cUhFCI3z3Y`;
      const res = await request(server).post(PATH).send({token});

      expect(res.body.refreshToken).not.toEqual(token);
    });

    it(`should return status 404 when trying to refresh token with old token`, async () => {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjA1NzEzMTc2fQ.hzY0AvYGpeBagHnrECWH46apmpK9p8xJ8cUhFCI3z3Y`;

      await request(server).post(PATH).send({token});

      const res = await request(server).post(PATH).send({token});

      expect(res.statusCode).toBe(404);
    });
  });

  describe(`DELETE api/user/logout`, () => {
    const PATH = `/api/user/logout`;
    const users = [
      {
        id: 1,
        firstName: `Иван`,
        lastName: `Иванович`,
        email: `ivan@mail.com`,
        password: `123456`,
        avatar: `avatar01.jpg`,
      },
    ];

    let accessToken;
    let refreshToken;

    beforeEach(async () => {
      const userData = {
        firstName: `James`,
        lastName: `Bond`,
        email: `jamesBond@mail.com`,
        password: `123456`,
        passwordRepeat: `123456`,
        avatar: `avatar.png`,
      };

      await testDataBase.resetDataBase({users});
      await request(server).post(`/api/user`).send(userData);

      const {body} = await request(server).post(`/api/user/login`).send({
        email: userData.email,
        password: userData.password
      });

      accessToken = body.accessToken;
      refreshToken = body.refreshToken;
    });

    it(`should return status 400 if sent invalid token`, async () => {
      const res = await request(server).delete(PATH).send({token: {}}).set({authorization: `Bearer ${accessToken} ${refreshToken}`});

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 400 if dint send token`, async () => {
      const res = await request(server).delete(PATH).send({}).set({authorization: `Bearer ${accessToken} ${refreshToken}`});

      expect(res.statusCode).toBe(400);
    });

    it(`should return status 403 if sent invalid access token`, async () => {
      const invalidToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjA1NzgyNzkwLCJleHAiOjE2MDU3ODI4NDB9.Oy_c5Bw6MjOZwzMB8vtfdsaKCapJTYkGEpy9CgDRJUM`;
      const res = await request(server).delete(PATH).send({token: refreshToken}).set({authorization: `Bearer ${invalidToken} ${refreshToken}`});

      expect(res.statusCode).toBe(403);
    });

    it(`should return status 204 if sent unknown token`, async () => {
      const token = `asd`;
      const res = await request(server).delete(PATH).send({token}).set({authorization: `Bearer ${accessToken} ${refreshToken}`});

      expect(res.statusCode).toBe(204);
    });

    it(`should return status 204 if token was deleted`, async () => {
      const res = await request(server).delete(PATH).send({token: refreshToken}).set({authorization: `Bearer ${accessToken} ${refreshToken}`});

      expect(res.statusCode).toBe(204);
    });

    it(`should return status 404 when trying to refresh token with old token`, async () => {
      await request(server).delete(PATH).send({token: refreshToken}).set({authorization: `Bearer ${accessToken} ${refreshToken}`});

      const res = await request(server).post(`/api/user/refresh`).send({token: refreshToken});

      expect(res.statusCode).toBe(404);
    });
  });
});
