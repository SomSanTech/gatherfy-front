export const useAuth = () => {
  const accessToken = useCookie('accessToken');
  const refreshToken = useCookie('refreshToken');
  const role = useCookie('roleCookie');
  const profileData = useCookie('profileData');
  const isSessionTimeOuts = useState('isSessionTimeOut');
  const loginPopup = useLoginPopup();

  const router = useRouter();
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

      if (!res.ok) {
        throw new Error(`Refresh failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log('res from auth refresh', data);
      console.log(data.accessToken);

      accessToken.value = data.accessToken;
      return true;
    } catch {
      console.log('cant refresh');
      // logout();
      isSessionTimeOuts.value = true;
      return false;
    }
  };

  const logout = () => {
    if (!accessToken.value && !refreshToken.value) {
      console.log('Already logged out, skipping reload');
      return;
    }
    accessToken.value = null;
    refreshToken.value = null;
    role.value = null;
    profileData.value = null;
    router.push('/').then(() => {
      window.location.reload();
    });
  };

  const handleSessionExpire = () => {
    router.push('/').then(() => {
      window.location.reload();
    });
    isSessionTimeOuts.value = false;
    loginPopup.value = true;
  };

  return { accessToken, refresh, logout, handleSessionExpire };
};
