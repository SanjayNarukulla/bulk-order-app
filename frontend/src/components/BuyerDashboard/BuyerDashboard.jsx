import React, { useState } from "react";
import ProductCatalog from "./ProductCatalog";
import OrderHistory from "./OrderHistory";

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
        Buyer Dashboard
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Welcome, Buyer! Browse products and track your orders below.
      </p>

      {/* Tab Buttons */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-medium rounded-l-lg ${
            activeTab === "products"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Product Catalog
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 font-medium rounded-r-lg ${
            activeTab === "orders"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Order History
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === "products" && <ProductCatalog />}
        {activeTab === "orders" && <OrderHistory />}
      </div>
    </div>
  );
};

export default BuyerDashboard;
