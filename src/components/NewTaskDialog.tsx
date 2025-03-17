
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTaskContext, Priority } from '@/context/TaskContext';

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: {
    id?: string;
    title: string;
    description: string;
    priority: Priority;
    dueDate: Date | null;
  };
  isEditing?: boolean;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high'] as const),
  dueDate: z.date().nullable(),
  dueTime: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewTaskDialog: React.FC<NewTaskDialogProps> = ({
  open,
  onOpenChange,
  initialTask,
  isEditing = false,
}) => {
  const { addTask, updateTask } = useTaskContext();

  // Extract time from dueDate if it exists
  const extractTimeString = (date: Date | null): string => {
    if (!date) return '12:00';
    return format(date, 'HH:mm');
  };

  const defaultValues: FormValues = {
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    priority: initialTask?.priority || 'medium',
    dueDate: initialTask?.dueDate || null,
    dueTime: initialTask?.dueDate ? extractTimeString(initialTask.dueDate) : '12:00',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Reset form when initialTask changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        title: initialTask?.title || '',
        description: initialTask?.description || '',
        priority: initialTask?.priority || 'medium',
        dueDate: initialTask?.dueDate || null,
        dueTime: initialTask?.dueDate ? extractTimeString(initialTask.dueDate) : '12:00',
      });
    }
  }, [initialTask, open, form]);

  const onSubmit = (values: FormValues) => {
    // Combine date and time
    let combinedDateTime = values.dueDate;
    
    if (combinedDateTime && values.dueTime) {
      const [hours, minutes] = values.dueTime.split(':').map(Number);
      combinedDateTime = new Date(combinedDateTime);
      combinedDateTime.setHours(hours, minutes);
    }
    
    if (isEditing && initialTask?.id) {
      updateTask(initialTask.id, {
        title: values.title,
        description: values.description || '',
        priority: values.priority,
        dueDate: combinedDateTime,
        completed: false,
      });
    } else {
      addTask({
        title: values.title,
        description: values.description || '',
        priority: values.priority,
        dueDate: combinedDateTime,
        completed: false,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your task details below.'
              : 'Add the details of your new task here.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add details about this task"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Time</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <div className="flex items-center">
                        <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          {...field}
                          value={field.value || '12:00'}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {isEditing ? 'Update Task' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
