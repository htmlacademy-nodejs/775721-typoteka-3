`use strict`;

const http = require(`http`);
const fs = require(`fs`).promises;

const chalk = require(`chalk`);

const { MODULE_NAME, DEFAULT_PORT, Message } = require(`./constants`);
const { HttpStatusCode, ExitCode, FILE_MOCKS_PATH } = require(`../../constants`);

const sendHtml = (response, statusCode, body) => {
  const html = `
    <!doctype html>
      <html lang="ru">
      <head>
        <title>Типотека</title>
      </head>
      <body>${ body }</body>
    </html>`.trim();

  response.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  response.end(html);
};

const onClientRequest = async (request, response) => {
  switch (request.url) {
    case `/`: {
      try {
        const content = await fs.readFile(FILE_MOCKS_PATH);
        const mocks = JSON.parse(content);
        const headers = mocks.map(({ title }) => `<li>${ title }</li>`).join(``);
        const headersList = `<ul>${ headers }</ul>`;

        sendHtml(response, HttpStatusCode.OK, headersList);
      } catch (error) {
        sendHtml(response, HttpStatusCode.NOT_FOUND, Message.NOT_FOUND);
      }

      break;
    }

    default: {
      sendHtml(response, HttpStatusCode.NOT_FOUND, Message.NOT_FOUND);

      break;
    }
  }
};

module.exports = {
  name: MODULE_NAME,
  run(parameters) {
    const [customPort] = parameters;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const httpServer = http.createServer(onClientRequest);

    httpServer.listen(port, (error) => {
      if (error) {
        console.error(chalk.red(`Ошибка при создании http-сервера.`, error));

        return process.exit(ExitCode.ERROR);
      }

      return console.info(chalk.green(`Принимаю подключения на ${ port }`));
    });
  }
}
