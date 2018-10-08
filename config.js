const ymlConfig = require('node-yaml-config')
const path = require('path')

const envConfigs = ymlConfig.load(path.resolve(__dirname, './env.yml'))

process.env = Object.assign({}, process.env, envConfigs)

const configs = {
  env: process.env.NODE_ENV || 'development',

  port: process.env.PORT || 8080,

  apiHost: process.env.API_URL || 'http://localhost:9003',

  sessionSecret: process.env.SESSION_SECRET || 'asdf8a7sd9g7@#GQb4awv',

  minTotalFreeShipping: 200,

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  }
}

module.exports = configs