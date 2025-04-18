import React, { useState } from "react";
import axios from "axios";

const ProductList = ({ products, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "" });

  const token = localStorage.getItem("token");

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        refresh();
      } catch (err) {
        console.error(
          "Failed to delete product:",
          err.response?.data || err.message
        );
        setError("Error deleting product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    const parsedPrice = parseFloat(product.price);
    setEditData({
      name: product.name,
      price: isNaN(parsedPrice) ? "" : Number(parsedPrice.toFixed(2)),
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]:
        name === "price" ? (value === "" ? "" : parseFloat(value)) : value,
    });
  };

  const handleUpdate = async (id) => {
    setLoading(true);

    if (!editData.name || editData.price === "" || isNaN(editData.price)) {
      setError("Name and price must be valid.");
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/products/${id}`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingProduct(null);
      setEditData({ name: "", price: "" });
      refresh();
    } catch (err) {
      console.error(
        "Failed to update product:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message ||
          "Error updating product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Product List
      </h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          <strong>Error: </strong>
          {error}
        </div>
      )}
      {products.length === 0 ? (
        <p className="text-lg text-gray-600">No products found.</p>
      ) : (
        <ul className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-3 transition transform hover:scale-105"
            >
              {editingProduct === product.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={editData.price}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(product.id)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setEditData({ name: "", price: "" });
                      }}
                      className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-gray-600">
                      ₹{parseFloat(product.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className={`bg-red-600 text-white px-4 py-1 rounded ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-700"
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
