export const useFetchWithAuth = async (
  url: string,
  method: string,
  token: any,
  body?: object
) => {
  const config = useRuntimeConfig();
  try {
    const fetchData = async (token: string) => {
      const response = await fetch(`${config.public.baseUrl}/api/${url}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const status = response.status;

      if (!response.ok) {
        if (status === 401) {
          console.log('error 401 i sud');
          const auth = useAuth();
          const refreshedToken = await auth.refresh();
          if (refreshedToken) {
            return fetchData(auth.accessToken.value);
          }
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      let data = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return { status, data };
    };
    return await fetchData(token);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
