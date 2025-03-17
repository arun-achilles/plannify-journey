
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import CalendarView from '@/components/Calendar';
import NewTaskDialog from '@/components/NewTaskDialog';
import AnimatedTransition from '@/components/AnimatedTransition';

const CalendarPage = () => {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const handleAddTask = (date: Date) => {
    setSelectedDate(date);
    setIsNewTaskDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar onNewTask={() => setIsNewTaskDialogOpen(true)} />
      
      <main className="container mx-auto px-4 pt-28 pb-20">
        <AnimatedTransition animation="fade" delay={100}>
          <h1 className="text-4xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground mb-8">
            Visualize your tasks on a calendar
          </p>
        </AnimatedTransition>
        
        <AnimatedTransition animation="slide-up" delay={200}>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <CalendarView onAddTask={handleAddTask} />
          </div>
        </AnimatedTransition>
      </main>
      
      <NewTaskDialog 
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
        initialTask={selectedDate ? { 
          id: '', 
          title: '', 
          description: '', 
          priority: 'medium', 
          dueDate: selectedDate,
          completed: false,
          createdAt: new Date()
        } : undefined}
      />
    </div>
  );
};

export default CalendarPage;
