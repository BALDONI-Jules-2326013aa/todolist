import { useState } from "react";
import HeaderTodoList from "./HeaderTodoList";
import TodoList from "./TodoList";
import FooterTodoList from "./FooterTodoList";
import data from "./data.json";
import "./App.css";

function App() {
    const [todos, setTodos] = useState(data.taches);

    const handleAddTodo = () => {
        const newTodo = {
            id: Date.now(),
            title: "Nouvelle tâche",
            description: "",
            date_creation: new Date().toISOString().split("T")[0],
            date_echeance: new Date().toISOString().split("T")[0],
            done: false,
            urgent: false,
            contacts: [],
        };
        setTodos([...todos, newTodo]);
    };

    const handleUpdateTodo = (id, updatedTodo) => {
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, ...updatedTodo } : todo)));
  };

  return (
      <div className="App">
          <HeaderTodoList />
          <TodoList todos={todos} onUpdate={handleUpdateTodo} />
            <FooterTodoList onAddTodo={handleAddTodo} />
        </div>
    );
}

export default App;
