
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReservations } from '@/hooks/useReservations';
import Header from '@/components/Header';
import AdminCalendar from '@/components/AdminCalendar';
import RecurringEventForm from '@/components/RecurringEventForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecurringEvent } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock, CalendarDays, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { 
    rooms, 
    reservations, 
    recurringEvents, 
    addRecurringEvent,
    deleteReservation,
    deleteRecurringEvent
  } = useReservations();
  
  const [activeTab, setActiveTab] = useState<string>("calendar");
  
  const handleAddRecurringEvent = (event: Omit<RecurringEvent, 'id'>) => {
    const success = addRecurringEvent(event);
    return success;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container px-4 md:px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Panel</h1>
          <p className="text-muted-foreground mb-8">
            Manage room reservations and recurring events.
          </p>
        </motion.div>
        
        <Tabs defaultValue="calendar" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="recurring" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Recurring Events</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="animate-fade-in">
            <AdminCalendar 
              rooms={rooms}
              reservations={reservations}
              recurringEvents={recurringEvents}
              onDeleteReservation={deleteReservation}
            />
          </TabsContent>
          
          <TabsContent value="recurring" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <h2 className="text-xl font-semibold mb-4">Add Recurring Event</h2>
                <RecurringEventForm 
                  rooms={rooms}
                  onSubmit={handleAddRecurringEvent}
                />
              </div>
              
              <div>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Recurring Events</CardTitle>
                    <CardDescription>
                      These events repeat weekly on the specified day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recurringEvents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No recurring events added yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recurringEvents.map(event => {
                          const room = rooms.find(r => r.id === event.roomId);
                          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                          
                          return (
                            <Card key={event.id} className="bg-muted/30">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-medium">{event.title}</h3>
                                    <div className="text-sm text-muted-foreground">
                                      {room?.name}
                                    </div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                      deleteRecurringEvent(event.id);
                                      toast.success("Recurring event deleted");
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-y-1 text-sm mt-2">
                                  <div className="flex items-center gap-2">
                                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>Every {dayNames[event.dayOfWeek]}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>{event.startTime} - {event.endTime}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
