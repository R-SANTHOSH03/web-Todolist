

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const authMiddleware = require("./middleware/auth");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Todo = mongoose.model("Todo", todoSchema);


app.use("/api/auth", authRoutes);

app.post("/api/todos", authMiddleware, async (req, res) => {
  const { text } = req.body;
  try {
    const newTodo = await Todo.create({
      text,
      userId: req.userId,
      isCompleted: false,
    });
    res.json(newTodo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get Todos 
app.get("/api/todos", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete Todo
app.delete("/api/todos/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!todo) return res.status(404).json({ error: "Todo not found or unauthorized." });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
