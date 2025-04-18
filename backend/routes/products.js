const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { productSchema } = require("../validators/productValidator");
const validate = require("../middlewares/validate");
const { checkAdmin } = require("../middlewares/auth");
const requireAuth = require("../middlewares/requireAuth");

router.get("/", requireAuth, productController.getProducts);
router.post(
  "/",
  requireAuth,
  checkAdmin,
  validate(productSchema),
  productController.addProduct
);
router.put(
  "/:id",
  requireAuth,
  checkAdmin,
  validate(productSchema),
  productController.updateProduct
);
router.delete("/:id", requireAuth, checkAdmin, productController.deleteProduct);

module.exports = router;
