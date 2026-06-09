import { useState } from "react";

function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);

  const searchOrder = async () => {
    if (!phone) return;

    try {
      const res = await fetch(
        `http://localhost:5000/orders/track/${phone}`
      );
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-orange-600">
        Track Your Order 🍔
      </h1>

      <div className="mt-4">
        <input
          className="border p-2 rounded w-full md:w-1/2"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={searchOrder}
          className="bg-orange-500 text-white px-4 py-2 ml-2 mt-2 rounded"
        >
          Track Order
        </button>
      </div>

      {/* RESULTS */}
      <div className="mt-6">
        {orders.length === 0 ? (
          <p className="text-gray-500">
            No orders found
          </p>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white p-4 mb-4 shadow rounded"
            >
              <p><b>Total:</b> R{order.total}</p>
              <p>
                <b>Status:</b>{" "}
                <span className="font-bold text-orange-600">
                  {order.status}
                </span>
              </p>

              <p className="text-sm text-gray-500">
                {new Date(order.date).toLocaleString()}
              </p>

              <h3 className="font-bold mt-2">Items:</h3>
              {order.items.map((item, i) => (
                <p key={i}>
                  {item.name} x{item.qty} - R{item.price * item.qty}
                </p>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TrackOrder;