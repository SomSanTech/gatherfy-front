<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components';
// import {
//   useCodeClient,
//   GoogleSignInButton,
//   useOneTap,
//   useTokenClient,
//   type CredentialResponse,
// } from 'vue3-google-signin';
import {
  GoogleSignInButton,
  type CredentialResponse,
} from 'vue3-google-signin';
// import type { CredentialResponse } from 'vue3-google-signin';
import { googleTokenLogin } from 'vue3-google-login';
const login = () => {
  googleTokenLogin().then((response) => {
    console.log('Handle the response', response);
  });
};
const credentials = ref<string | null>(null);

const handleLoginSuccesses = async (response: CredentialResponse) => {
  const { credential } = response;
  console.log('Access Token', credential);
  credentials.value = credential;
  await signInWithGoogle();
};

// handle an error event
const handleLoginErrores = () => {
  console.error('Login failed');
};

// useHead({
//   script: [
//     {
//       async: true,
//       src: 'https://accounts.google.com/gsi/client',
//       defer: true,
//     },
//   ],
// });
const isTokenExpired = (token: string) => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const exp = payload.exp * 1000; // milliseconds
  console.log(Date.now());
  console.log(exp);

  return Date.now() > exp;
};

const CLIENT_ID =
  '208535017949-i5clt2a567g51nhu9lj58ctdqo8vkp2i.apps.googleusercontent.com'; // ใช้ค่าจริงของคุณ
// const CLIENT_ID='791441779465-25p6jvgk58ldmlhge5g7ac2f5r0flot0.apps.googleusercontent.com'
const handleLoginSuccess = async (response: CredentialResponse) => {
  credentials.value = response.credential;
  console.log('JWT ID Token:', response.credential);
  await signInWithGoogle(); // แสดง One Tap หรือ Popup
};

const handleLoginError = () => {
  console.error('Login failed');
};

const initGoogleSignIn = () => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleLoginSuccess,
      // prompt_parent_id: "google-login-button"
    });
  }
};

const { state, showPopup } = usePopup();
const handleCompleteGGSignUp = () => {
  state.isVisible = false;
  loginPopup.value = !loginPopup.value;
};
const isSelectRolePopUp = ref(false);
const handleSelectRole = async () => {
  const response = await useFetchData('v1/signup/google', 'POST', {
    token: credentials.value,
    role: selectedRole.value,
  });

  if (response.status === 200) {
    isSelectRolePopUp.value = !isSelectRolePopUp.value;
    showPopup('Sign up with Google success please go Sing in', 'complete');
    // console.log('isvisible,', state.isVisible);

    // alert('signin success ja');
  }
};
const signInWithGoogle = async () => {
  if (credentials.value && !isTokenExpired(credentials.value)) {
    const response = await useFetchWithAuth(
      'v1/login/google',
      'POST',
      credentials.value
    );
    console.log('google', response);

    if (response.status !== 200) {
      console.log('select role');
      isSelectRolePopUp.value = !isSelectRolePopUp.value;
    } else {
      const accessToken = useCookie('accessToken', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
      });

      accessToken.value = response.data.accessToken;

      const refreshToken = useCookie('refreshToken', {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
      });
      refreshToken.value = response.data.refreshToken;

      role.value = decodeToken(accessToken.value)?.role;
      const roleCookie = useCookie('roleCookie', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
      });

      roleCookie.value = decodeToken(accessToken.value)?.role;

      const profileData = useCookie('profileData', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
      });
      if (response.data.accessToken) {
        const userProfileData = await useFetchWithAuth(
          'v1/profile',
          'GET',
          response.data.accessToken
        );
        profileData.value = userProfileData.data;
      }

      if (roleCookie.value === 'Attendee') {
        router.push('/');
      } else {
        router.push('/backoffice');
      }

      const regisData = await useFetchWithAuth(
        'v1/tickets',
        'GET',
        accessToken.value
      );
      userRegisHistory.value = regisData.data;

      alert('login gg leaw');
    }
    loginPopup.value = !loginPopup.value;
    isHavePopupOpen.value = false;
  } else {
    console.log('Token expired, need to re-login');
    // signIn();
  }
};

const signInGG = () => {
  if (window.google) {
    window.google.accounts.id.prompt(); // Show the Google login prompt (redirect)
  }
};

onMounted(() => {
  initGoogleSignIn();
});

const loadGoogleSDK = () => {
  if (!document.getElementById('google-sdk')) {
    const script = document.createElement('script');
    script.id = 'google-sdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
};

onMounted(() => {
  loadGoogleSDK();
});

const loginPopup = useState('loginPopup');
const isHavePopupOpen = useState('isHavePopupOpen');
const isSignup = useState('isSignup');
const confirmPassword = ref('');
const showPassword = ref(false);
const selectedGender = ref('female');
const birthday = ref();
const username = ref('');
const password = ref('');
const userProfile = useState('userProfile');
const signupData = ref({
  firstname: '',
  lastname: '',
  username: '',
  gender: '',
  email: '',
  phone: '',
  image: 'test.png',
  role: '',
  birthday: '',
  password: '',
});
const router = useRouter();
const selectedRole = ref('');
const patternCheck = ref<{ [key: string]: boolean }>({});
const allPatternCheck = ref<boolean>();
const isClickSignBtn = ref<boolean>(false);
const checkField = ref<{ [key: string]: boolean }>({
  testPass: true,
  confirmPassword: true,
  password: true,
  firstname: true,
  lastname: true,
  email: true,
  phone: true,
  username: true,
  gender: true,
  role: true,
  birthday: true,
});
const shouldShake = ref(false);
const role = useState('role');
const isWaitAuthen = ref<boolean>(false);
const loginStatus = ref<boolean>(true);
const fieldErrorMessages = {
  testPass: 'Passwords do not match or fail to meet the requirements.',
  confirmPassword: 'Please confirm your password.',
  password: 'Please enter your password.',
  firstname: 'Please enter your first name.',
  lastname: 'Please enter your last name.',
  email: 'Please provide a valid email address.',
  phone: 'Please enter your phone number.',
  username: 'Please enter your username.',
  gender: 'Please select your gender.',
  role: 'Please specify your role.',
  birthday: 'Please enter your date of birth.',
};
const isAlreadySignup = ref<boolean>(false);

const changeToSignUp = () => {
  signUpErrorResponse.value = null;
  username.value = '';
  password.value = '';
  checkField.value = {
    testPass: true,
    confirmPassword: true,
    password: true,
    firstname: true,
    lastname: true,
    email: true,
    phone: true,
    username: true,
    gender: true,
    role: true,
    birthday: true,
  };
  signupData.value = {
    firstname: '',
    lastname: '',
    username: '',
    gender: '',
    email: '',
    phone: '',
    image: 'test.png',
    role: '',
    birthday: '',
    password: '',
  };
  isSignup.value = !isSignup.value;
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const decodeToken = (token: any): any => {
  const arrayToken = token.split('.');
  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  return tokenPayload;
};

const selectRole = (role: string) => {
  selectedRole.value = role;
};

const checkPasswordPattern = () => {
  const hasUppercase = /[A-Z]/.test(password.value);
  const hasLowercase = /[a-z]/.test(password.value);
  const hasNumber = /[0-9]/.test(password.value);
  const hasSpecialChar = /[@#$%^&+=.*!]/.test(password.value);
  const isMinLength = password.value.length >= 8;

  if (hasUppercase) {
    patternCheck.value['uppercase'] = true;
  } else {
    patternCheck.value['uppercase'] = false;
  }
  if (hasLowercase) {
    patternCheck.value['lowercase'] = true;
  } else {
    patternCheck.value['lowercase'] = false;
  }
  if (hasNumber) {
    patternCheck.value['number'] = true;
  } else {
    patternCheck.value['number'] = false;
  }
  if (hasSpecialChar) {
    patternCheck.value['specialChar'] = true;
  } else {
    patternCheck.value['specialChar'] = false;
  }
  if (isMinLength) {
    patternCheck.value['minLength'] = true;
  } else {
    patternCheck.value['minLength'] = false;
  }

  if (
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar &&
    isMinLength
  ) {
    allPatternCheck.value = true;
  } else {
    allPatternCheck.value = false;
  }
};

const triggerShake = () => {
  shouldShake.value = true;
  setTimeout(() => {
    shouldShake.value = false;
  }, 500);
};

const validateFields = () => {
  const fieldsToCheck = {
    testPass:
      allPatternCheck.value &&
      password.value?.trim() === confirmPassword.value?.trim(),
    confirmPassword: confirmPassword.value?.trim(),
    password: password.value?.trim(),
    firstname: signupData.value?.firstname?.trim(),
    lastname: signupData.value?.lastname?.trim(),
    email: signupData.value?.email?.trim(),
    phone: signupData.value?.phone?.trim(),
    username: signupData.value?.username?.trim(),
    gender: signupData.value?.gender?.trim(),
    role: signupData.value?.role?.trim(),
    birthday: signupData.value?.birthday?.trim(),
  };

  Object.entries(fieldsToCheck).forEach(([key, value]) => {
    checkField.value[key] = Boolean(value);
  });

  const hasError = Object.values(checkField.value).includes(false);

  if (hasError) {
    triggerShake();
  }

  return hasError;
};
const isUserSignIn = useState('isUserSignIn');
const isOTPPopup = useState('isOTPPopup');
const isSignInCookie = useCookie('is_user_sign_in');

const handleAuthen = async () => {};
const signUpErrorResponse = ref();
const userRegisHistory = useState('userRegisHistory');
const handleSignin = async () => {
  isClickSignBtn.value = true;
  isWaitAuthen.value = true;
  signupData.value.birthday = birthday.value;
  signupData.value.gender = selectedGender.value;
  signupData.value.username = username.value;
  signupData.value.password = password.value;
  signupData.value.role = selectedRole.value;
  validateFields();

  if (!isSignup.value) {
    loginStatus.value = true;
    // Sign in
    if (username.value.length !== 0 && password.value.length !== 0) {
      const dataSend = {
        username: username.value,
        password: password.value,
      };

      const fetchedData = await useFetchData(`v1/login`, 'POST', dataSend);

      if (fetchedData.status === 200) {
        isWaitAuthen.value = false;

        const accessToken = useCookie('accessToken', {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60,
        });

        accessToken.value = fetchedData.data.accessToken;

        const refreshToken = useCookie('refreshToken', {
          httpOnly: false,
          maxAge: 60 * 60 * 24 * 7,
        });
        refreshToken.value = fetchedData.data.refreshToken;

        role.value = decodeToken(accessToken.value)?.role;
        const roleCookie = useCookie('roleCookie', {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60,
        });

        roleCookie.value = decodeToken(accessToken.value)?.role;

        const profileData = useCookie('profileData', {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60,
        });
        if (fetchedData.data.accessToken) {
          const userProfileData = await useFetchWithAuth(
            'v1/profile',
            'GET',
            fetchedData.data.accessToken
          );
          profileData.value = userProfileData.data;
        }

        if (roleCookie.value === 'Attendee') {
          router.push('/');
        } else {
          router.push('/backoffice');
        }

        const regisData = await useFetchWithAuth(
          'v1/tickets',
          'GET',
          accessToken.value
        );
        userRegisHistory.value = regisData.data;

        loginPopup.value = false;
        isHavePopupOpen.value = false;
        isUserSignIn.value = true;
        isSignInCookie.value = 'yes';
      } else {
        loginStatus.value = false;
        isWaitAuthen.value = false;
        isClickSignBtn.value = false;
        console.error('Tokens not received from server');
      }
    } else {
      isWaitAuthen.value = false;
    }
  } else if (isSignup.value) {
    signUpErrorResponse.value = null;
    if (!validateFields()) {
      signupData.value.birthday = birthday.value + 'T00:00:00';
      const response = await useFetchData(
        'v1/signup',
        'POST',
        signupData.value
      );
      if (response.errorData) {
        isWaitAuthen.value = false;
        signUpErrorResponse.value = response.errorData;
      }
      if (!response.errorData) {
        localStorage.setItem('email', signupData.value.email);
        // loginPopup.value = !loginPopup.value;
        isWaitAuthen.value = false;
        signupData.value = {
          firstname: '',
          lastname: '',
          username: '',
          gender: '',
          email: '',
          phone: '',
          image: 'test.png',
          role: '',
          birthday: '',
          password: '',
        };
        // changeToSignUp();
        password.value = '';
        username.value = '';
        isAlreadySignup.value = true;
        // isUserSignIn.value = true
        isOTPPopup.value = true;
        loginPopup.value = false;
        isHavePopupOpen.value = false;
      }
    } else {
      isWaitAuthen.value = false;
    }
  }
};
const handleLoginPopup = () => {
  isHavePopupOpen.value = false;
  if (isSignup.value) {
    signupData.value = {
      firstname: '',
      lastname: '',
      username: '',
      gender: '',
      email: '',
      phone: '',
      image: 'test.png',
      role: '',
      birthday: '',
      password: '',
    };
  } else {
    username.value = '';
    password.value = '';
    loginStatus.value = true;
  }
  checkField.value = {
    testPass: true,
    confirmPassword: true,
    password: true,
    firstname: true,
    lastname: true,
    email: true,
    phone: true,
    username: true,
    gender: true,
    role: true,
    birthday: true,
  };
  loginPopup.value = !loginPopup.value;
};
watch(
  password,
  (newPassword) => {
    if (newPassword) {
      checkPasswordPattern();
    }
  },
  { immediate: true }
);

interface CredentialResponse {
  credential: string;
  select_by: string;
}
const userCredential = ref<string | null>(null);
</script>

<template>
  <CompleteModal
    :isShowCompleteModal="state.isVisible"
    :title="state.text"
    @complete-action="handleCompleteGGSignUp"
  />
  <div v-if="loginPopup" class="fixed z-50 h-screen w-full">
    <div
      v-on-click-outside="handleLoginPopup"
      :class="{ 'animate-shake': shouldShake }"
      class="absolute left-1/2 top-1/2 z-50 flex min-w-[420px] -translate-x-1/2 -translate-y-2/3 flex-col gap-4 rounded-xl bg-white p-10 shadow-lg"
    >
      <div v-if="!isSignup" class="text-center">
        <p class="t3">Welcome!</p>
        <p :class="isAlreadySignup ? 'b1 text-green-600' : 'b1 text-gray-600'">
          {{
            isAlreadySignup
              ? 'Sign up successful! Please log in to continue.'
              : 'Please enter your details to sign in.'
          }}
        </p>
      </div>
      <div v-else class="text-center">
        <p class="t3 text-center">Create an account!</p>
        <p class="b1 text-gray-600">Sign up and join with us.</p>
      </div>
      <div class="b3 text-red-600" v-if="signUpErrorResponse">
        <p
          v-for="er in signUpErrorResponse.details"
          class="flex items-center gap-1"
        >
          <Cancle /> {{ er }}
        </p>
      </div>
      <!-- <button
        @click="signInGG()"
        id="google-login-button"
        class="custom-google-btn"
      >
        Login with Google
      </button> -->

      <!-- <div class="flex w-full justify-between gap-3">
        <button
          class="flex h-10 w-full items-center justify-center rounded-lg border-[1px] border-black/20"
        >
          A
        </button>
        <button
          class="flex h-10 w-full items-center justify-center rounded-lg border-[1px] border-black/20"
        >
          B
        </button>
        <button
          class="flex h-10 w-full items-center justify-center rounded-lg border-[1px] border-black/20"
        >
          C
        </button>
      </div>

      <div class="flex w-full gap-2">
        <div
          class="w-full -translate-y-1/2 border-b-[1px] border-b-black/20"
        ></div>
        <p class="b3 text-black/60">OR</p>
        <div
          class="w-full -translate-y-1/2 border-b-[1px] border-b-black/20"
        ></div>
      </div> -->

      <div class="flex flex-col gap-3">
        <div class="flex gap-3">
          <div class="w-full">
            <input
              v-if="isSignup"
              type="text"
              v-model="signupData.firstname"
              placeholder="First name"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
            <p
              v-if="!checkField['firstname'] && isClickSignBtn && isSignup"
              class="b4 text-red-600"
            >
              {{ fieldErrorMessages['firstname'] }}
            </p>
          </div>
          <div class="w-full">
            <input
              v-if="isSignup"
              type="text"
              v-model="signupData.lastname"
              placeholder="Last name"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
            <p
              v-if="!checkField['lastname'] && isClickSignBtn && isSignup"
              class="b4 text-red-600"
            >
              {{ fieldErrorMessages['lastname'] }}
            </p>
          </div>
        </div>
        <input
          v-if="isSignup"
          type="text"
          v-model="signupData.email"
          placeholder="Email"
          class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
        />
        <p
          v-if="!checkField['email'] && isClickSignBtn && isSignup"
          class="b4 text-red-600"
        >
          {{ fieldErrorMessages['email'] }}
        </p>
        <input
          v-if="isSignup"
          type="text"
          v-model="signupData.phone"
          placeholder="Phone"
          class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
        />
        <p
          v-if="!checkField['phone'] && isClickSignBtn && isSignup"
          class="b4 text-red-600"
        >
          {{ fieldErrorMessages['phone'] }}
        </p>
        <div>
          <p v-if="!isSignup" class="b2 font pb-1 font-semibold">
            Username or Email
          </p>
          <input
            type="text"
            :placeholder="!isSignup ? 'Username or Email' : 'Username'"
            v-model="username"
            class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
          />
          <p
            v-if="!checkField['username'] && isClickSignBtn"
            class="b4 text-red-600"
          >
            {{ fieldErrorMessages['username'] }}
          </p>
        </div>
        <div>
          <p v-if="!isSignup" class="b2 font pb-1 font-semibold">Password</p>
          <div class="relative">
            <input
              @keypress.enter="handleSignin"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Enter your password"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-xl"
            >
              <HidePassword v-if="showPassword" />
              <ShowPassword v-else />
            </button>
          </div>
          <div v-if="!loginStatus && !isSignup" class="b4 text-red-500">
            wrong username or password
          </div>
          <div v-if="password.length > 0 && isSignup" class="b4">
            <div
              class="flex items-center"
              :class="
                patternCheck['minLength'] ? 'text-green-700' : 'text-red-500'
              "
            >
              <Check v-if="patternCheck['minLength']" /><Cancle v-else /> At
              least 8 characters
            </div>
            <div
              class="flex items-center"
              :class="
                patternCheck['uppercase'] ? 'text-green-700' : 'text-red-500'
              "
            >
              <Check v-if="patternCheck['uppercase']" /><Cancle v-else />At
              least one uppercase letter (A–Z)
            </div>
            <div
              class="flex items-center"
              :class="
                patternCheck['lowercase'] ? 'text-green-700' : 'text-red-500'
              "
            >
              <Check v-if="patternCheck['lowercase']" /><Cancle v-else />At
              least one lowercase letter (a–z)
            </div>
            <div
              class="flex items-center"
              :class="
                patternCheck['number'] ? 'text-green-700' : 'text-red-500'
              "
            >
              <Check v-if="patternCheck['number']" /><Cancle v-else />At least
              one number (0–9)
            </div>
            <div
              class="flex items-center"
              :class="
                patternCheck['specialChar'] ? 'text-green-700' : 'text-red-500'
              "
            >
              <Check v-if="patternCheck['specialChar']" /><Cancle v-else />At
              least one special character (@, #, $, %, ^, &, +, =, ., *, etc.)
            </div>
          </div>
          <p
            v-if="!checkField['password'] && isClickSignBtn"
            class="b4 text-red-600"
          >
            {{ fieldErrorMessages['password'] }}
          </p>
          <p
            v-if="
              !checkField['testPass'] &&
              isClickSignBtn &&
              isSignup &&
              password.length > 0
            "
            class="b4 text-red-600"
          >
            {{ fieldErrorMessages['testPass'] }}
          </p>
        </div>
        <div v-if="isSignup">
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="Confirm your password"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-xl"
            >
              <HidePassword v-if="showPassword" />
              <ShowPassword v-else />
            </button>
          </div>
          <p
            v-if="!checkField['confirmPassword'] && isClickSignBtn && isSignup"
            class="b4 text-red-600"
          >
            {{ fieldErrorMessages['confirmPassword'] }}
          </p>
          <p
            v-if="
              !checkField['testPass'] &&
              isClickSignBtn &&
              isSignup &&
              confirmPassword.length > 0
            "
            class="b4 text-red-600"
          >
            {{ fieldErrorMessages['testPass'] }}
          </p>
        </div>
        <div class="flex gap-2" v-if="isSignup">
          <div class="w-full">
            <select
              id="gender"
              v-model="selectedGender"
              class="b2 rounded-lg border-[1px] border-black/20 p-2"
            >
              <option disabled value="">Please select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            <p
              v-if="!checkField['gender'] && isClickSignBtn && isSignup"
              class="b4 text-red-600"
            >
              {{ fieldErrorMessages['gender'] }}
            </p>
          </div>
          <div class="w-full">
            <input
              id="birthday"
              type="date"
              v-model="birthday"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
            <p
              v-if="!checkField['birthday'] && isClickSignBtn && isSignup"
              class="b4 text-red-600"
            >
              {{ fieldErrorMessages['birthday'] }}
            </p>
          </div>
        </div>
        <div v-if="isSignup" class="b2">
          <p class="b2 pb-2 text-center">What would you like to do?</p>
          <div class="flex w-full justify-between gap-2">
            <button
              @click="selectRole('Attendee')"
              class="group relative flex w-full items-center justify-center rounded-lg p-2 py-10"
              :class="
                selectedRole === 'Attendee'
                  ? 'border-[2px] border-burgundy'
                  : 'border-[1px] border-black/20'
              "
            >
              <div
                class="absolute bg-white text-center opacity-0 duration-500 group-hover:opacity-100"
              >
                For users who want to explore and join existing events.
              </div>
              <p class="font-semibold">Join Event</p>
            </button>
            <button
              @click="selectRole('Organization')"
              class="group relative flex w-full items-center justify-center rounded-lg p-2 py-10"
              :class="
                selectedRole === 'Organization'
                  ? 'border-[2px] border-burgundy'
                  : 'border-[1px] border-black/20'
              "
            >
              <div
                class="absolute bg-white text-center opacity-0 duration-500 group-hover:opacity-100"
              >
                For users who want to create and manage their own events.
              </div>
              <p class="font-semibold">Create event</p>
            </button>
          </div>
          <p
            v-if="!checkField['role'] && isClickSignBtn && isSignup"
            class="b4 text-red-600"
          >
            {{ fieldErrorMessages['role'] }}
          </p>
        </div>
      </div>

      <div v-if="!isSignup" class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <input type="checkbox" />
          <p class="b2">Remember me</p>
        </div>
        <p class="b2 underline">Forgot password?</p>
      </div>
      <button
        @click="handleSignin"
        class="b1 flex w-full items-center justify-center rounded-lg bg-dark-grey py-2 text-white"
      >
        <p>{{ isSignup ? 'Sign Up' : 'Sign in now' }}</p>

        <div :class="isWaitAuthen ? 'load ml-3 w-4' : ''"></div>
      </button>

      <!-- <div class="flex w-full justify-between gap-3">
        <button
          class="flex h-10 w-full items-center justify-center rounded-lg border-[1px] border-black/20"
        >
          A
        </button>
        <button
          class="flex h-10 w-full items-center justify-center rounded-lg border-[1px] border-black/20"
        >
          B
        </button>
        <button
          class="flex h-10 w-full items-center justify-center rounded-lg border-[1px] border-black/20"
        >
          C
        </button>
      </div>-->

      <div class="flex w-full gap-2">
        <div
          class="w-full -translate-y-1/2 border-b-[1px] border-b-black/20"
        ></div>
        <p class="b3 text-black/60">OR</p>
        <div
          class="w-full -translate-y-1/2 border-b-[1px] border-b-black/20"
        ></div>
      </div>
      <div class="group relative h-full w-full">
        <GoogleSignInButton
          width="340px"
          ux_mode="redirect"
          class="b3 absolute right-0 w-max opacity-0"
          @success="handleLoginSuccesses"
          @error="handleLoginErrores"
        ></GoogleSignInButton>
        <button
          class="b2 pointer-events-none flex w-full items-center justify-center gap-3 rounded-lg border-[1px] border-dark-grey/70 py-2 text-dark-grey transition duration-300 hover:bg-gray-800 group-hover:border-blue-700"
        >
          <Google class="fill-white" />
          Continue with Google
        </button>
      </div>
      <div>
        <p class="b2 text-center">
          {{ isSignup ? 'Already' : 'Don’t' }} have an account?
          <button class="font-semibold" @click="changeToSignUp">
            {{ isSignup ? 'Sign In' : 'Sign Up' }}
          </button>
        </p>
      </div>

      <p v-if="userCredential" class="mt-4 text-sm text-green-600">
        Login Success! Token: {{ userCredential }}
      </p>
    </div>
  </div>
  <div v-if="isSelectRolePopUp" class="fixed z-50 h-screen w-full">
    <div
      class="b2 absolute left-1/2 top-1/2 z-50 flex min-w-[420px] -translate-x-1/2 -translate-y-2/3 flex-col items-center justify-center gap-4 rounded-xl bg-white p-10 shadow-lg"
    >
      <p class="b2 text-center">Please select your role before continue</p>
      <p class="b2 pb-2 text-center">What would you like to do?</p>
      <div class="flex w-full justify-between gap-2">
        <button
          @click="selectRole('Attendee')"
          class="group relative flex w-full items-center justify-center rounded-lg p-2 py-10"
          :class="
            selectedRole === 'Attendee'
              ? 'border-[2px] border-burgundy'
              : 'border-[1px] border-black/20'
          "
        >
          <div
            class="b3 absolute bg-white p-2 text-center opacity-0 duration-500 group-hover:opacity-100"
          >
            For users who want to explore and join existing events.
          </div>
          <p class="font-semibold">Join Event</p>
        </button>
        <button
          @click="selectRole('Organization')"
          class="group relative flex w-full items-center justify-center rounded-lg p-2 py-10"
          :class="
            selectedRole === 'Organization'
              ? 'border-[2px] border-burgundy'
              : 'border-[1px] border-black/20'
          "
        >
          <div
            class="b3 absolute bg-white p-2 text-center opacity-0 duration-500 group-hover:opacity-100"
          >
            For users who want to create and manage their own events.
          </div>
          <p class="font-semibold">Create event</p>
        </button>
      </div>
      <BtnComp color="black" @click="handleSelectRole" text="submit" />
      <p
        v-if="!checkField['role'] && isClickSignBtn && isSignup"
        class="b4 text-red-600"
      >
        {{ fieldErrorMessages['role'] }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.custom-google-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-google-btn:hover {
  background-color: #357ae8;
}
</style>
