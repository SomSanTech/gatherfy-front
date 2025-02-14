import { useRuntimeConfig } from '#app';

export const useFetchCreateUpdate2 = async (
  url: string,
  method: string,
  body?: object
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
    console.log('useFetchCreateUpdate2', response);

    if (!response.ok) {
      throw new Error(`Error fetching`);
    }
    console.log('Request Body:', JSON.stringify(body, null, 2));

    return response;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch data' };
  }
};
