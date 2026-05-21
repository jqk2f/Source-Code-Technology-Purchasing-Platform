"use strict";

module.exports = {
  success(data = null, message = "success") {
    this.body = {
      code: 0,
      message,
      data,
      traceId: this.traceId
    };
  },

  fail(code, message, status = 400) {
    this.status = status;
    this.body = {
      code,
      message,
      data: null,
      traceId: this.traceId
    };
  }
};
