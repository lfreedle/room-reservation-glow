import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Reservation, RecurringEvent, Room } from '@/types';
import { eachDayOfInterval, isSameDay, format, isBefore, isAfter, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { Clock, User, Mail, Phone, FileText } from 'lucide-react';

import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface AdminCalendarProps {
  rooms: Room[];
  reservations: Reservation[];
  recurringEvents: RecurringEvent[];
  onDeleteReservation: (id: string) => void;
}

const AdminCalendar = ({ 
  rooms, 
  reservations, 
  recurringEvents,
  onDeleteReservation
}: AdminCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0]?.id || '');
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);
  const [dateReservations, setDateReservations] = useState<Reservation[]>([]);
  const [highlightedDays, setHighlightedDays] = useState<Date[]>([]);
  
  useEffect(() => {
    if (!selectedRoom) return;
    
    const startDate = new Date();
    const endDate = addMonths(startDate, 3);
    const interval = eachDayOfInterval({ start: startDate, end: endDate });
    
    setCalendarDates(interval);
    
    const reservedDays = reservations
      .filter(res => res.roomId === selectedRoom)
      .map(res => new Date(res.date));
    
    const recurringDays = interval.filter(date => {
      const dayOfWeek = date.getDay();
      
      return recurringEvents.some(event => {
        if (event.roomId !== selectedRoom || event.dayOfWeek !== dayOfWeek) {
          return false;
        }
        
        const eventStartDate = new Date(event.startDate);
        if (isBefore(date, eventStartDate)) {
          return false;
        }
        
        if (event.endDate && isAfter(date, event.endDate)) {
          return false;
        }
        
        return true;
      });
    });
    
    const allReservedDays = [...reservedDays, ...recurringDays];
    setHighlightedDays(allReservedDays);
    
  }, [selectedRoom, reservations, recurringEvents]);
  
  useEffect(() => {
    if (!selectedDate || !selectedRoom) return;
    
    const filteredReservations = reservations.filter(
      res => res.roomId === selectedRoom && isSameDay(new Date(res.date), selectedDate)
    );
    
    setDateReservations(filteredReservations);
  }, [selectedDate, selectedRoom, reservations]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Room</CardTitle>
              <CardDescription>Select a room to view its calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedRoom}
                onValueChange={setSelectedRoom}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Red dates are reserved</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                modifiers={{
                  reserved: highlightedDays,
                }}
                modifiersClassNames={{
                  reserved: "bg-red-100 text-red-600 hover:bg-red-200 rounded-md"
                }}
                fromDate={new Date()}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Reservations</CardTitle>
                  <CardDescription>
                    {format(selectedDate, 'PPPP')}
                  </CardDescription>
                </div>
                <Badge variant={dateReservations.length > 0 ? "destructive" : "secondary"}>
                  {dateReservations.length > 0 ? 'Reserved' : 'Available'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {dateReservations.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No reservations for this date
                </div>
              ) : (
                <div className="space-y-4">
                  {dateReservations.map(reservation => (
                    <Card key={reservation.id} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium">{reservation.guestName}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{reservation.startTime} - {reservation.endTime}</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              onDeleteReservation(reservation.id);
                              toast.success("Reservation cancelled");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{reservation.guestEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{reservation.guestPhone}</span>
                          </div>
                        </div>
                        
                        {reservation.eventDescription && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <div className="flex items-start gap-2 text-sm">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                              <p className="text-muted-foreground">{reservation.eventDescription}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;
