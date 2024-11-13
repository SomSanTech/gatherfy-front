import { useRuntimeConfig } from '#app';

export const useFetchData = async (url: string) => {
  const config = useRuntimeConfig();
  console.log(`${config.public.baseUrl}/api/${url}`);
  try {
    const response = await fetch(
      `https://capstone24.sit.kmutt.ac.th/us1/api/${url}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch data' };
  }
};
