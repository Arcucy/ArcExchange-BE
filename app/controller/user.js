'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async userLoginByUsername() {
    const { ctx } = this;
    const { username = null, password = null } = ctx.request.body;
    if (!username || !password) {
      ctx.body = ctx.msg.paramsError;
      return;
    }

    const res = await this.service.user.userLoginByUsername(username, password);
    switch (res.code) {
      case 0:
        ctx.body = {
          code: 0,
          data: {
            accountToken: res.accountToken,
            userInfo: res.userInfo,
          },
        };
        break;
      case 1:
        ctx.body = {
          code: 2,
          message: 'username error',
        };
        break;
      case 2:
        ctx.body = {
          code: 3,
          message: 'wrong password',
        };
        break;
      case 3:
        ctx.body = {
          code: 4,
          message: 'The account has been banned',
        };
        break;
      default:
        ctx.body = {
          code: 1,
          message: 'failure',
        };
        break;
    }
  }
}

module.exports = UserController;
