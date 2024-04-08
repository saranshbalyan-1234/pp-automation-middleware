const pkg = require("jsonwebtoken");
const { sign } = pkg;

const createToken = async (data, secret, expiration) => {
  let options = {};
  if (expiration) options.expiresIn = expiration;
  return sign(data, secret, options);
};

const getTokenError = (e, type) => {
  switch (e.name) {
    case "TokenExpiredError":
      return `${type} Token Expired`;
    default:
      return `Invalid ${type} Found`;
  }
};
const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else return null;
};

module.exports = { createToken, getTokenError, extractToken };
