
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReservations } from '@/hooks/useReservations';
import { ArrowLeft, CheckCircle2, Calendar, Clock } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Reservation } from '@/types';
import { format } from 'date-fns';

const ThankYou = () => {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const { getRoomById } = useReservations();
  const [lastReservation, setLastReservation] = useState<Reservation | null>(null);
  
  const room = roomId ? getRoomById(roomId) : undefined;
  
  useEffect(() => {
    // Get the last reservation from localStorage
    const savedReservation = localStorage.getItem('lastReservation');
    if (savedReservation) {
      const reservation = JSON.parse(savedReservation, (key, value) => {
        if (key === 'date' || key === 'createdAt') return new Date(value);
        return value;
      });
      setLastReservation(reservation);
      // Clear it after reading
      localStorage.removeItem('lastReservation');
    }
    
    if (!room) {
      // If room doesn't exist, redirect to homepage
      navigate('/');
    }
  }, [room, navigate]);
  
  if (!room) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container px-4 md:px-6 pt-32 pb-16 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Reservation Confirmed!
          </h1>
          
          <div className="mb-8 text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Your reservation has been confirmed.
            </p>
            
            {lastReservation && (
              <div className="bg-white p-6 rounded-lg border border-border inline-block">
                <h2 className="font-semibold text-xl mb-4">{room.name}</h2>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <span>{format(lastReservation.date, 'PPPP')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>{lastReservation.startTime} - {lastReservation.endTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
            <Button asChild>
              <Link to="/book">
                Book Another Room
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYou;
