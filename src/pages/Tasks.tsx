
import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/context/TaskContext';
import Navbar from '@/components/Navbar';
import TaskList from '@/components/TaskList';
import NewTaskDialog from '@/components/NewTaskDialog';
import AnimatedTransition from '@/components/AnimatedTransition';

const Tasks = () => {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const { tasks } = useTaskContext();
  
  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar onNewTask={() => setIsNewTaskDialogOpen(true)} />
      
      <main className="container mx-auto px-4 pt-28 pb-20">
        <AnimatedTransition animation="fade" delay={100}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tasks</h1>
              <p className="text-muted-foreground">
                {remainingTasks === 0 
                  ? "All caught up! No tasks remaining." 
                  : `You have ${remainingTasks} task${remainingTasks !== 1 ? 's' : ''} remaining`}
              </p>
            </div>
            
            <Button 
              onClick={() => setIsNewTaskDialogOpen(true)}
              className="mt-4 sm:mt-0 gap-2 self-start"
            >
              <PlusIcon className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition animation="slide-up" delay={200}>
          <TaskList showCompleted={true} />
        </AnimatedTransition>
      </main>
      
      <NewTaskDialog 
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
      />
    </div>
  );
};

export default Tasks;
