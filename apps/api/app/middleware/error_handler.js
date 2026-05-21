"use strict";

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (error) {
      ctx.app.emit("error", error, ctx);
      const status = error.status || 500;
      ctx.status = status;
      ctx.body = {
        code: error.code || (status === 401 ? 401001 : status === 403 ? 403001 : 500001),
        message: error.message || "服务端异常",
        data: null,
        traceId: ctx.traceId
      };
    }
  };
};
