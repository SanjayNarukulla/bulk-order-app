const pool = require("../db");

// POST new order
exports.placeOrder = async (req, res) => {
  const { buyer_name, buyer_contact, delivery_address, items } = req.body;

  // Ensure user is authenticated and we have buyer_id
  const buyer_id = req.user?.id;
  if (!buyer_id) {
    return res.status(401).json({ error: "Unauthorized: buyer_id not found" });
  }

  // Validate required fields
  if (
    !buyer_name ||
    !buyer_contact ||
    !delivery_address ||
    !items ||
    items.length === 0
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const status = "Pending";

  try {
    await pool.query(
      `INSERT INTO orders (buyer_id, buyer_name, buyer_contact, delivery_address, items, status) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        buyer_id,
        buyer_name,
        buyer_contact,
        delivery_address,
        JSON.stringify(items),
        status,
      ]
    );
    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET order by id
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const buyerResult = await pool.query(
      "SELECT id FROM buyers WHERE email = $1",
      [userEmail]
    );

    if (buyerResult.rows.length === 0) {
      return res.status(404).json({ message: "Buyer not found." });
    }

    const buyerId = buyerResult.rows[0].id;

    const ordersResult = await pool.query(
      "SELECT * FROM orders WHERE buyer_id = $1",
      [buyerId]
    );

    if (ordersResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this buyer." });
    }

    const ordersWithDetailedItems = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const items = order.items;

        const detailedItems = await Promise.all(
          items.map(async (item) => {
            const productResult = await pool.query(
              "SELECT id, name, price FROM products WHERE id = $1",
              [item.product_id]
            );

            const product = productResult.rows[0] || {};
            return {
              product_id: item.product_id,
              quantity: item.quantity,
              name: product.name || "Unknown",
              price: Number(product.price) || 0,
            };
          })
        );

        return { ...order, items: detailedItems };
      })
    );

    res.status(200).json(ordersWithDetailedItems);
  } catch (err) {
    console.error("getMyOrders: Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch your orders." });
  }
};

// GET all orders
exports.getAllOrders = async (req, res) => {
  try {
  
    const result = await pool.query("SELECT * FROM orders Order By id;");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
    res.json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
