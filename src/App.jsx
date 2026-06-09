import { useState } from "react";
import menu from "./data/menu";

const WHATSAPP_NUMBER = "27725356833";

function App() {
  const [cart, setCart] = useState([]);

  // Customer details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  // Add item with quantity handling
  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // Remove item completely
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // ✅ SAVE ORDER TO DATABASE (ADDED)
 const saveOrderToDB = async () => {
  const order = {
    name,
    phone,
    note,
    items: cart,
    total,
  };

  try {
    await fetch("https://kota-app-iybq.onrender.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
  } catch (error) {
    console.log("Error saving order:", error);
  }
};

    try {
      await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
    } catch (error) {
      console.log("Error saving order:", error);
    }
  };

  // WhatsApp order
  const sendToWhatsApp = async () => {
    if (cart.length === 0) return;

    // 1. SAVE TO DATABASE FIRST
    await saveOrderToDB();

    // 2. SEND WHATSAPP MESSAGE
    let message = "🍔 NEW KOTA ORDER\n\n";

message += `👤 Name: ${name || "Not provided"}\n`;
message += `📞 Phone: ${phone || "Not provided"}\n`;
message += `📝 Note: ${note || "None"}\n\n`;

cart.forEach((item, index) => {
  message += `${index + 1}. ${item.name} x${item.qty} - R${
    item.price * item.qty
  }\n`;
});

message += `\n💰 Total: R${total}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  message
)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-4">
        Kota King 🍔
      </h1>

      {/* CUSTOMER FORM */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-bold mb-3">
          Customer Details
        </h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />

        <input
          type="text"
          placeholder="Order Notes (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* MENU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menu.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={item.image}
              className="h-40 w-full object-cover"
              alt={item.name}
            />

            <div className="p-3">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="text-gray-600">{item.category}</p>

              <div className="flex justify-between items-center mt-3">
                <p className="text-orange-600 font-bold">
                  R{item.price}
                </p>

                <button
                  onClick={() => addToCart(item)}
                  className="bg-orange-500 text-white px-3 py-1 rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CART */}
      <div className="mt-8 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">
          Cart ({cart.length})
        </h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">No items yet</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between mb-2"
            >
              <p>
                {item.name} x{item.qty} - R
                {item.price * item.qty}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))
        )}

        <hr className="my-2" />

        <h3 className="font-bold text-lg">
          Total: R{total}
        </h3>

        <button
          onClick={sendToWhatsApp}
          className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg font-bold"
        >
          Send Order on WhatsApp 📲
        </button>
      </div>
    </div>
  );
}

export default App;