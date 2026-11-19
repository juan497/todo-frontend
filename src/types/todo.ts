export interface Todo {
  id: number;
  task: string;
}

export interface CreateTodoRequest {
  task: string;
}

export interface UpdateTodoRequest {
  task: string;
}
