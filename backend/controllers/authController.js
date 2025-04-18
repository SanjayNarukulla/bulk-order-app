const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // your postgres pool
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const buyerExists = await pool.query(
      "SELECT * FROM buyers WHERE email = $1",
      [email]
    );
    if (buyerExists.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBuyer = await pool.query(
      "INSERT INTO buyers (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res
      .status(201)
      .json({ message: "Signup successful", user: newBuyer.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};



exports.signin = async (req, res) => {
  const { email, password } = req.body;


  try {
    // 1. Admin login check
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email, isAdmin: true }, SECRET_KEY, {
        expiresIn: "1d",
      });

      return res.json({ token, role: "admin" });
    }

    // 2. Buyer login check using Postgres
    const result = await pool.query("SELECT * FROM buyers WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: false },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({ token, role: "buyer" });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
