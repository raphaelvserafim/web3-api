const dotenv = require('dotenv');
dotenv.config();

const Env = {
  KEYSTORE_TOKEN: process.env.KEYSTORE_TOKEN || false,
  PORT: process.env.PORT || 3001,
}

module.exports = Env;
