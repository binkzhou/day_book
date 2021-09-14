"use strict";

const fs = require("fs");
const moment = require("moment");
const mkdirp = require("mkdirp");
const path = require("path");

const Controller = require("egg").Controller;

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    let file = ctx.request.files[0];

    let uploadDir = "";

    try {
      let f = fs.readFileSync(file.filepath);
      // 1.获取当前日期
      let day = moment(new Date()).format("YYYYMMDD");
      // 2.创建图片保存的路径
      let dir = path.join(this.config.uploadDir, day);
      let date = Date.now();

      // 创建目录
      await mkdirp(dir);
      // 返回图片路径
      uploadDir = path.join(dir, date + path.extname(file.filename));
      // 写入文件
      fs.writeFileSync(uploadDir, f);
    } catch (e) {
      ctx.body = {
        code: 400,
        msg: "上传失败",
        data: null,
      };
    } finally {
      // 清除临时文件
      ctx.cleanupRequestFiles();
    }

    ctx.body = {
      code: 200,
      msg: "上传成功",
      data: uploadDir.replace(/app/g, ""),
    };
  }
}
module.exports = UploadController;
