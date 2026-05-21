"use strict";

module.exports = () => {
  return async function cors(ctx, next) {
    ctx.set("Access-Control-Allow-Origin", ctx.get("origin") || "*");
    ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    ctx.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    ctx.set("Access-Control-Allow-Credentials", "true");
    if (ctx.method === "OPTIONS") {
      ctx.status = 204;
      return;
    }
    await next();
  };
};
