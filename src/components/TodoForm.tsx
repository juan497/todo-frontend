import { useState, type SubmitEvent } from 'react';

interface TodoFormProps {
  onAdd: (task: string) => Promise<boolean>;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [task, setTask] = useState('');

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTask = task.trim();
    if (!trimmedTask) return;

    if (await onAdd(trimmedTask)) setTask('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}
    >
      <input
        type="text"
        value={task}
        onChange={(event) => setTask(event.target.value)}
        placeholder="What needs to be done?"
        style={{ flex: 1, padding: '8px' }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>
        Add
      </button>
    </form>
  );
}
