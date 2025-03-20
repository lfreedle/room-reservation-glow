
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { ReservationFormData } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string().min(1, "Please select a start time"),
  duration: z.number().min(1, "Duration must be at least 1 hour"),
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Please enter a valid email"),
  guestPhone: z.string().min(5, "Please enter a valid phone number"),
});

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", 
  "18:00", "19:00", "20:00"
];

const durations = [1, 2, 3, 4];

interface BookingFormProps {
  roomId: string;
  onSubmit: (data: ReservationFormData) => boolean;
  checkAvailability: (date: Date, startTime: string, duration: number) => boolean;
}

const BookingForm = ({ roomId, onSubmit, checkAvailability }: BookingFormProps) => {
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      startTime: "",
      duration: 1,
      guestName: "",
      guestEmail: "",
      guestPhone: "",
    },
  });

  const selectedDate = form.watch("date");
  const selectedTime = form.watch("startTime");
  const selectedDuration = form.watch("duration");

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    setIsCheckingAvailability(true);
    
    // Simulate a slight delay to show the checking state
    setTimeout(() => {
      const available = checkAvailability(data.date, data.startTime, data.duration);
      
      if (available) {
        const success = onSubmit(data);
        if (success) {
          toast.success("Reservation successful!");
          form.reset();
        } else {
          toast.error("Failed to book the room. Please try again.");
        }
      } else {
        toast.error("This time slot is no longer available. Please select another time.");
      }
      
      setIsCheckingAvailability(false);
    }, 800);
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)}
        className="animate-fade-in space-y-6"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      // Disable dates in the past
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedDate}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem 
                        key={time} 
                        value={time}
                        disabled={!selectedDate || (selectedDate && !checkAvailability(selectedDate, time, selectedDuration))}
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (hours)</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(parseInt(val))}
                  value={field.value.toString()}
                  disabled={!selectedDate || !selectedTime}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem 
                        key={duration} 
                        value={duration.toString()}
                        disabled={!selectedDate || !selectedTime || (selectedDate && selectedTime && !checkAvailability(selectedDate, selectedTime, duration))}
                      >
                        {duration} {duration === 1 ? 'hour' : 'hours'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="animate-fade-in space-y-4">
          <h3 className="text-base font-medium">Contact Information</h3>
          
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="guestEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="guestPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isCheckingAvailability}
        >
          {isCheckingAvailability ? "Checking availability..." : "Reserve Room"}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
