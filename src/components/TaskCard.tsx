
import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  CalendarIcon, 
  CheckIcon, 
  ClockIcon, 
  MoreVerticalIcon, 
  TrashIcon 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Task, Priority } from '@/context/TaskContext';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'low':
      return 'bg-[hsl(var(--task-low))]';
    case 'medium':
      return 'bg-[hsl(var(--task-medium))]';
    case 'high':
      return 'bg-[hsl(var(--task-high))]';
    default:
      return 'bg-muted';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1]
      }}
      layout
    >
      <Card 
        className={cn(
          'group overflow-hidden transition-all duration-200',
          task.completed ? 'opacity-60' : 'hover:shadow-md'
        )}
      >
        <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div>
              <Checkbox 
                checked={task.completed}
                onCheckedChange={() => onComplete(task.id)}
                className="transition-all"
              />
            </div>
            <div>
              <Badge
                variant="secondary"
                className={cn(
                  "px-2 py-0 text-xs font-normal capitalize",
                  getPriorityColor(task.priority),
                  "text-white"
                )}
              >
                {task.priority}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                <MoreVerticalIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-destructive"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        
        <CardContent className="p-4">
          <h3 
            className={cn(
              "text-lg font-medium mb-2 transition-all",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>
          <p className="text-muted-foreground text-sm">{task.description}</p>
        </CardContent>
        
        {task.dueDate && (
          <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{format(task.dueDate, 'MMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>{format(task.dueDate, 'h:mm a')}</span>
            </div>
          </CardFooter>
        )}
        
        {task.completed && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-primary text-primary-foreground rounded-full p-1">
              <CheckIcon className="w-4 h-4" />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default TaskCard;
