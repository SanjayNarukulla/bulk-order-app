import React, { useState } from "react";
import axios from "axios";

const ProductForm = ({ refresh }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(""); // Add error state

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Reset error state before starting the request
    setError("");
    setLoading(true);

    if (!name || !price || isNaN(price) || parseFloat(price) <= 0) {
      setError("Please provide valid product name and price.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/products`,
        { name, price: parseFloat(price) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setName("");
      setPrice("");
      if (typeof refresh === "function") {
        refresh(); // trigger fetchProducts from AdminDashboard
      }
    } catch (err) {
      console.error(
        "Failed to add product:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.error ||
          "Something went wrong while adding the product."
      );
    } finally {
      setLoading(false); // Stop loading after the request
    }
  };

  return (
    <form
      onSubmit={handleAdd}
      className="mb-6 p-4 bg-white shadow-md rounded-lg"
    >
      <h3 className="text-xl font-semibold mb-4">Add Product</h3>
      {error && <p className="text-red-600 mb-2">{error}</p>}{" "}
      {/* Display error message */}
      <div className="flex flex-col sm:flex-row sm:gap-4 mb-4">
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded w-full mt-4 sm:mt-0"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded w-full sm:w-auto"
        disabled={loading} // Disable button while loading
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
