import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchTodos = async () => {
      const res = await axios.get("http://localhost:5000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    };
    fetchTodos();
  }, [token, navigate]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await axios.post(
      "http://localhost:5000/api/todos",
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTodos([res.data, ...todos]);
    setText("");
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

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
          <button type="submit">Add</button>
        </form>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id}>
              <span>{todo.text}</span>
              <small>{new Date(todo.createdAt).toLocaleString()}</small>
              <button onClick={() => deleteTodo(todo._id)}>❌</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default Todo;
