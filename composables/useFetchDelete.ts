import { useRuntimeConfig } from '#app';

export const useFetchDelete = async (url: string) => {
  const config = useRuntimeConfig();
  try {
    const response = await fetch(`${config.public.baseUrl}/api/${url}`, {
      method: `DELETE`,
    });
    return await response.status;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch data' };
  }
};
