const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Kota backend is running 🚀");
});

// Order schema
const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  note: String,
  items: Array,
  total: Number,

  status: {
    type: String,
    default: "Pending",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

// Save order
app.post("/orders", async (req, res) => {
  try {
    const order = new Order(req.body);

    await order.save();

    res.json({
      message: "Order saved successfully",
      order,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update order status
app.put("/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





app.get("/orders/track/:phone", async (req, res) => {
  try {
    const orders = await Order.find({ phone: req.params.phone });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});