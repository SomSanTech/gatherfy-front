export const useAuth = () => {
  const accessToken = useCookie('accessToken');
  const refreshToken = useCookie('refreshToken');
  const role = useCookie('roleCookie');
  const profileData = useCookie('profileData');
  const isSessionTimeOuts = useState('isSessionTimeOut');
  const isUserSignInCookie = useCookie('is_user_sign_in');
  // const isCookieConsent = useCookie('cookie_consent');

  const isClickOK = useState('isClickOk', () => false);
  const isHavePopupOpen = useState('isHavePopupOpen', () => false);
  const isLoggingOut = useState('isLoggingOut', () => false);
  const router = useRouter();
  const config = useRuntimeConfig();
  // const userRegisHistory = useCookie('user_regis_history');
  const userRegisHistory = useState('userRegisHistory', () => []);

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

      accessToken.value = data.accessToken;
      return true;
    } catch {
      // logout();
      isSessionTimeOuts.value = true;
      return false;
    }
  };

  const logout = () => {
    isLoggingOut.value = true;
    if (!accessToken.value && !refreshToken.value) {
      console.error('Already logged out, skipping reload');
      return;
    }
    accessToken.value = null;
    refreshToken.value = null;
    role.value = null;
    profileData.value = null;
    // isCookieConsent.value = null;
    isUserSignInCookie.value = null;
    router.push('/').then(() => {
      window.location.reload();
    });
  };

  const handleSessionExpire = async () => {
    accessToken.value = null;
    refreshToken.value = null;
    role.value = null;
    profileData.value = null;
    isUserSignInCookie.value = null;
    // isCookieConsent.value = null;

    isSessionTimeOuts.value = false;
    isHavePopupOpen.value = false;

    router.push('/').then(() => {
      window.location.reload();
    });

    isClickOK.value = true;
  };

  return { accessToken, refresh, logout, handleSessionExpire };
};
