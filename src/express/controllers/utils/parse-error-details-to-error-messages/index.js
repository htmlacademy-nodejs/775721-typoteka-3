'use strict';

exports.parseErrorDetailsToErrorMessages = (details) => details.reduce((messages, {path, message}) => {
  const key = path.toString();

  messages[key] = message;

  return messages;
}, {});
