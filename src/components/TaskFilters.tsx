
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Circle, 
  ListFilter, 
  Calendar, 
  Flag, 
  SortAsc 
} from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TaskFilter, SortOption } from '@/lib/taskManager';

interface TaskFiltersProps {
  filter: TaskFilter;
  sortBy: SortOption;
  tasksCount: {
    all: number;
    active: number;
    completed: number;
  };
  onFilterChange: (filter: TaskFilter) => void;
  onSortChange: (sortBy: SortOption) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  filter, 
  sortBy, 
  tasksCount, 
  onFilterChange, 
  onSortChange 
}) => {
  const getSortLabel = () => {
    switch (sortBy) {
      case 'dueDate': return 'Due Date';
      case 'priority': return 'Priority';
      case 'alphabetical': return 'Alphabetical';
      case 'order': return 'Manual Order';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 animate-slide-down">
      <Tabs 
        value={filter} 
        onValueChange={(value) => onFilterChange(value as TaskFilter)}
        className="w-full sm:w-auto"
      >
        <TabsList className="w-full sm:w-auto grid grid-cols-3 h-10 bg-white/80 backdrop-blur-sm border">
          <TabsTrigger value="all" className="flex items-center gap-1.5">
            <ListFilter className="h-4 w-4" />
            <span>All</span>
            {tasksCount.all > 0 && (
              <span className="ml-1 text-xs bg-muted rounded-full px-1.5 py-0.5 min-w-5 text-center">
                {tasksCount.all}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-1.5">
            <Circle className="h-4 w-4" />
            <span>Active</span>
            {tasksCount.active > 0 && (
              <span className="ml-1 text-xs bg-muted rounded-full px-1.5 py-0.5 min-w-5 text-center">
                {tasksCount.active}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Done</span>
            {tasksCount.completed > 0 && (
              <span className="ml-1 text-xs bg-muted rounded-full px-1.5 py-0.5 min-w-5 text-center">
                {tasksCount.completed}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm h-10">
              <SortAsc className="h-4 w-4 mr-1.5" />
              <span>Sort by: {getSortLabel()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => onSortChange('order')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <SortAsc className="h-4 w-4" /> Manual Order
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onSortChange('dueDate')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="h-4 w-4" /> Due Date
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onSortChange('priority')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Flag className="h-4 w-4" /> Priority
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onSortChange('alphabetical')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ListFilter className="h-4 w-4" /> Alphabetical
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TaskFilters;
