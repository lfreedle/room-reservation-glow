
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReservations } from '@/hooks/useReservations';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import RoomCard from '@/components/RoomCard';

const Index = () => {
  const { rooms } = useReservations();

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 flex flex-col items-center justify-center min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-white to-gray-50" />
        
        <div className="absolute inset-0 z-[-1] opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#e5e7eb,transparent)]" />
        </div>
        
        <div className="container px-4 md:px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
              Simple Room Reservations
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.1,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-4"
          >
            Reserve Your Room with Ease
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="max-w-[700px] text-muted-foreground text-lg md:text-xl mb-8"
          >
            Book the Fellowship Hall or Sanctuary for your next event with our simple reservation system.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="group">
              <Link to="/book">
                Book Now
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/admin">
                Admin Panel
              </Link>
            </Button>
          </motion.div>
        </div>
        
        <div 
          className="absolute bottom-0 left-0 right-0 w-full h-40 z-[-1]"
          style={{
            background: 'linear-gradient(to top, rgb(249, 250, 251) 0%, transparent 100%)'
          }}
        />
      </section>
      
      {/* Features Section */}
      <section className="relative py-16 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Simple Reservation Process
            </h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Making a reservation has never been easier with our streamlined system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="h-6 w-6" />}
              title="Select Date & Time"
              description="Choose your preferred date and time for the reservation."
              index={0}
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6" />}
              title="Add Guest Details"
              description="Provide your contact information for the reservation."
              index={1}
            />
            <FeatureCard 
              icon={<Clock className="h-6 w-6" />}
              title="Confirmation"
              description="Receive instant confirmation for your room reservation."
              index={2}
            />
          </div>
        </div>
      </section>
      
      {/* Rooms Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Our Rooms
            </h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              We offer two distinct spaces for your events and gatherings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Room Reservation System. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/book" className="text-sm text-muted-foreground hover:text-primary">
                Book a Room
              </Link>
              <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.1 * index,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={cn(
        "flex flex-col items-center p-6 rounded-xl",
        "bg-white shadow-sm border border-border"
      )}
    >
      <div 
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full mb-4",
          "bg-primary/10 text-primary"
        )}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </motion.div>
  );
};

export default Index;
