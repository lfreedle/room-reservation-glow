
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReservations } from '@/hooks/useReservations';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

const ThankYou = () => {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const { getRoomById } = useReservations();
  
  const room = roomId ? getRoomById(roomId) : undefined;
  
  useEffect(() => {
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
          
          <div className="mb-8 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              {room.thankYouMessage}
            </p>
            <p className="text-muted-foreground">
              A confirmation has been sent to the email address you provided.
            </p>
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
