import { useRuntimeConfig } from '#app';

export const useFetchUpload = async (url: string, file: string) => {
  const config = useRuntimeConfig();
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${config.public.baseUrl}/api/${url}`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error fetching`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch data' };
  }
};
