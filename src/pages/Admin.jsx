import { useEffect, useState } from "react";

const API_URL = "https://kota-app-iybq.onrender.com";

function Admin() {
  const [orders, setOrders] = useState([]);

  // FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  // LIVE UPDATES (every 3 seconds)
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      fetchOrders(); // refresh after update
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  // TOTAL SALES
  const totalSales = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard 🍔</h1>

      <p style={{ color: "green", fontWeight: "bold" }}>
        🔴 Live updates ON
      </p>

      <h2 style={{ marginTop: "10px" }}>
        Total Orders: {orders.length} | Sales: R{totalSales}
      </h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "10px",
            }}
          >
            <p><b>Name:</b> {order.name}</p>
            <p><b>Phone:</b> {order.phone}</p>
            <p><b>Note:</b> {order.note}</p>
            <p><b>Total:</b> R{order.total}</p>

            {/* STATUS */}
            <p style={{ marginTop: "10px" }}>
              <b>Status:</b>{" "}
              <span style={{ color: "orange", fontWeight: "bold" }}>
                {order.status}
              </span>
            </p>

            {/* BUTTONS */}
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => updateStatus(order._id, "Preparing")}
                style={{ marginRight: "10px" }}
              >
                Preparing
              </button>

              <button
                onClick={() => updateStatus(order._id, "Ready")}
                style={{ marginRight: "10px" }}
              >
                Ready
              </button>

              <button
                onClick={() => updateStatus(order._id, "Collected")}
              >
                Collected
              </button>
            </div>

            {/* ITEMS */}
            <h3 style={{ marginTop: "15px" }}>Items:</h3>
            {order.items.map((item, i) => (
              <p key={i}>
                {item.name} x{item.qty} - R{item.price * item.qty}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;