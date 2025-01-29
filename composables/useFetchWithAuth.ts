export const useFetchWithAuth = async (
  url: string,
  method: string,
  token: any,
  body?: object
) => {
  // const token = 'your-access-token'; // เปลี่ยนเป็น token ของคุณ
  const config = useRuntimeConfig();
  try {
    const response = await fetch(`${config.public.baseUrl}/api/${url}`, {
      method: method, // เช่น 'GET', 'POST', 'PUT', 'DELETE'
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ใส่ Bearer token ใน header
      },
      body: body ? JSON.stringify(body) : undefined, // ใส่ body เฉพาะเมื่อมีค่า
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: 'Failed to fetch data' };
  }
};
