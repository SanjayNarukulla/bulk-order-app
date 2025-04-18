import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard"
import axios from "axios";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // ← your cart of items
  const [buyerName, setBuyerName] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // 1) Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        setLoadingProducts(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load products.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // 2) Add a product + quantity to cart (merge if already exists)
  const addToCart = (product, qty) => {
    if (qty < 1) return;
    setCart((prev) => {
      const exists = prev.find((i) => i.product_id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          quantity: qty,
        },
      ];
    });
  };

  // 3) Remove item from cart
  const removeFromCart = (product_id) =>
    setCart((prev) => prev.filter((i) => i.product_id !== product_id));

  // 4) Place the bulk order
  const handleOrder = async () => {
    if (!buyerName || !buyerContact || !deliveryAddress) {
      alert("Please fill in your name, contact & address.");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        buyer_name: buyerName,
        buyer_contact: buyerContact,
        delivery_address: deliveryAddress,
        items: cart.map(({ product_id, quantity }) => ({
          product_id,
          quantity,
        })),
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/orders`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      // clear everything
      setCart([]);
      setBuyerName("");
      setBuyerContact("");
      setDeliveryAddress("");
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 md:p-6 lg:p-8 rounded-lg shadow-md max-w-6xl mx-auto space-y-6">
      <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-4">
        Browse Vegetables & Fruits
      </h3>

      {loadingProducts ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-t-4 border-green-500 rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      )}

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Your Cart</h4>

        {cart.length === 0 ? (
          <p className="text-gray-600">No items added yet.</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item) => (
              <li
                key={item.product_id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-inner"
              >
                <div className="flex-grow">
                  <p className="font-medium text-sm md:text-base text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-gray-600 text-xs md:text-sm">
                    ₹{item.price.toFixed(2)} × {item.quantity} = ₹
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm px-2 py-1 rounded"
                >
                  Remove
                </button>
              </li>
            ))}
            <li className="text-right font-semibold text-sm md:text-base text-gray-800">
              Total: ₹
              {cart
                .reduce((sum, i) => sum + i.price * i.quantity, 0)
                .toFixed(2)}
            </li>
          </ul>
        )}

        {/* Buyer details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Your Name"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="p-2 md:p-3 border rounded text-sm md:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <input
            type="text"
            placeholder="Contact Number"
            value={buyerContact}
            onChange={(e) => setBuyerContact(e.target.value)}
            className="p-2 md:p-3 border rounded text-sm md:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <textarea
            placeholder="Delivery Address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="p-2 md:p-3 border rounded text-sm md:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            rows="2"
          />
        </div>

        <button
          onClick={handleOrder}
          disabled={placingOrder}
          className={`w-full text-center py-2 md:py-3 rounded text-white text-sm md:text-base ${
            placingOrder
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 transition-colors duration-200"
          }`}
        >
          {placingOrder ? "Placing Order..." : "Confirm Bulk Order"}
        </button>
      </div>
    </div>
  );
};

export default ProductCatalog;

// ————
