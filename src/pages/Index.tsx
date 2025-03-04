
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import TaskFilters from '@/components/TaskFilters';
import { 
  Task, 
  TaskFilter, 
  SortOption, 
  Priority,
  createTask,
  toggleTaskCompletion,
  deleteTask,
  updateTaskPriority,
  updateTaskDueDate,
  updateTaskText,
  reorderTasks,
  filterTasks,
  sortTasks,
  loadTasks
} from '@/lib/taskManager';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('order');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const storedTasks = loadTasks();
    setTasks(storedTasks);
    setIsLoading(false);
  }, []);

  const handleAddTask = (text: string, priority: Priority, dueDate: Date | null) => {
    const updatedTasks = createTask(tasks, text, priority, dueDate);
    setTasks(updatedTasks);
    toast({
      title: "Task added",
      description: "Your new task has been added to the list.",
    });
  };

  const handleToggleCompletion = (id: string) => {
    const updatedTasks = toggleTaskCompletion(tasks, id);
    setTasks(updatedTasks);
    
    // Find the task
    const task = tasks.find(t => t.id === id);
    
    if (task) {
      const newStatus = !task.completed;
      toast({
        title: newStatus ? "Task completed" : "Task reopened",
        description: newStatus 
          ? "The task has been marked as completed."
          : "The task has been marked as active again.",
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = deleteTask(tasks, id);
    setTasks(updatedTasks);
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
      variant: "destructive",
    });
  };

  const handleUpdatePriority = (id: string, priority: Priority) => {
    const updatedTasks = updateTaskPriority(tasks, id, priority);
    setTasks(updatedTasks);
    toast({
      title: "Priority updated",
      description: `Task priority set to ${priority}.`,
    });
  };

  const handleUpdateDueDate = (id: string, dueDate: Date | null) => {
    const updatedTasks = updateTaskDueDate(tasks, id, dueDate);
    setTasks(updatedTasks);
    
    if (dueDate) {
      toast({
        title: "Due date set",
        description: `The due date has been updated.`,
      });
    } else {
      toast({
        title: "Due date removed",
        description: "The due date has been cleared.",
      });
    }
  };

  const handleUpdateText = (id: string, text: string) => {
    const updatedTasks = updateTaskText(tasks, id, text);
    setTasks(updatedTasks);
    toast({
      title: "Task updated",
      description: "The task content has been updated.",
    });
  };

  const handleReorderTasks = (sourceId: string, destinationId: string) => {
    const updatedTasks = reorderTasks(tasks, sourceId, destinationId);
    setTasks(updatedTasks);
  };

  // Filter and sort tasks
  const filteredTasks = filterTasks(tasks, filter);
  const sortedAndFilteredTasks = sortTasks(filteredTasks, sortBy);

  // Count tasks for filters
  const tasksCount = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/70">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-medium tracking-tight mb-4">Task List</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            A minimal task manager to keep track of your daily activities
          </p>
        </header>

        <TaskInput onAddTask={handleAddTask} />

        <TaskFilters
          filter={filter}
          sortBy={sortBy}
          tasksCount={tasksCount}
          onFilterChange={setFilter}
          onSortChange={setSortBy}
        />

        <TaskList
          tasks={sortedAndFilteredTasks}
          isLoading={isLoading}
          onToggleCompletion={handleToggleCompletion}
          onDelete={handleDeleteTask}
          onUpdatePriority={handleUpdatePriority}
          onUpdateDueDate={handleUpdateDueDate}
          onUpdateText={handleUpdateText}
          onReorder={handleReorderTasks}
        />
      </div>
    </div>
  );
};

export default Index;
