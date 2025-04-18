import React, { useEffect, useState } from "react";
import OrderList from "./OrderList";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import axios from "axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productError, setProductError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data);
      setProductError(null);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProductError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]);

  const tabButtonStyle = (tab) =>
    `px-6 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
      activeTab === tab
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
    }`;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Admin Dashboard
      </h2>

      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab("orders")}
          className={tabButtonStyle("orders")}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={tabButtonStyle("products")}
        >
          Products
        </button>
      </div>

      {activeTab === "orders" ? (
        <OrderList />
      ) : (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-700">
            Manage Products
          </h3>

          <ProductForm refresh={fetchProducts} />

          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : productError ? (
            <div className="text-center text-red-600">{productError}</div>
          ) : (
            <ProductList products={products} refresh={fetchProducts} />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
