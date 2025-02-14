import { useRuntimeConfig } from '#app';

export const useFetchUpload = async (
  url: string,
  file: string,
  bucket: string,
  token?: string
) => {
  const config = useRuntimeConfig();
  try {
    const formData = new FormData();
    formData.append('bucket', bucket);
    formData.append('file', file);
    console.log('formData', formData);
    let response;
    if (token) {
      response = await fetch(`${config.public.baseUrl}/api/${url}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    } else {
      response = await fetch(`${config.public.baseUrl}/api/${url}`, {
        method: 'POST',
        body: formData,
      });
    }
    if (!response.ok) {
      throw new Error(`Error fetching`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch data' };
  }
};
