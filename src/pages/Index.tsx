
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ClockIcon, ListChecksIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskList from '@/components/TaskList';
import NewTaskDialog from '@/components/NewTaskDialog';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import { useTaskContext } from '@/context/TaskContext';

const Index = () => {
  const { tasks } = useTaskContext();
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;
  
  // Calculate completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNewTask={() => setIsNewTaskDialogOpen(true)} />
      
      <main className="container mx-auto px-4 pt-28 pb-20">
        <AnimatedTransition animation="fade" delay={100}>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Track your tasks and stay productive
          </p>
        </AnimatedTransition>
        
        <AnimatedTransition animation="slide-up" delay={200}>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ListChecksIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-3xl font-bold">{totalTasks}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-3xl font-bold">{pendingTasks}</span>
                  {highPriorityTasks > 0 && (
                    <span className="ml-2 text-xs bg-[hsl(var(--task-high))] text-white px-2 py-1 rounded-full">
                      {highPriorityTasks} high priority
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-3xl font-bold">{completionRate}%</span>
                </div>
                <div className="w-full h-2 bg-muted mt-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition animation="slide-up" delay={300}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Tasks</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = '/tasks'}
            >
              View All
            </Button>
          </div>
          
          <TaskList />
        </AnimatedTransition>
      </main>
      
      <NewTaskDialog 
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
      />
    </div>
  );
};

export default Index;
