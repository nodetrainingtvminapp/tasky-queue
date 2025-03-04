
import React from 'react';
import TaskItem from './TaskItem';
import { Task, Priority } from '@/lib/taskManager';
import { Loader2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  onUpdateDueDate: (id: string, dueDate: Date | null) => void;
  onUpdateText: (id: string, text: string) => void;
  onReorder: (sourceId: string, destinationId: string) => void;
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading = false,
  onToggleCompletion,
  onDelete,
  onUpdatePriority,
  onUpdateDueDate,
  onUpdateText,
  onReorder,
  onEditTask
}) => {
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedTaskId(id);
  };

  const handleDragOver = (id: string) => {
    if (draggedTaskId && draggedTaskId !== id) {
      onReorder(draggedTaskId, id);
      setDraggedTaskId(id);
    }
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="font-medium text-lg mb-1">No tasks here</h3>
        <p className="text-muted-foreground">
          Add a new task using the form above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 transition-all">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDelete}
          onUpdatePriority={onUpdatePriority}
          onUpdateDueDate={onUpdateDueDate}
          onUpdateText={onUpdateText}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onEditTask={onEditTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
