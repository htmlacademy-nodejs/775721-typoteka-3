'use strict';

const {sign} = require(`jsonwebtoken`);

const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN} = require(`../../config`);

module.exports.makeTokens = (tokenData) => {
  const accessToken = sign(tokenData, JWT_ACCESS_SECRET, {
    expiresIn: `${JWT_EXPIRES_IN}s`,
  });
  const refreshToken = sign(tokenData, JWT_REFRESH_SECRET);

  return {
    accessToken,
    refreshToken
  };
};
