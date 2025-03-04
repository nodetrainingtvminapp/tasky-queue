
import { nanoid } from 'nanoid';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: Priority;
  dueDate: Date | null;
  order: number;
}

export type TaskFilter = 'all' | 'active' | 'completed';

export type SortOption = 'order' | 'dueDate' | 'priority' | 'alphabetical';

// Persist tasks to localStorage
const TASKS_STORAGE_KEY = 'tasks-app-data';

// Load tasks from localStorage
const loadTasks = (): Task[] => {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
      return JSON.parse(savedTasks, (key, value) => {
        if (key === 'createdAt' || key === 'dueDate') {
          return value ? new Date(value) : null;
        }
        return value;
      });
    }
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
  }
  return [];
};

// Save tasks to localStorage
const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

// Create a new task
export const createTask = (
  tasks: Task[],
  text: string,
  priority: Priority = 'medium',
  dueDate: Date | null = null
): Task[] => {
  if (!text.trim()) return tasks;
  
  // Find the highest order value and add 1
  const maxOrder = tasks.length > 0
    ? Math.max(...tasks.map(task => task.order))
    : -1;
  
  const newTask: Task = {
    id: nanoid(),
    text: text.trim(),
    completed: false,
    createdAt: new Date(),
    priority,
    dueDate,
    order: maxOrder + 1
  };
  
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Toggle task completion status
export const toggleTaskCompletion = (tasks: Task[], id: string): Task[] => {
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Delete a task
export const deleteTask = (tasks: Task[], id: string): Task[] => {
  const updatedTasks = tasks.filter(task => task.id !== id);
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Update task priority
export const updateTaskPriority = (tasks: Task[], id: string, priority: Priority): Task[] => {
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, priority } : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Update task due date
export const updateTaskDueDate = (tasks: Task[], id: string, dueDate: Date | null): Task[] => {
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, dueDate } : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Update task text
export const updateTaskText = (tasks: Task[], id: string, text: string): Task[] => {
  if (!text.trim()) return tasks;
  
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, text: text.trim() } : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Reorder tasks
export const reorderTasks = (tasks: Task[], sourceId: string, destinationId: string): Task[] => {
  const sourceIndex = tasks.findIndex(task => task.id === sourceId);
  const destinationIndex = tasks.findIndex(task => task.id === destinationId);
  
  if (sourceIndex === -1 || destinationIndex === -1) return tasks;
  
  const result = [...tasks];
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destinationIndex, 0, removed);
  
  // Update order values
  const updatedTasks = result.map((task, index) => ({
    ...task,
    order: index
  }));
  
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Filter tasks
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'all':
    default:
      return tasks;
  }
};

// Sort tasks
export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
  switch (sortBy) {
    case 'dueDate':
      return [...tasks].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return a.order - b.order;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      });
    case 'priority':
      const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
      return [...tasks].sort((a, b) => 
        priorityOrder[a.priority] - priorityOrder[b.priority] || a.order - b.order
      );
    case 'alphabetical':
      return [...tasks].sort((a, b) => a.text.localeCompare(b.text));
    case 'order':
    default:
      return [...tasks].sort((a, b) => a.order - b.order);
  }
};

export { loadTasks, saveTasks };
