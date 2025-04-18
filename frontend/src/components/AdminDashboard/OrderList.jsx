import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (error) {
      setError("Failed to fetch orders. Please try again.");
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      setError("Error updating order status. Please try again.");
      console.error("Error updating order status:", error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h3 className="text-3xl font-bold text-center mb-6 text-gray-800">
        🛒 Order Management
      </h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : error ? (
        <div className="text-center bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-white rounded-xl shadow-md p-6 transition hover:shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <p className="text-lg">
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Buyer:</strong> {order.buyer_name}
                  </p>
                  <p
                    className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium tracking-wide capitalize shadow-sm 
                    border border-gray-200
                    ${getStatusColor(order.status)}"
                  >
                    {order.status}
                  </p>
                </div>

                <div className="w-full sm:w-60">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Change Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
