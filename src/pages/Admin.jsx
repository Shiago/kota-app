import { useEffect, useState } from "react";

function Admin() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ LIVE UPDATES (AUTO REFRESH EVERY 3 SECONDS)
  useEffect(() => {
    fetchOrders(); // initial load

    const interval = setInterval(() => {
      fetchOrders(); // refresh data
    }, 3000);

    return () => clearInterval(interval); // cleanup
  }, []);

  // ✅ UPDATE ORDER STATUS
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      fetchOrders(); // refresh after update
    } catch (error) {
      console.log(error);
    }
  };

  const totalSales = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-orange-600">
        Admin Dashboard 🍔
      </h1>

      <p className="text-green-600 font-bold mt-1">
        🔴 Live updates ON
      </p>

      <h2 className="text-xl font-bold my-4">
        Total Orders: {orders.length} | Sales: R{totalSales}
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white p-4 mb-4 rounded shadow"
        >
          <p><b>Name:</b> {order.name}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>Note:</b> {order.note}</p>
          <p><b>Total:</b> R{order.total}</p>

          {/* STATUS */}
          <p className="mt-2">
            <b>Status:</b>{" "}
            <span className="font-bold text-orange-600">
              {order.status}
            </span>
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-2 flex gap-2 flex-wrap">
            <button
              onClick={() => updateStatus(order._id, "Preparing")}
              className="bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Preparing
            </button>

            <button
              onClick={() => updateStatus(order._id, "Ready")}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Ready
            </button>

            <button
              onClick={() => updateStatus(order._id, "Collected")}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Collected
            </button>
          </div>

          {/* ITEMS */}
          <h3 className="font-bold mt-3">Items:</h3>
          {order.items.map((item, i) => (
            <p key={i}>
              {item.name} x{item.qty} - R{item.price * item.qty}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Admin;