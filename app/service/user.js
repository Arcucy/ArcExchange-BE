'use strict';
const Service = require('egg').Service;

class userService extends Service {

  /**
   * 获取用户信息和密码的 Hash
   * @param {string} key 查询的键
   * @param {string} value 查询的值
   */
  async getUserInfoAndPwHash(key, value) {
    const userInfo = await this.app.mysql.get('user', { [key]: value });
    return JSON.parse(JSON.stringify(userInfo));
  }

  /**
   * 获取用户信息（不包含密码的 Hash）
   * @param {string} key 查询的键
   * @param {string} value 查询的值
   */
  async getUserInfo(key, value) {
    const userInfo = await this.app.mysql.select('user', {
      where: { [key]: value },
      columns: [
        'id',
        'username',
        'avatar',
        'email',
        'address',
        'group',
        'is_ban',
      ],
    });
    return userInfo && userInfo[0] || null;
  }

  /**
   * 通过用户名和密码登录。
   * @param {string} username 用户名
   * @param {string} password 密码
   */
  async userLoginByUsername(username, password) {
    const userInfo = await this.getUserInfoAndPwHash('username', username);
    console.log('userInfo:', userInfo);
    if (!userInfo) return { code: 1 };
    if (userInfo.password_hash !== password) return { code: 2 };
    if (userInfo.is_ban) return { code: 3 };

    const jwtStr = this.service.auth.jwtSign({
      id: userInfo.id,
      username: userInfo.username,
      group: userInfo.group,
      loginMethod: 'username',
    });

    delete userInfo.password_hash;
    return {
      code: 0,
      accountToken: jwtStr,
      userInfo,
    };
  }
}

module.exports = userService;
