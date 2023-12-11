const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

const customErrorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  let message = "Server error";

  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found";
    statusCode = 404;
  }

  res.status(statusCode).json({
    message,
    stack: err.stack,
  });
};

export { customErrorHandler, notFound };
