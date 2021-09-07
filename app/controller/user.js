"use strict";
const Controller = require("egg").Controller;

class UserController extends Controller {
  // 注册
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: "账号密码不能为空",
        data: null,
      };
      return;
    }

    // 当前用户名是否被注册
    const userInfo = await ctx.service.user.getUserByName(username);

    // 如果用户存在
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: "账号名已被注册，请重新输入",
        data: null,
      };
      return;
    }

    // 注册用户
    const result = await ctx.service.user.register({
      username,
      password,
      signature: "这个人没有个性签名",
      avatar: "",
    });

    if (result) {
      ctx.body = {
        code: 200,
        msg: "注册成功",
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: "注册失败",
        data: null,
      };
    }
  }
  // 登录
  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    const userInfo = await ctx.service.user.getUserByName(username);
    // 用户不存在
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: "账号不存在",
        data: null,
      };
      return;
    }
    if (userInfo && userInfo.password !== password) {
      ctx.body = {
        code: 500,
        msg: "账号或密码错误",
        data: null,
      };
      return;
    }

    // 生成token值
    const token = this.app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      },
      this.app.config.jwt.secret
    );
    ctx.body = {
      code: 200,
      msg: "登录成功",
      data: {
        token,
      },
    };
  }
  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || "",
        avatar: userInfo.avatar || defaultAvatar,
      },
    };
  }
  // 修改用户信息
  async modifyUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) {
      return;
    }

    const { signature = "", avatar = "" } = ctx.request.body;
    try {
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      await ctx.service.user.modifyUserInfo({
        ...userInfo,
        signature,
        avatar,
      });
      ctx.body = {
        code: 200,
        msg: "修改成功",
        data: {
          id: userInfo.id,
          username: userInfo.username,
          signature,
          avatar,
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "修改失败",
        data: null,
      };
    }
  }
  // 修改密码
  async modifyPassword() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) {
      return;
    }
    try {
      const { old_pass = "", new_pass = "", new_pass2 = "" } = ctx.request.body;
      if (decode.username === "admin") {
        ctx.body = {
          code: 400,
          msg: "管理员不能修改密码",
          data: null,
        };
        return;
      }
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      if (old_pass !== userInfo.password) {
        ctx.body = {
          code: 400,
          msg: "原密码不正确",
          data: null,
        };
        return;
      }

      if (new_pass !== new_pass2) {
        ctx.body = {
          code: 400,
          msg: "新密码不一致",
          data: null,
        };
        return;
      }

      const result = await ctx.service.user.modifyUserPassword({
        ...userInfo,
        password: new_pass,
      });

      ctx.body = {
        code: 200,
        msg: "密码修改成功",
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 400,
        msg: "密码修改失败",
        data: null,
      };
    }
  }
  // 验证token
  async verify() {
    const { ctx, app } = this;
    const { token } = ctx.request.body;
    console.log(ctx.state.user);
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    console.log("decode", decode);
    ctx.body = {
      code: 200,
      msg: "token验证成功",
      data: null,
    };
  }
}

module.exports = UserController;
