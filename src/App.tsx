import { useState, useEffect, type SubmitEvent } from 'react';
// Matches the anonymous objects returned by your API: new { todo.Id, todo.Task }
// Note: ASP.NET Core automatically serializes C# PascalCase to JSON camelCase
interface Todo {
  id: number;
  task: string;
}

const API_BASE_URL = 'http://localhost:5105/todos';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // GET: Fetch all todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // POST: Create a new todo
const handleAddTodo = async (e: SubmitEvent<HTMLFormElement>) => {    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Matches CreateTodoRequest { Task }
        body: JSON.stringify({ task: newTask }),
      });

      if (!response.ok) throw new Error('Failed to create todo');

      const createdTodo: Todo = await response.json();
      setTodos((prev) => [...prev, createdTodo]);
      setNewTask('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // PUT: Update an existing todo
  const handleUpdateTodo = async (id: number) => {
    if (!editingText.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Matches UpdateTodoRequest { Task }
        body: JSON.stringify({ task: editingText }),
      });

      if (!response.ok) throw new Error('Failed to update todo');

      const updatedTodo: Todo = await response.json();
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      setEditingId(null);
      setEditingText('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // DELETE: Remove a todo
  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      // Your API returns 204 No Content on success
      if (!response.ok) throw new Error('Failed to delete todo');

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.task);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Todo List</h1>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What needs to be done?"
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add</button>
      </form>

      {/* Todo List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px',
              borderBottom: '1px solid #ddd',
            }}
          >
            {editingId === todo.id ? (
              <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={{ flex: 1, padding: '4px' }}
                />
                <button onClick={() => handleUpdateTodo(todo.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <span>{todo.task}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => startEditing(todo)}>Edit</button>
                  <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

