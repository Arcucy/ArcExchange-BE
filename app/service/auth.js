'use strict';
const Service = require('egg').Service;
const Jwt = require('jwt-simple');
const Moment = require('moment');

class AuthService extends Service {
  // jwt token
  jwtSign(user) {
    const expires = Moment().add(7, 'days').valueOf();
    const jwttoken = Jwt.encode({
      exp: expires,
      ...user,
    }, this.app.config.jwtTokenSecret);

    return jwttoken;
  }
}

module.exports = AuthService;
