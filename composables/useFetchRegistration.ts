import { useRuntimeConfig } from '#app';

export const useFetchRegistration = async (
  url: string,
  method: string,
  body: object
) => {
  const config = useRuntimeConfig();
  try {
    const response = await fetch(`${config.public.baseUrl}/api/${url}`, {
      method: `${method}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Error fetching`);
    }
    return await response.status;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch data' };
  }
};