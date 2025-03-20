
export interface Room {
  id: string;
  name: string;
  description: string;
  image: string;
  thankYouMessage: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  eventDescription: string; // Required field for event description
  createdAt: Date;
  isRecurring?: boolean;
  recurringId?: string;
}

export interface RecurringEvent {
  id: string;
  roomId: string;
  title: string;
  dayOfWeek: number; // 0-6, where 0 is Sunday
  startTime: string;
  endTime: string;
  startDate: Date;
  endDate: Date | null; // null means indefinite
}

export interface ReservationFormData {
  date: Date;
  startTime: string;
  duration: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  eventDescription: string; // Required field for event description
}
