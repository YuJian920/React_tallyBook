"use strict";

const Service = require("egg").Service;

class UserService extends Service {
  async getUserByName(username) {
    const { app } = this;
    try {
      return await app.mysql.get("user", { username });
    } catch (error) {
      console.log("UserService>getUserByName 错误", error);
      return null;
    }
  }

  async register(params) {
    const { app } = this;
    try {
      return await app.mysql.insert("user", params);
    } catch (error) {
      console.log("UserService>register 错误", error);
      return null;
    }
  }
}

module.exports = UserService;
