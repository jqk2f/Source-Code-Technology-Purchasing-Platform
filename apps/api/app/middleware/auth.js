"use strict";

module.exports = (options = {}) => {
  return async function auth(ctx, next) {
    const header = ctx.get("authorization");
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) {
      ctx.fail(401001, "请先登录", 401);
      return;
    }
    try {
      const payload = ctx.service.auth.verify(token);
      if (options.type && payload.type !== options.type) {
        ctx.fail(403001, "无权访问该资源", 403);
        return;
      }
      ctx.state.user = payload;
      await next();
    } catch (error) {
      ctx.fail(401001, "登录状态已失效", 401);
    }
  };
};
