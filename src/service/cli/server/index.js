`use strict`;

const express = require(`express`);
const chalk = require(`chalk`);

const { getMockData } = require(`../../lib/get-mock-data`);
const { MODULE_NAME, DEFAULT_PORT, Message } = require(`./constants`);
const { HttpStatusCode } = require(`../../../constants`);

const app = express();

const router = new express.Router();

router.get(`/posts`, async (req, res) => {
  try {
    const [error, mocks] = await getMockData();

    if (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(mocks);
    }

    res.json(mocks);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json([]);
  }
});

app.use(express.json());

app.use(router);

app.use((req, res) => res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(Message.NOT_FOUND));

module.exports = {
  name: MODULE_NAME,
  run(parameters) {
    const [customPort] = parameters;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => console.info(chalk.green(`Принимаю подключения на ${ port }`)));
  }
}
