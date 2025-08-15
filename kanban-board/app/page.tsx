"use client";

import { useState } from 'react';

type Task = {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Task 1', status: 'todo' },
    { id: 2, title: 'Task 2', status: 'in-progress' },
    { id: 3, title: 'Task 3', status: 'done' },
  ]);

  const onDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('id', id.toString());
  };

  const onDrop = (e: React.DragEvent, status: 'todo' | 'in-progress' | 'done') => {
    const id = parseInt(e.dataTransfer.getData('id'));
    setTasks(tasks.map(task => task.id === id ? { ...task, status } : task));
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen bg-gray-100 p-10">
      <div className="w-1/3 p-4">
        <h2 className="text-2xl font-bold mb-4">To Do</h2>
        <div
          className="bg-white rounded-lg p-4 min-h-[200px]"
          onDrop={(e) => onDrop(e, 'todo')}
          onDragOver={onDragOver}
        >
          {tasks.filter(task => task.status === 'todo').map(task => (
            <div
              key={task.id}
              className="p-4 mb-4 bg-gray-200 rounded-lg cursor-pointer"
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/3 p-4">
        <h2 className="text-2xl font-bold mb-4">In Progress</h2>
        <div
          className="bg-white rounded-lg p-4 min-h-[200px]"
          onDrop={(e) => onDrop(e, 'in-progress')}
          onDragOver={onDragOver}
        >
          {tasks.filter(task => task.status === 'in-progress').map(task => (
            <div
              key={task.id}
              className="p-4 mb-4 bg-gray-200 rounded-lg cursor-pointer"
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/3 p-4">
        <h2 className="text-2xl font-bold mb-4">Done</h2>
        <div
          className="bg-white rounded-lg p-4 min-h-[200px]"
          onDrop={(e) => onDrop(e, 'done')}
          onDragOver={onDragOver}
        >
          {tasks.filter(task => task.status === 'done').map(task => (
            <div
              key={task.id}
              className="p-4 mb-4 bg-gray-200 rounded-lg cursor-pointer"
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
