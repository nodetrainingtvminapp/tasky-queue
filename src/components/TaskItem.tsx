
import React, { useState, useRef } from 'react';
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
  Check
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
  onDragEnd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const taskRef = useRef<HTMLDivElement>(null);
  
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
  
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'low': return 'bg-priority-low text-green-800';
      case 'medium': return 'bg-priority-medium text-amber-800';
      case 'high': return 'bg-priority-high text-rose-800';
    }
  };
  
  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'low': return <Flag className="h-3.5 w-3.5 text-green-800" />;
      case 'medium': return <Flag className="h-3.5 w-3.5 text-amber-800" />;
      case 'high': return <Flag className="h-3.5 w-3.5 text-rose-800" />;
    }
  };

  return (
    <div
      ref={taskRef}
      className={cn(
        "group flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-white/90 backdrop-blur-sm mb-3 transition-all duration-200",
        "hover:border-border hover:shadow-sm animate-scale-in",
        task.completed && "bg-muted/50"
      )}
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
              variant="ghost"
              onClick={handleSaveEdit}
              className="h-8 w-8 flex-none"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
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
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full">
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
                    <Flag className="h-4 w-4 text-green-600" /> Low
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
                    <CalendarIcon className="h-3 w-3" />
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
