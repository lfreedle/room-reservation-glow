
import { Room } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoomCardProps {
  room: Room;
  index: number;
}

const RoomCard = ({ room, index }: RoomCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 } 
      }}
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-white shadow-sm border border-border",
        "transition-all duration-300"
      )}
    >
      <div className="aspect-video w-full bg-muted/50 overflow-hidden">
        <img 
          src={room.image} 
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>
      
      <div className="p-6">
        <div className="inline-block px-3 py-1 mb-3 text-xs font-medium text-primary bg-primary/10 rounded-full">
          Room
        </div>
        <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{room.description}</p>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Hourly</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Multiple</span>
          </div>
        </div>
        
        <Link 
          to={`/book/${room.id}`}
          className={cn(
            "inline-block w-full text-center py-3 px-4 rounded-lg font-medium",
            "bg-primary text-white",
            "transition-all duration-200 hover:bg-primary/90",
            "focus:outline-none focus:ring-2 focus:ring-primary/20"
          )}
        >
          Reserve Now
        </Link>
      </div>
    </motion.div>
  );
};

export default RoomCard;
