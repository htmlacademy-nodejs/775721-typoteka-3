`use strict`;

const { MODULE_NAME, MESSAGE } = require(`./constants`);

module.exports = {
  name: MODULE_NAME,
  run() {
    console.info(MESSAGE);
  }
}
