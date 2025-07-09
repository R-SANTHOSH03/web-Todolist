import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Redirect to login if token is missing
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchTodos = async () => {
      try {
        const res = await axios.get("https://todolist-website-05ku.onrender.com", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(res.data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };

    fetchTodos();
  }, [token, navigate]);

  // Add new todo with optional reminderTime
  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/todos",
        { text, reminderTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([res.data, ...todos]);
      setText("");
      setReminderTime("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Logout and clear localStorage
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="todo-wrapper">
      <aside className="sidebar">
        <h3>Hello, {username}</h3>
        <button onClick={logout}>Logout</button>
      </aside>

      <main className="todo-main">
        <h2>Your Todos</h2>
        <form onSubmit={addTodo}>
          <input
            type="text"
            value={text}
            placeholder="Add a task..."
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id}>
              <span>{todo.text}</span>
              <small>
                {todo.reminderTime
                  ? `⏰ ${new Date(todo.reminderTime).toLocaleString()}`
                  : `🕒 ${new Date(todo.createdAt).toLocaleString()}`}
              </small>
              <button onClick={() => deleteTodo(todo._id)}>❌</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default Todo;
