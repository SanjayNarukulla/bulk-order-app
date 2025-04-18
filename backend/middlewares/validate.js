// middlewares/validate.js
module.exports = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Zod parsing
    next();
  } catch (err) {
    return res.status(400).json({
      errors: err.errors.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }
};
