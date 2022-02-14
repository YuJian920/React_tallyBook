"use strtic";

module.exports = (secret) => {
  return async (ctx, next) => {
    const token = ctx.request.header.authorization;
    let decode = "";
    if (token != null && token) {
      try {
        decode = ctx.app.jwt.verify(token, secret);
        await next();
      } catch (error) {
        console.log("JwtErr 错误", error);
        ctx.status = 200;
        ctx.body = {
          msg: "token已过期，请重新登录",
          code: 401,
        };

        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: "token不存在",
      };
      return;
    }
  };
};
