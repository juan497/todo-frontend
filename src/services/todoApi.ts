import type {
  CreateTodoRequest,
  Todo,
  UpdateTodoRequest,
} from '../types/todo';

const API_BASE_URL = 'http://localhost:5105/todos';

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
}

export async function createTodo(request: CreateTodoRequest): Promise<Todo> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
}

export async function updateTodo(
  id: number,
  request: UpdateTodoRequest,
): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete todo');
}
