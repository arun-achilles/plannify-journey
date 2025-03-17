import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay
} from 'date-fns';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  ClockIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTaskContext, Task } from '@/context/TaskContext';
import AnimatedTransition from './AnimatedTransition';

interface CalendarProps {
  onSelectDate?: (date: Date) => void;
  onAddTask?: (date: Date) => void;
}

const CalendarView: React.FC<CalendarProps> = ({ onSelectDate, onAddTask }) => {
  const { tasks } = useTaskContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDay = getDay(monthStart);
  
  const blanks = Array(startDay).fill(null);
  
  const allDays = [...blanks, ...monthDays];
  
  const tasksByDate: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    if (task.dueDate) {
      const dateKey = format(task.dueDate, 'yyyy-MM-dd');
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey].push(task);
    }
  });
  
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (onSelectDate) {
      onSelectDate(date);
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePrevMonth}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleNextMonth}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 auto-rows-fr">
        {allDays.map((day, index) => {
          if (!day) {
            return <div key={`blank-${index}`} className="rounded-md"></div>;
          }
          
          const formattedDate = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate[formattedDate] || [];
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          
          return (
            <div
              key={formattedDate}
              className={cn(
                "min-h-28 rounded-md border p-1 transition-all",
                isCurrentMonth ? "bg-card" : "bg-muted/20",
                isSelected && "ring-2 ring-primary",
                isToday && "border-primary"
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex items-center justify-between p-1">
                <span
                  className={cn(
                    "text-sm font-medium h-6 w-6 rounded-full flex items-center justify-center",
                    isToday && "bg-primary text-primary-foreground",
                    !isToday && isSelected && "bg-secondary"
                  )}
                >
                  {format(day, 'd')}
                </span>
                
                {isCurrentMonth && onAddTask && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTask(day);
                    }}
                  >
                    <PlusIcon className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="mt-1 space-y-1 overflow-hidden">
                {dayTasks.length > 0 && (
                  <AnimatedTransition animation="fade" delay={100}>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map(task => (
                        <div
                          key={task.id}
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded truncate",
                            task.completed 
                              ? "line-through opacity-50 bg-muted" 
                              : `task-priority-${task.priority}`
                          )}
                        >
                          <div className="flex justify-between items-center">
                            <span className="truncate">{task.title}</span>
                            {task.dueDate && (
                              <span className="flex items-center ml-1 whitespace-nowrap">
                                <ClockIcon className="h-2.5 w-2.5 inline mr-0.5" />
                                {format(task.dueDate, 'HH:mm')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {dayTasks.length > 3 && (
                        <Badge variant="outline" className="w-full justify-center text-xs">
                          +{dayTasks.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </AnimatedTransition>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
