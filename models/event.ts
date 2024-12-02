export interface Event {
  eventId: number;
  name: string;
  description: string;
  detail: string;
  start_date: string;
  end_date: string;
  location: string;
  map: string;
  capacity: number;
  status: string;
  slug: string;
  image: string;
  owner: string;
  tags: any;
}
