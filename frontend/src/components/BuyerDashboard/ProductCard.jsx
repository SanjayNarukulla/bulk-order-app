import React from "react";
import { useState } from "react";
const ProductCard = ({ product, onAdd }) => {
  const [qty, setQty] = useState(1);

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full">
      <div className="p-4">
        <h4 className="font-semibold text-sm md:text-base text-gray-800 truncate mb-1">
          {product.name}
        </h4>
        <p className="text-gray-700 text-xs md:text-sm mb-2">
          ₹{Number(product.price).toFixed(2)} / unit
        </p>
      </div>
      <div className="p-4 flex items-center space-x-2">
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value, 10) || 1)}
          className="w-14 p-2 border rounded text-xs md:text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={() => onAdd(product, qty)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm px-3 py-2 rounded transition-colors duration-200 flex-grow"
        >
          Add
        </button>
      </div>
    </div>
  );
};


export default ProductCard