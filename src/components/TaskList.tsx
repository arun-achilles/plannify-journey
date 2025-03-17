
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskContext, Task } from '@/context/TaskContext';
import TaskCard from './TaskCard';
import NewTaskDialog from './NewTaskDialog';
import { cn } from '@/lib/utils';
import { CheckIcon, FilterIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskListProps {
  className?: string;
  showCompleted?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ className, showCompleted = true }) => {
  const { tasks, completeTask, deleteTask } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>(['active']);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    // Search term filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Priority filter
    const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
    
    // Status filter
    const matchesStatus = statusFilter.length === 0 ||
      (statusFilter.includes('active') && !task.completed) ||
      (statusFilter.includes('completed') && task.completed);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });
  
  // Group tasks by day
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by completed status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by due date (null dates at the end)
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    
    // Finally by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FilterIcon className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes('high')}
                onCheckedChange={(checked) => {
                  setPriorityFilter(prev => 
                    checked 
                      ? [...prev, 'high']
                      : prev.filter(p => p !== 'high')
                  );
                }}
              >
                High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes('medium')}
                onCheckedChange={(checked) => {
                  setPriorityFilter(prev => 
                    checked 
                      ? [...prev, 'medium']
                      : prev.filter(p => p !== 'medium')
                  );
                }}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes('low')}
                onCheckedChange={(checked) => {
                  setPriorityFilter(prev => 
                    checked 
                      ? [...prev, 'low']
                      : prev.filter(p => p !== 'low')
                  );
                }}
              >
                Low
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('active')}
                onCheckedChange={(checked) => {
                  setStatusFilter(prev => 
                    checked 
                      ? [...prev, 'active']
                      : prev.filter(s => s !== 'active')
                  );
                }}
              >
                Active
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('completed')}
                onCheckedChange={(checked) => {
                  setStatusFilter(prev => 
                    checked 
                      ? [...prev, 'completed']
                      : prev.filter(s => s !== 'completed')
                  );
                }}
              >
                Completed
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-muted/40 rounded-full p-3 mb-3">
            <CheckIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            {searchTerm 
              ? "Try adjusting your search or filters to find what you're looking for."
              : "You're all caught up! Add a new task to get started."}
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div 
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            layout
          >
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <NewTaskDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialTask={editingTask || undefined}
        isEditing={true}
      />
    </div>
  );
};

export default TaskList;
