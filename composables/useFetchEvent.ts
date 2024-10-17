import type { Event } from '~/models/event';

import { useRuntimeConfig } from '#app';
export const useFetchEvent = async () => {
  const config = useRuntimeConfig();
  console.log(config.public.BASE_URL);

  const response = await fetch(`${config.public.BASE_URL}/api/events`);

  return response.json();
};
