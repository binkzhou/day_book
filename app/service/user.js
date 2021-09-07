"use strict";

const Service = require("egg").Service;

class UserService extends Service {
  // 通过用户名获取用户信息
  async getUserByName(username) {
    try {
      const result = await this.app.mysql.get("users", { username });
      return result;
    } catch (err) {
      console.log(error);
      return null;
    }
  }
  // 注册
  async register(params) {
    try {
      const result = await this.app.mysql.insert("users", { ...params });
      return result;
    } catch {
      console.log(error);
      return null;
    }
  }
  // 修改用户信息
  async modifyUserInfo(params) {
    try {
      const result = await this.app.mysql.update("users", { ...params });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 修改密码
  async modifyUserPassword(params) {
    try {
      const result = await this.app.mysql.update("users", { ...params });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
