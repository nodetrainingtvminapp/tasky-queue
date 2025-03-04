import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Flag, 
  Trash2, 
  MoreHorizontal, 
  Edit,
  GripVertical,
  X,
  Check,
  Clock
} from "lucide-react";
import { formatDate, getDueDateClass } from '@/utils/dateUtils';
import { cn } from "@/lib/utils";
import { Task, Priority } from '@/lib/taskManager';

interface TaskItemProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  onUpdateDueDate: (id: string, dueDate: Date | null) => void;
  onUpdateText: (id: string, text: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragEnd: () => void;
  onEditTask: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleCompletion,
  onDelete,
  onUpdatePriority,
  onUpdateDueDate,
  onUpdateText,
  onDragStart,
  onDragOver,
  onDragEnd,
  onEditTask
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const taskRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (taskRef.current) {
        taskRef.current.classList.add('task-dragging');
      }
    }, 0);
    onDragStart(task.id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(task.id);
  };
  
  const handleDragEnd = () => {
    if (taskRef.current) {
      taskRef.current.classList.remove('task-dragging');
    }
    onDragEnd();
  };
  
  const handleEdit = () => {
    setEditText(task.text);
    setIsEditing(true);
  };
  
  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdateText(task.id, editText);
    }
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleFullEdit = () => {
    onEditTask(task);
  };
  
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
    }
  };
  
  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'low': return <Flag className="h-3.5 w-3.5 text-emerald-600" />;
      case 'medium': return <Flag className="h-3.5 w-3.5 text-amber-600" />;
      case 'high': return <Flag className="h-3.5 w-3.5 text-rose-600" />;
    }
  };

  const getTaskColor = () => {
    const hashCode = task.text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hashCode % 360;
    return { backgroundColor: `hsl(${hue}, 80%, 96%)` };
  };

  return (
    <div
      ref={taskRef}
      className={cn(
        "task-card group flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-white/90 backdrop-blur-sm mb-3",
        task.completed && "bg-muted/50",
        isEditing && "edit-active"
      )}
      style={!task.completed ? getTaskColor() : {}}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-none pt-0.5">
        <GripVertical className="h-5 w-5 text-muted-foreground/40 cursor-grab active:cursor-grabbing" />
      </div>
      
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggleCompletion(task.id)}
        className={cn(
          "h-5 w-5 rounded-full border-2 transition-colors duration-200 data-[state=checked]:bg-primary",
          task.completed ? "border-primary" : "border-muted-foreground/30"
        )}
      />
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              ref={inputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveEdit();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
            />
            <Button
              size="icon"
              variant="default"
              onClick={handleSaveEdit}
              className="h-8 w-8 flex-none"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleCancelEdit}
              className="h-8 w-8 flex-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <p className={cn(
                "text-base leading-tight break-words",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.text}
              </p>
              
              <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleEdit}
                  className="h-7 w-7 rounded-full"
                  title="Quick edit"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleFullEdit}
                  className="h-7 w-7 rounded-full"
                  title="Full edit"
                >
                  <Edit className="h-3.5 w-3.5 text-primary" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 rounded-full"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={() => onDelete(task.id)}
                      className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "h-6 px-2 text-xs flex gap-1 items-center",
                      getPriorityColor(task.priority)
                    )}
                  >
                    {getPriorityIcon(task.priority)}
                    <span>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-32">
                  <DropdownMenuItem 
                    onClick={() => onUpdatePriority(task.id, 'low')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Flag className="h-4 w-4 text-emerald-600" /> Low
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onUpdatePriority(task.id, 'medium')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Flag className="h-4 w-4 text-amber-600" /> Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onUpdatePriority(task.id, 'high')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Flag className="h-4 w-4 text-rose-600" /> High
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-6 px-2 text-xs flex gap-1 items-center",
                      task.dueDate ? getDueDateClass(task.dueDate) : "text-muted-foreground"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    {task.dueDate ? formatDate(task.dueDate) : "No date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-2 flex justify-between items-center border-b">
                    <span className="text-sm font-medium">Due date</span>
                    {task.dueDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateDueDate(task.id, null)}
                        className="h-7 px-2 text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <Calendar
                    mode="single"
                    selected={task.dueDate || undefined}
                    onSelect={(date) => onUpdateDueDate(task.id, date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
