// the promise approach
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// the try-catch approach
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const serviceErrorHandler = (fn, service, operation) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      // 如果已有自定义错误状态，保持它
      if (!error.status) {
        error.status = 500;
      }
      // 添加服务名前缀以便追踪
      error.message = `Service Error: ${service} - ${operation}`;
      throw error;
    }
  };
};
