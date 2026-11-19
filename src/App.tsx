import { useEffect, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './services/todoApi';
import type { Todo } from './types/todo';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred';
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setTodos(await getTodos());
      } catch (error) {
        setError(getErrorMessage(error));
      }
    };

    void fetchTodos();
  }, []);

  const handleAddTodo = async (task: string): Promise<boolean> => {
    try {
      const createdTodo = await createTodo({ task });
      setTodos((previousTodos) => [...previousTodos, createdTodo]);
      setError(null);
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    }
  };

  const handleUpdateTodo = async (
    id: number,
    task: string,
  ): Promise<boolean> => {
    try {
      const updatedTodo = await updateTodo(id, { task });
      setTodos((previousTodos) =>
        previousTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );
      setError(null);
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    }
  };

  const handleDeleteTodo = async (id: number): Promise<boolean> => {
    try {
      await deleteTodo(id);
      setTodos((previousTodos) =>
        previousTodos.filter((todo) => todo.id !== id),
      );
      setError(null);
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '2rem auto',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>Todo List</h1>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <TodoForm onAdd={handleAddTodo} />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}
