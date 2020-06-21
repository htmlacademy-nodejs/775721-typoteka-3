'use strict';

const fs = require(`fs`).promises;

const {FILE_MOCKS_PATH} = require(`../constants`);

let data = [];

const getMockData = async () => {
  if (data.length) {
    return data;
  }

  try {
    const content = await fs.readFile(FILE_MOCKS_PATH);

    data = JSON.parse(content);
  } catch (error) {
    console.error(error);
  }

  return data;
};

exports.getMockData = getMockData;
