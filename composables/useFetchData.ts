import { useRuntimeConfig } from '#app';

export const useFetchData = async (url: string) => {
  const config = useRuntimeConfig();
  try {
    const response = await fetch(`${config.public.BASE_API}/api/${url}`);
    if (!response.ok) {
      throw new Error(`Error fetching ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch data' };
  }
};
