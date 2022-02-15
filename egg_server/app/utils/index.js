const tokenVerify = (ctx, app) => {
  return app.jwt.verify(
    ctx.request.header.authorization,
    app.config.jwt.secret
  );
};

module.exports = { tokenVerify };
