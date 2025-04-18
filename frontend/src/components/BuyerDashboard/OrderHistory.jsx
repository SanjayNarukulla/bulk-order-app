import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to view your orders.");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/orders/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        alert("You do not have permission to view these orders.");
      } else {
        console.error("Failed to fetch orders:", error);
        alert("Error fetching orders.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-indigo-700 text-center mb-6 tracking-wider">
        <i className="fas fa-history mr-2"></i> Your Order History
      </h3>

      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-md shadow-inner text-center text-gray-600">
          <i className="far fa-file-alt text-xl mb-2"></i>
          <p className="text-sm">No past orders found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300 ease-in-out p-5"
            >
              <div className="mb-4 text-gray-700">
                <p className="text-sm">
                  <span className="font-medium text-indigo-600">
                    <i className="fas fa-user mr-1"></i> Buyer:
                  </span>{" "}
                  {order.buyer_name || (
                    <span className="text-gray-500 italic">N/A</span>
                  )}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-indigo-600">
                    <i className="fas fa-phone-alt mr-1"></i> Contact:
                  </span>{" "}
                  {order.buyer_contact || (
                    <span className="text-gray-500 italic">N/A</span>
                  )}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-indigo-600">
                    <i className="fas fa-map-marker-alt mr-1"></i> Address:
                  </span>{" "}
                  {order.delivery_address || (
                    <span className="text-gray-500 italic">N/A</span>
                  )}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-indigo-600">
                    <i className="fas fa-tag mr-1"></i> Status:
                  </span>
                  <span
                    className={`ml-2 inline-block px-3 py-1 rounded-full text-xs font-semibold text-white
                      ${
                        order.status === "pending"
                          ? "bg-yellow-400"
                          : order.status === "processing"
                          ? "bg-blue-400"
                          : "bg-green-500"
                      }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>

              <div>
                <h5 className="text-md font-semibold text-indigo-700 mb-2">
                  <i className="fas fa-list-ul mr-1"></i> Order Details:
                </h5>
                {order.items && order.items.length > 0 ? (
                  <ul className="list-none pl-0 text-gray-600 space-y-2 text-sm">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2 text-indigo-400">
                          <i className="fas fa-check-circle"></i>
                        </span>
                        {item.name || (
                          <span className="text-gray-500 italic">Unnamed</span>
                        )}{" "}
                        – ₹{parseFloat(item.price).toFixed(2)} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No items in this order.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
