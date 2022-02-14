"use static";

const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

const Controller = require("egg").Controller;

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    const file = ctx.request.files[0];

    let uploadDir = "";

    try {
      const f = fs.readFileSync(file.filepath);
      await mkdirp("app/public/upload/");
      uploadDir = path.join(
        "app/public/upload/",
        Date.now() + path.extname(file.filename)
      );
      fs.writeFileSync(uploadDir, f);
    } finally {
      ctx.cleanupRequestFiles();
    }

    ctx.body = {
      code: 200,
      msg: "上传成功",
      data: uploadDir.replace("/app", ""),
    };
  }
}

module.exports = UploadController;
