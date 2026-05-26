"use strict";

module.exports = () => {
  return async function trace(ctx, next) {
    ctx.traceId = `${Date.now()}${Math.random().toString(16).slice(2, 8)}`;
    ctx.set("X-Trace-Id", ctx.traceId);
    await next();
  };
};
