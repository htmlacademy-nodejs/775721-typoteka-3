`use strict`;

const fs = require(`fs`).promises;

const { FILE_MOCKS_PATH } = require(`../constants`);

const getMockData = async () => {
  try {
    const content = await fs.readFile(FILE_MOCKS_PATH);

    return [null, JSON.parse(content)];
  } catch (error) {
    return [error, []];
  }
};

exports.getMockData = getMockData;
