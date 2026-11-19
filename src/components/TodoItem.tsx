import { useState } from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, task: string) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

export default function TodoItem({
  todo,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(todo.task);

  const handleSave = async () => {
    const trimmedTask = editingText.trim();
    if (!trimmedTask) return;

    if (await onUpdate(todo.id, trimmedTask)) setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingText(todo.task);
    setIsEditing(false);
  };

  return (
    <li
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px',
        borderBottom: '1px solid #ddd',
      }}
    >
      {isEditing ? (
        <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
          <input
            type="text"
            value={editingText}
            onChange={(event) => setEditingText(event.target.value)}
            style={{ flex: 1, padding: '4px' }}
          />
          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span>{todo.task}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setEditingText(todo.task);
                setIsEditing(true);
              }}
            >
              Edit
            </button>
            <button type="button" onClick={() => onDelete(todo.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
