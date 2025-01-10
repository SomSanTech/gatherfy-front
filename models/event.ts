export interface Event {
  eventId: number;
  name: string;
  description: string;
  detail: string;
  start_date: string;
  end_date: string;
  ticket_start_date: string;
  ticket_end_date: string;
  location: string;
  map: string;
  capacity: number;
  status: string;
  slug: string;
  image: string;
  owner: string;
  tags: any;
}

export interface EditEvent {
  name: string;
  description: string;
  detail: string;
  start_date: string;
  end_date: string;
  ticket_start_date: string;
  ticket_end_date: string;
  location: string;
  map: string;
  capacity: number;
  status: string;
  slug: string;
  image: string;
  owner: string;
  tags: any;
}
