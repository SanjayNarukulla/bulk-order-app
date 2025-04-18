const pool = require("../db");

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST new product
exports.addProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    await pool.query("INSERT INTO products (name, price) VALUES ($1, $2)", [
      name,
      price,
    ]);
    res.status(201).json({ message: "Product added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    await pool.query("UPDATE products SET name=$1, price=$2 WHERE id=$3", [
      name,
      price,
      id,
    ]);
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id=$1", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
