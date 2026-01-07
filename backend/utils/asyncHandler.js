// the promise approach
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// the try-catch approach
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next); // 等待 fn 执行，如果 fn 是异步的
  } catch (err) {
    next(err); // 捕获错误并传递
  }
};

export default asyncHandler;
