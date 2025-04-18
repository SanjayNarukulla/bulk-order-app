// backend/validators/authValidators.js
const { z } = require("zod");

const signupValidator = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password should have at least 6 characters")
    .max(20, "Password should not exceed 20 characters"),
});

const signinValidator = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password should have at least 6 characters")
    .max(20, "Password should not exceed 20 characters"),
});

module.exports = {
  signupValidator,
  signinValidator,
};
