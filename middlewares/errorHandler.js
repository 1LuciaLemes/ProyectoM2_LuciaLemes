function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Error de servidor',
      code: err.code || 'ERORR_SERVER'
    }
  });
}

module.exports = errorHandler;