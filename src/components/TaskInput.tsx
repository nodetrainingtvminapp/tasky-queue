
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Flag, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Priority, Task } from '@/lib/taskManager';

interface TaskInputProps {
  onAddTask: (text: string, priority: Priority, dueDate: Date | null) => void;
  editingTask: Task | null;
  onCancelEdit: () => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, editingTask, onCancelEdit }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Update form when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
    } else {
      // Reset form when not editing
      setText('');
      setPriority('medium');
      setDueDate(null);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text, priority, dueDate);
      
      // Only reset if not in edit mode (edit mode will reset via the useEffect)
      if (!editingTask) {
        setText('');
        setPriority('medium');
        setDueDate(null);
      }
    }
  };

  const handleCancel = () => {
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Input
            className="pr-10 h-12 bg-white/80 backdrop-blur-sm border-2 focus-visible:ring-1 transition-all duration-200"
            placeholder="Enter task description..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="inline-flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Priority:</span>
          <ToggleGroup 
            type="single" 
            value={priority}
            onValueChange={(value) => value && setPriority(value as Priority)}
            className="bg-white/80 backdrop-blur-sm border rounded-lg p-1"
          >
            <ToggleGroupItem value="low" className="rounded-md data-[state=on]:bg-priority-low data-[state=on]:text-green-800">
              <Flag className="h-4 w-4 mr-1" /> Low
            </ToggleGroupItem>
            <ToggleGroupItem value="medium" className="rounded-md data-[state=on]:bg-priority-medium data-[state=on]:text-amber-800">
              <Flag className="h-4 w-4 mr-1" /> Medium
            </ToggleGroupItem>
            <ToggleGroupItem value="high" className="rounded-md data-[state=on]:bg-priority-high data-[state=on]:text-rose-800">
              <Flag className="h-4 w-4 mr-1" /> High
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="inline-flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Due date:</span>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "border bg-white/80 backdrop-blur-sm",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Set due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate || undefined}
                onSelect={(date) => {
                  setDueDate(date);
                  setCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {dueDate && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setDueDate(null)}
              className="h-8 px-2 text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {editingTask && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" /> Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={!text.trim()}
          className="flex items-center gap-1"
        >
          {editingTask ? (
            <>
              <Save className="h-4 w-4" /> Update Task
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add Task
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default TaskInput;
