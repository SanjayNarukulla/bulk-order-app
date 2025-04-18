const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { orderSchema } = require("../validators/orderValidator");
const validate = require("../middlewares/validate");
const { checkAdmin } = require("../middlewares/auth");
const requireAuth = require("../middlewares/requireAuth");

router.post(
  "/",
  requireAuth,
  validate(orderSchema),
  orderController.placeOrder
);

// 👇 Add this new route for buyers to view their own orders
router.get("/my", requireAuth, orderController.getMyOrders);

router.get("/:id", requireAuth, orderController.getOrderById);
router.get("/", requireAuth, checkAdmin, orderController.getAllOrders);
router.put("/:id", requireAuth, checkAdmin, orderController.updateOrderStatus);

module.exports = router;
