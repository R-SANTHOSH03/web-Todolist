import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Todo from "./models/Todo.js";
import User from "./models/User.js";

dotenv.config();

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Cron Job — runs every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const in30Minutes = new Date(now.getTime() + 30 * 60000); 

  try {
    const todos = await Todo.find({
      reminderTime: {
        $gte: now,         
        $lte: in30Minutes, 
      },
      reminded: false,      
    });

    for (const todo of todos) {
      const user = await User.findById(todo.userId);

      if (user && user.email) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "🕒 Todo Reminder",
          text: `Hello ${user.username},\n\nThis is a reminder: "${todo.text}" is due at ${new Date(todo.reminderTime).toLocaleString()}\n\n- Your Todo App`,
        };

        transporter.sendMail(mailOptions, async (err, info) => {
          if (err) {
            console.error(`❌ Email to ${user.email} failed:`, err.message);
          } else {
            console.log(`✅ Email sent to ${user.email}: ${info.response}`);
            todo.reminded = true;
            await todo.save();
          }
        });
      }
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
