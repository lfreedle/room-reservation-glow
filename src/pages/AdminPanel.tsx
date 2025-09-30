
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReservations } from '@/hooks/useReservations';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import AdminCalendar from '@/components/AdminCalendar';
import RecurringEventForm from '@/components/RecurringEventForm';
import BlockTimeForm from '@/components/BlockTimeForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecurringEvent } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock, CalendarDays, Trash2, LogOut, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { 
    rooms, 
    reservations, 
    recurringEvents, 
    addReservation,
    addRecurringEvent,
    deleteReservation,
    deleteRecurringEvent
  } = useReservations();
  
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleAddRecurringEvent = (event: Omit<RecurringEvent, 'id'>) => {
    const success = addRecurringEvent(event);
    return success;
  };
  
  const handleBlockTime = (data: { roomId: string; date: Date; startTime: string; duration: number; reason?: string }) => {
    const success = addReservation({
      roomId: data.roomId,
      date: data.date,
      startTime: data.startTime,
      duration: data.duration,
      guestName: "⛔ Admin Block",
      guestEmail: "admin@blocked.com",
      guestPhone: "N/A",
      eventDescription: data.reason || "Time blocked by administrator",
    });
    return success;
  };
  
  const handleLogout = () => {
    logout();
    toast.success('You have been logged out');
    navigate('/');
  };
  
  // If not authenticated, don't render the admin panel content
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container px-4 md:px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage room reservations and recurring events.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
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
            <TabsTrigger value="block" className="gap-2">
              <Ban className="h-4 w-4" />
              <span>Block Time</span>
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
          
          <TabsContent value="block" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Block Time Manually</CardTitle>
                  <CardDescription>
                    Block off specific dates and times to prevent bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BlockTimeForm 
                    rooms={rooms}
                    onSubmit={handleBlockTime}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
