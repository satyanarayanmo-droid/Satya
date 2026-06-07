import React, { useState, useEffect } from 'react';
import './TodoApp.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todo-app">
      <div className="todo-container">
        <header className="todo-header">
          <h1>My Tasks</h1>
          <p className="todo-subtitle">Organize your day</p>
        </header>
        <TodoForm onAddTodo={addTodo} />
        <div className="todo-filters">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            All ({todos.length})
          </button>
          <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>
            Active ({activeCount})
          </button>
          <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
            Completed ({completedCount})
          </button>
        </div>
        {filteredTodos.length > 0 ? (
          <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />
        ) : (
          <div className="todo-empty"><p>No tasks</p></div>
        )}
        {completedCount > 0 && (
          <div className="todo-actions">
            <button className="clear-btn" onClick={clearCompleted}>Clear Completed ({completedCount})</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoApp;