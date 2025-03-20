
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReservations } from '@/hooks/useReservations';
import { ReservationFormData } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';
import { Button } from '@/components/ui/button';
import RoomCard from '@/components/RoomCard';

const BookRoom = () => {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const { rooms, isRoomAvailable, addReservation, getRoomById } = useReservations();
  const [selectedRoom, setSelectedRoom] = useState(roomId);

  useEffect(() => {
    // If roomId is provided and valid, set it as selected
    if (roomId && rooms.some(room => room.id === roomId)) {
      setSelectedRoom(roomId);
    }
  }, [roomId, rooms]);

  const handleRoomSelect = (id: string) => {
    setSelectedRoom(id);
    navigate(`/book/${id}`);
  };

  const handleSubmit = (data: ReservationFormData) => {
    if (!selectedRoom) return false;
    
    const success = addReservation({
      roomId: selectedRoom,
      ...data
    });
    
    if (success) {
      // Navigate to thank you page
      navigate(`/thank-you/${selectedRoom}`);
    }
    
    return success;
  };

  const checkAvailability = (date: Date, startTime: string, duration: number) => {
    if (!selectedRoom) return false;
    
    // Calculate the end time for availability check
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const totalMinutes = startHour * 60 + startMinute + duration * 60;
    const endHour = Math.floor(totalMinutes / 60) % 24;
    const endMinute = totalMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    return isRoomAvailable(selectedRoom, date, startTime, endTime);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container px-4 md:px-6 pt-32 pb-16">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-8"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {selectedRoom ? `Book ${getRoomById(selectedRoom)?.name}` : 'Book a Room'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {selectedRoom ? 
              'Fill out the form below to reserve this room.' : 
              'Select a room to begin the reservation process.'}
          </p>
        </motion.div>
        
        {!selectedRoom ? (
          // Room selection view
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room, index) => (
              <div key={room.id} onClick={() => handleRoomSelect(room.id)} className="cursor-pointer">
                <RoomCard room={room} index={index} />
              </div>
            ))}
          </div>
        ) : (
          // Room booking form view
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <BookingForm 
                roomId={selectedRoom}
                onSubmit={handleSubmit}
                checkAvailability={checkAvailability}
              />
            </div>
            
            <div className="lg:sticky lg:top-32 self-start">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
                <p className="text-muted-foreground mb-4">
                  You're booking the {getRoomById(selectedRoom)?.name}. Please fill out the form with your information
                  and select your preferred date and time.
                </p>
                <h3 className="font-medium mb-2">Important Notes:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Reservations are subject to availability</li>
                  <li>Please check the calendar for available time slots</li>
                  <li>You will receive a confirmation once your booking is complete</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRoom;
