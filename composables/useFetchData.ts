import { useRuntimeConfig } from '#app';

export const useFetchData = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: object
): Promise<{ data?: T; status: number; error?: string }> => {
  const config = useRuntimeConfig();

  try {
    const response = await fetch(`${config.public.baseUrl}/api/${url}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log('useFetchCreateUpdate2 Response:', response);

    const status = response.status;

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (status === 400 && errorData) {
        return { status, errorData };
      }
      throw new Error(
        errorData?.message || `Request failed with status ${status}`
      );
    }
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      // ถ้าเป็น JSON
      let data: T | null = null;
      try {
        const responseText = await response.text(); // ดึงข้อมูลเป็นข้อความ
        data = JSON.parse(responseText); // พยายามแปลงเป็น JSON
      } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Response is not valid JSON');
      }
      return { data, status };
    } else {
      // ถ้าไม่ใช่ JSON คืนค่าผลลัพธ์เป็นข้อความธรรมดา
      const responseText = await response.text();
      return { data: responseText as unknown as T, status }; // คืนค่าข้อความ
    }
    // const data: T = await response.json();
    // return { data, status };
  } catch (error) {
    console.error('Fetch Error:', error);
    return { error: (error as Error).message, status: 500 };
  }
};
