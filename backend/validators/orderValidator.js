const { z } = require("zod");

exports.orderSchema = z.object({
  buyer_name: z.string().min(1),
  buyer_contact: z.string().min(1),
  delivery_address: z.string().min(1),
  items: z.array(
    z.object({
      product_id: z.number(),
      quantity: z.number().positive(),
    })
  ),
});
