const dotenv = require('dotenv');
dotenv.config();

const Env = {
  KEYSTORE_TOKEN: process.env.KEYSTORE_TOKEN || false
}

module.exports = Env;
