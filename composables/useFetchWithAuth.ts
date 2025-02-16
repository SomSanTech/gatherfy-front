export const useFetchWithAuth = async (
  url: string,
  method: string,
  token: any,
  body?: object
) => {
  const config = useRuntimeConfig();
  let isRetrying = false;

  try {
    const fetchData = async (token: string) => {
      const response = await fetch(`${config.public.baseUrl}/api/${url}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
      });

      const status = response.status;

      if (!response.ok) {
        if (status === 401) {
          isRetrying = true;
          const auth = useAuth();
          const refreshedToken = await auth.refresh();
          if (refreshedToken) {
            return fetchData(auth.accessToken.value);
          }
        }
        const errorData = await response.json().catch(() => null);
        if (status === 400 && errorData) {
          return { status, errorData };
        }

        throw new Error(
          errorData?.message || `Request failed with status ${status}`
        );
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
    console.error('Fetch Error:', error);
    return { error: (error as Error).message, status: 500 };
  }
};
