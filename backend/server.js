const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MONGO DB CONNECTION
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Kota backend is running 🚀");
});

/* =========================
   ORDER MODEL
========================= */
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

/* =========================
   SAVE ORDER
========================= */
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

/* =========================
   GET ALL ORDERS
========================= */
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =========================
   UPDATE ORDER STATUS
========================= */
app.put("/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =========================
   TRACK ORDER BY PHONE
========================= */
app.get("/orders/track/:phone", async (req, res) => {
  try {
    const orders = await Order.find({ phone: req.params.phone });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =========================
   PORT (IMPORTANT FOR RENDER)
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});