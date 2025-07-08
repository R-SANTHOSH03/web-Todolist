// routes/todos.js
import express from "express";
import Todo from "../models/Todo.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Complete your task"
 *               reminderTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-07T18:30:00.000Z"
 *               isCompleted:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6867bf2ca59a85766fe41001"
 *                 userId:
 *                   type: string
 *                   example: "68676e21dd0e7e532e845a5a"
 *                 text:
 *                   type: string
 *                   example: "hi boss..."
 *                 isCompleted:
 *                   type: boolean
 *                   example: false
 *                 reminderTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-07T18:30:00.000Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-08T14:20:12.394Z"
 *                 __v:
 *                   type: integer
 *                   example: 0
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", auth, async (req, res) => {
  const { text, reminderTime, isCompleted } = req.body;
  try {
    const todo = new Todo({
      userId: req.userId,
      text,
      isCompleted: isCompleted || false,
      reminderTime: reminderTime ? new Date(reminderTime) : undefined,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: "Error saving todo" });
  }
});

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the logged-in user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6867bf2ca59a85766fe41001"
 *                   userId:
 *                     type: string
 *                     example: "68676e21dd0e7e532e845a5a"
 *                   text:
 *                     type: string
 *                     example: "hi boss..."
 *                   isCompleted:
 *                     type: boolean
 *                     example: false
 *                   reminderTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-07T18:30:00.000Z"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-08T14:20:12.394Z"
 *                   __v:
 *                     type: integer
 *                     example: 0
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the todo
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo deleted successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found or unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found or unauthorized." });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
