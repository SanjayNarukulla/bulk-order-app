// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/authController");
const {
  signupValidator,
  signinValidator,
} = require("../validators/authValidators");
const validate  = require("../middlewares/validate"); // Make sure this is destructured correctly

router.post("/signup", validate(signupValidator), signup);
router.post("/signin", validate(signinValidator), signin);

module.exports = router;
