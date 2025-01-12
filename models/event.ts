export interface Event {
  eventId: number;
  name: string;
  description: string;
  detail: string;
  start_date: string;
  end_date: string;
  ticket_start_date: string;
  ticket_end_date: string;
  registration_goal: number;
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
  event_name: string;
  event_desc: string;
  event_detail: string;
  event_start_date: string;
  event_end_date: string;
  event_ticket_start_date: string;
  event_ticket_end_date: string;
  event_registration_goal: number;
  event_location: string;
  event_google_map: string;
  event_capacity: number;
  event_slug: string;
  event_image: string;
  event_owner: number;
  tags: any;
}
