export const isSessionTimeOut = useState('isSessionTimeOut', () => false);
export const isLoginPopup = useState('loginPopup', () => false);
export const isOTPPopup = useState('isOTPPopup', () => false);
export const isSignup = useState('isSignup', () => false);
export const userProfile = useState('userProfile', () => null);
export const role = useState('role', () => null);
export const isUserSignIn = useState('isUserSignIn', () => false);
export const isUserSignInCookie = useCookie('is_user_sign_in');
export const isLoading = useState('isLoading', () => true);
