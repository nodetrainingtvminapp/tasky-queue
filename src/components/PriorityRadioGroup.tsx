
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Flag } from 'lucide-react';
import { Priority } from '@/lib/taskManager';

interface PriorityRadioGroupProps {
  value: Priority;
  onValueChange: (value: Priority) => void;
}

const PriorityRadioGroup: React.FC<PriorityRadioGroupProps> = ({ 
  value, 
  onValueChange 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Priority
      </label>
      <ToggleGroup 
        type="single" 
        variant="outline"
        value={value} 
        onValueChange={(val) => {
          if (val) onValueChange(val as Priority);
        }}
        className="justify-start"
      >
        <ToggleGroupItem value="low" className="gap-1.5 priority-low-toggle">
          <Flag className="h-3.5 w-3.5 text-emerald-600" />
          <span>Low</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="medium" className="gap-1.5 priority-medium-toggle">
          <Flag className="h-3.5 w-3.5 text-amber-600" />
          <span>Medium</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="high" className="gap-1.5 priority-high-toggle">
          <Flag className="h-3.5 w-3.5 text-rose-600" />
          <span>High</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default PriorityRadioGroup;
