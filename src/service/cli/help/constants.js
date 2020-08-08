'use strict';

module.exports = {
  MODULE_NAME: `--help`,
  MESSAGE: `
    Программа запускает http-сервер и формирует файл с данными для API.

      Гайд:
        service.js <command>

      Команды:
        --version:            выводит номер версии
        --help:               печатает этот текст
        --generate <count>:   формирует файл mocks.json
        --server <port>:      запускает http-сервер
        --fill <count>:       формирует файл с запросами для начального заполнения
                              БД указанным кол-вом объявлений
        --fill-db <count>:    УДАЛЯЕТ все данные в базе данных и заполняет её начальными данными.
  `,
};
