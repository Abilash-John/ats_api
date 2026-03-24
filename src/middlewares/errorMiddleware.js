const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV === "development") {
    console.error(`❌ Error Captured: ${err.message}`, err.stack);
  }

  if (err.code === "ER_DUP_ENTRY") {
    const message = "Duplicate field value entered";
    error = { success: false, status: 400, message };
  }

  res.status(error.status || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { errorHandler };
