export const useAuth = () => {
  const accessToken = useCookie('accessToken');
  //   const accessToken = useCookie('accessToken', {
  //         httpOnly: false, // Debugging Phase
  //         secure: process.env.NODE_ENV === 'production',
  //         maxAge: 60 * 60,
  //       });
  const refreshToken = useCookie('refresh_token'); // ✅ HTTP-only Cookie
  const config = useRuntimeConfig();
  // const login = async (credentials) => {
  //   const res = await $fetch('/api/auth/login', { method: 'POST', body: credentials })
  //   accessToken.value = res.accessToken // เก็บ Access Token ใน state
  // }

  const refresh = async () => {
    try {
      const res = await fetch(`${config.public.baseUrl}/api/refresh`, {
        method: `POST`,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();
      console.log('res from auth refresh', data);
      console.log(data.accessToken);

      accessToken.value = data.accessToken;
    } catch {
      logout();
    }
  };

  const logout = () => {
    accessToken.value = null;
  };

  return { accessToken, refresh, logout };
};
