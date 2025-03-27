import { useState, useEffect } from 'react';
import { Reservation, RecurringEvent, Room } from '@/types';

// Mock rooms data
const ROOMS: Room[] = [
  {
    id: "fellowship-hall",
    name: "Fellowship Hall",
    description: "A spacious hall perfect for community gatherings, events, and meetings.",
    image: "https://images.squarespace-cdn.com/content/612fcd1969828e47926e57b4/f88c3aab-e3d4-4fbd-b3c3-d7527abfb1f7/fs02.jpeg?content-type=image/jpeg",
    thankYouMessage: "Thank you for booking the Fellowship Hall. We look forward to hosting your event!"
  },
  {
    id: "sanctuary",
    name: "Sanctuary",
    description: "A serene and beautiful space for worship, ceremonies, and contemplation.",
    image: "https://images.squarespace-cdn.com/content/612fcd1969828e47926e57b4/906b3394-5ba3-4024-8009-bab9cb79ef92/sy01.jpeg?content-type=image/jpeg",
    thankYouMessage: "Thank you for booking the Sanctuary. We're honored to provide this sacred space for your event."
  }
];

// Mock data for initial development
const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "1",
    roomId: "fellowship-hall",
    date: new Date(2024, 7, 15),
    startTime: "10:00",
    endTime: "12:00",
    duration: 2,
    guestName: "John Doe",
    guestEmail: "john@example.com",
    guestPhone: "123-456-7890",
    eventDescription: "Community meeting with about 30 attendees",
    createdAt: new Date()
  }
];

const INITIAL_RECURRING_EVENTS: RecurringEvent[] = [
  {
    id: "1",
    roomId: "sanctuary",
    title: "Weekly Service",
    dayOfWeek: 0, // Sunday
    startTime: "09:00",
    endTime: "11:00",
    startDate: new Date(2024, 7, 1),
    endDate: null
  }
];

export const useReservations = () => {
  // In a real app, you would fetch this data from an API
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('reservations');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'date' || key === 'createdAt') return new Date(value);
      return value;
    }) : INITIAL_RESERVATIONS;
  });

  const [recurringEvents, setRecurringEvents] = useState<RecurringEvent[]>(() => {
    const saved = localStorage.getItem('recurringEvents');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'startDate' || key === 'endDate') return value ? new Date(value) : null;
      return value;
    }) : INITIAL_RECURRING_EVENTS;
  });

  const [rooms] = useState<Room[]>(ROOMS);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('recurringEvents', JSON.stringify(recurringEvents));
  }, [recurringEvents]);

  // Function to check if a room is available at a specific date and time
  const isRoomAvailable = (roomId: string, date: Date, startTime: string, endTime: string): boolean => {
    const dateStr = date.toDateString();
    
    // Check against one-time reservations
    const conflictingReservation = reservations.find(res => {
      const resDateStr = new Date(res.date).toDateString();
      return res.roomId === roomId && 
             resDateStr === dateStr && 
             ((res.startTime <= startTime && res.endTime > startTime) || 
              (res.startTime < endTime && res.endTime >= endTime) ||
              (res.startTime >= startTime && res.endTime <= endTime));
    });
    
    if (conflictingReservation) return false;
    
    // Check against recurring events
    const dayOfWeek = date.getDay();
    const conflictingRecurringEvent = recurringEvents.find(event => {
      if (event.roomId !== roomId || event.dayOfWeek !== dayOfWeek) return false;
      
      const eventStartDate = new Date(event.startDate);
      if (date < eventStartDate) return false;
      
      if (event.endDate && date > event.endDate) return false;
      
      return ((event.startTime <= startTime && event.endTime > startTime) || 
              (event.startTime < endTime && event.endTime >= endTime) ||
              (event.startTime >= startTime && event.endTime <= endTime));
    });
    
    return !conflictingRecurringEvent;
  };

  // Add a new reservation
  const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt' | 'endTime'>): boolean => {
    const endTime = calculateEndTime(reservation.startTime, reservation.duration);
    
    if (!isRoomAvailable(reservation.roomId, reservation.date, reservation.startTime, endTime)) {
      return false;
    }
    
    const newReservation: Reservation = {
      ...reservation,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      endTime
    };
    
    setReservations(prev => [...prev, newReservation]);
    return true;
  };

  // Add a recurring event
  const addRecurringEvent = (event: Omit<RecurringEvent, 'id'>): boolean => {
    const newEvent: RecurringEvent = {
      ...event,
      id: crypto.randomUUID()
    };
    
    setRecurringEvents(prev => [...prev, newEvent]);
    return true;
  };

  // Delete a reservation
  const deleteReservation = (id: string): void => {
    setReservations(prev => prev.filter(res => res.id !== id));
  };

  // Delete a recurring event
  const deleteRecurringEvent = (id: string): void => {
    setRecurringEvents(prev => prev.filter(event => event.id !== id));
  };

  // Update a recurring event
  const updateRecurringEvent = (id: string, updates: Partial<RecurringEvent>): void => {
    setRecurringEvents(prev => 
      prev.map(event => event.id === id ? { ...event, ...updates } : event)
    );
  };

  // Helper function to calculate endTime from startTime and duration
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration * 60;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  // Get reservations for a specific room
  const getReservationsForRoom = (roomId: string): Reservation[] => {
    return reservations.filter(res => res.roomId === roomId);
  };

  // Get recurring events for a specific room
  const getRecurringEventsForRoom = (roomId: string): RecurringEvent[] => {
    return recurringEvents.filter(event => event.roomId === roomId);
  };

  // Get room by ID
  const getRoomById = (roomId: string): Room | undefined => {
    return rooms.find(room => room.id === roomId);
  };

  return {
    reservations,
    recurringEvents,
    rooms,
    isRoomAvailable,
    addReservation,
    addRecurringEvent,
    deleteReservation,
    deleteRecurringEvent,
    updateRecurringEvent,
    getReservationsForRoom,
    getRecurringEventsForRoom,
    getRoomById
  };
};
