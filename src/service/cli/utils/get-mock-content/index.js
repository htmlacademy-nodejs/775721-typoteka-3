'use strict';

const {readContent} = require(`../../../../utils/readContent`);

module.exports.getMockContent = async (filePaths) => {
  const promises = filePaths.map((filePath) => readContent(filePath));

  return await Promise.all(promises);
};
