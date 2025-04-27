<script setup lang="ts">
import {
  GoogleSignInButton,
  type CredentialResponse,
} from 'vue3-google-signin';
import * as jose from 'jose';
import type { StepperItem } from '@nuxt/ui';
const credentials = ref<string | null>(null);

const handleLoginSuccesses = async (response: CredentialResponse) => {
  const { credential } = response;
  credentials.value = credential;
  await signInWithGoogle();
};

const handleLoginErrores = () => {
  console.error('Login failed');
};

const decodeToken = (token: any): any => {
  const payload = jose.decodeJwt(token);

  return payload;
};
const isTokenExpired = (token: string) => {
  try {
    const payload = decodeToken(token);

    const exp = payload.exp * 1000;
    return Date.now() > exp;
  } catch (e) {
    console.error('Failed to decode JWT:', e);
    return true;
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
  }
};
const signInWithGoogle = async () => {
  if (credentials.value && !isTokenExpired(credentials.value)) {
    const response = await useFetchWithAuth(
      'v1/login/google',
      'POST',
      credentials.value
    );

    if (response.status !== 200) {
      isSelectRolePopUp.value = !isSelectRolePopUp.value;
    } else {
      const accessToken = useCookie('accessToken', {
        httpOnly: false,
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
      });
      if ('data' in response) accessToken.value = response.data.accessToken;

      const refreshToken = useCookie('refreshToken', {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
      });
      if ('data' in response) refreshToken.value = response.data.refreshToken;

      const roleCookie = useCookie('roleCookie', {
        httpOnly: false,
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
      });

      roleCookie.value = decodeToken(accessToken.value)?.role;

      const profileData = useCookie('profileData', {
        httpOnly: false,
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
      });
      if ('data' in response) {
        if (response.data.accessToken) {
          const userProfileData = await useFetchWithAuth(
            'v1/profile',
            'GET',
            response.data.accessToken
          );
          if ('data' in userProfileData) {
            profileData.value = userProfileData.data;
          }
        }
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
      if ('data' in regisData) {
        userRegisHistory.value = regisData.data;
      }
    }
    loginPopup.value = !loginPopup.value;
    isHavePopupOpen.value = false;
  } else {
  }
};

const loginPopup = useState('loginPopup');
const isHavePopupOpen = useState('isHavePopupOpen');
const isSignup = useState('isSignup');
const confirmPassword = ref('');
const showPassword = ref(false);
const selectedGender = ref('female');
const birthday = ref();
const username = ref('');
const password = ref('');
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

  if (hasError && isSignup.value) {
    triggerShake();
  }

  return hasError;
};
const isUserSignIn = useState('isUserSignIn');
const isOTPPopup = useState('isOTPPopup');
const isSignInCookie = useCookie('is_user_sign_in');

const signUpErrorResponse = ref();
const userRegisHistory = useState('userRegisHistory');

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
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

      const fetchedData = await useFetchData<LoginResponse>(
        `v1/login`,
        'POST',
        dataSend
      );

      if (fetchedData.status === 200) {
        isWaitAuthen.value = false;

        const accessToken = useCookie('accessToken', {
          httpOnly: false,
          // secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60,
        });

        accessToken.value = fetchedData.data.accessToken;

        const refreshToken = useCookie('refreshToken', {
          httpOnly: false,
          maxAge: 60 * 60 * 24 * 7,
        });
        refreshToken.value = fetchedData.data.refreshToken;

        // role.value = decodeToken(accessToken.value)?.role;
        const roleCookie = useCookie('roleCookie', {
          httpOnly: false,
          // secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60,
        });

        roleCookie.value = decodeToken(accessToken.value)?.role;

        const profileData = useCookie('profileData', {
          httpOnly: false,
          // secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60,
        });
        if (fetchedData.data.accessToken) {
          const userProfileData = await useFetchWithAuth(
            'v1/profile',
            'GET',
            fetchedData.data.accessToken
          );
          if ('data' in userProfileData) {
            profileData.value = userProfileData.data;
          }
        }

        if (roleCookie.value === 'Attendee') {
          // router.push('/');
        } else {
          router.push('/backoffice');
        }

        const regisData = await useFetchWithAuth(
          'v1/tickets',
          'GET',
          accessToken.value
        );
        if ('data' in regisData) {
          userRegisHistory.value = regisData.data;
        }

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
      if ('errorData' in response) {
        isWaitAuthen.value = false;
        signUpErrorResponse.value = response.errorData;
      }
      if (!('errorData' in response)) {
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
        // isUserSignIn.value = true

        isOTPPopup.value = true;

        localStorage.setItem('isOTPPopup', 'true');
        isAlreadySignup.value = true;
        loginPopup.value = false;
        isHavePopupOpen.value = false;
      }
    } else {
      signUpIndex.value = 0;
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
  isSignup.value = false;
  signUpIndex.value = 0;
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

const signUpIndex = ref(0);

const handleSignUpIndex = (action: string) => {
  if (action === 'prev') {
    signUpIndex.value -= 1;
  } else {
    signUpIndex.value += 1;
  }
};
// const stepper = useTemplateRef('stepper')
const items: StepperItem[] = [
  {
    title: 'Address',
    description: 'Add your address here',
    icon: 'i-lucide-house',
  },
  {
    title: 'Shipping',
    description: 'Set your preferred shipping method',
    icon: 'i-lucide-truck',
  },
  {
    title: 'Checkout',
    description: 'Confirm your order',
  },
];
</script>

<template>
  <CompleteModal
    :isShowCompleteModal="state.isVisible"
    :title="state.text"
    @complete-action="handleCompleteGGSignUp"
  />
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-y-[500px] opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-[500px] opacity-0"
  >
    <div v-show="loginPopup && !isSignup" class="fixed z-50 h-screen w-full">
      <div
        :class="`${shouldShake ? 'animate-shake' : ''} ${isSignup ? 'top-1/2 -translate-y-1/2' : 'top-1/2 -translate-y-1/2'}`"
        class="absolute left-1/2 z-50 flex min-w-[300px] -translate-x-1/2 justify-center gap-10 rounded-xl bg-white p-5 shadow-lg lg:min-w-[320px] lg:p-10"
      >
        <div class="flex flex-col gap-2 lg:gap-4">
          <button @click="handleLoginPopup" class="absolute right-5 top-5">
            <Cancle />
          </button>
          <div v-if="!isSignup" class="text-center">
            <p class="t3">Welcome!</p>
            <p
              :class="
                isAlreadySignup ? 'b1 text-green-600' : 'b1 text-gray-600'
              "
            >
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

          <div class="flex flex-col gap-3">
            <div class="flex gap-3">
              <div class="w-full">
                <input
                  v-if="isSignup"
                  type="text"
                  v-model="signupData.firstname"
                  placeholder="First name"
                  class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
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
                  class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
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
              class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
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
              class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
            <p
              v-if="!checkField['phone'] && isClickSignBtn && isSignup"
              class="b4 text-red-600"
            >
              {{ fieldErrorMessages['phone'] }}
            </p>
            <div>
              <p v-if="!isSignup" class="b3 font pb-1 font-semibold">
                Username or Email
              </p>
              <input
                type="text"
                :placeholder="!isSignup ? 'Username or Email' : 'Username'"
                v-model="username"
                class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
              />
              <p
                v-if="!checkField['username'] && isClickSignBtn"
                class="b4 text-red-600"
              >
                {{ fieldErrorMessages['username'] }}
              </p>
            </div>
            <div>
              <p v-if="!isSignup" class="b3 font pb-1 font-semibold">
                Password
              </p>
              <div class="relative">
                <input
                  @keypress.enter="handleSignin"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Enter your password"
                  class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
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
                    patternCheck['minLength']
                      ? 'text-green-700'
                      : 'text-red-500'
                  "
                >
                  <Check v-if="patternCheck['minLength']" /><Cancle v-else /> At
                  least 8 characters
                </div>
                <div
                  class="flex items-center"
                  :class="
                    patternCheck['uppercase']
                      ? 'text-green-700'
                      : 'text-red-500'
                  "
                >
                  <Check v-if="patternCheck['uppercase']" /><Cancle v-else />At
                  least one uppercase letter (A–Z)
                </div>
                <div
                  class="flex items-center"
                  :class="
                    patternCheck['lowercase']
                      ? 'text-green-700'
                      : 'text-red-500'
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
                  <Check v-if="patternCheck['number']" /><Cancle v-else />At
                  least one number (0–9)
                </div>
                <div
                  class="flex items-center"
                  :class="
                    patternCheck['specialChar']
                      ? 'text-green-700'
                      : 'text-red-500'
                  "
                >
                  <Check v-if="patternCheck['specialChar']" /><Cancle
                    v-else
                  />At least one special character (@, #, $, %, ^, &, +, =, .,
                  *, etc.)
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
                  class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
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
                v-if="
                  !checkField['confirmPassword'] && isClickSignBtn && isSignup
                "
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
                  class="b3 rounded-lg border-[1px] border-black/20 p-2"
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
                  class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
                />
                <p
                  v-if="!checkField['birthday'] && isClickSignBtn && isSignup"
                  class="b4 text-red-600"
                >
                  {{ fieldErrorMessages['birthday'] }}
                </p>
              </div>
            </div>
            <!-- <div v-if="isSignup" class="b3">
            <p class="b3 pb-2 text-center">What would you like to do?</p>
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
                @click="selectRole('Organizer')"
                class="group relative flex w-full items-center justify-center rounded-lg p-2 py-10"
                :class="
                  selectedRole === 'Organizer'
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
          </div> -->
          </div>

          <!-- <div v-if="!isSignup" class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <input type="checkbox" />
          <p class="b3">Remember me</p>
        </div>
        <p class="b3 underline">Forgot password?</p>
      </div> -->
          <button
            @click="handleSignin"
            class="b1 mt-2 flex w-full items-center justify-center rounded-lg bg-dark-grey py-2 text-white"
          >
            <p>{{ isSignup ? 'Sign Up' : 'Sign in now' }}</p>

            <div :class="isWaitAuthen ? 'load ml-3 w-4' : ''"></div>
          </button>

          <div v-if="!isSignup" class="flex w-full gap-2">
            <div
              class="w-full -translate-y-1/2 border-b-[1px] border-b-black/20"
            ></div>
            <p class="b3 text-black/60">OR</p>
            <div
              class="w-full -translate-y-1/2 border-b-[1px] border-b-black/20"
            ></div>
          </div>

          <!--           
          <div v-if="!isSignup" class="h-full w-full">
            <GoogleSignInButton
              width="300"
              ux_mode="redirect"
              class="flex min-w-full items-center justify-center"
              @success="handleLoginSuccesses"
              @error="handleLoginErrores"
            ></GoogleSignInButton>
          </div> -->
          <div v-if="!isSignup" class="relative h-full w-full">
            <GoogleSignInButton
              width="300"
              ux_mode="redirect"
              class="absolute left-0 top-0 z-10 flex min-w-full items-center justify-center opacity-0"
              @success="handleLoginSuccesses"
              @error="handleLoginErrores"
            />
            <button
              class="b3 pointer-events-none flex w-full items-center justify-center gap-3 rounded-lg border-[1px] border-dark-grey/70 py-2 text-dark-grey transition duration-300 hover:bg-gray-800 group-hover:border-burgundy"
            >
              <Google class="fill-white" />
              Continue with Google
            </button>
          </div>

          <div>
            <p class="b3 text-center">
              {{ isSignup ? 'Already' : 'Don’t' }} have an account?
              <button class="font-semibold" @click="changeToSignUp">
                {{ isSignup ? 'Sign In' : 'Sign Up' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-y-[500px] opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-[500px] opacity-0"
  >
    <div>
      <div v-show="loginPopup && isSignup" class="fixed z-50 h-screen w-full">
        <div
          :class="`${shouldShake ? 'animate-shake' : ''} ${isSignup ? 'top-1/2 -translate-y-1/2' : 'top-1/2 -translate-y-1/2'}`"
          class="absolute left-1/2 z-50 flex -translate-x-1/2 flex-col lg:flex-row"
        >
          <div
            class="flex flex-col items-center justify-center rounded-t-xl bg-dark py-3 lg:rounded-l-xl lg:px-24"
          >
            <button
              class="league-gothic text-xl uppercase text-red-800 lg:text-4xl"
            >
              Gatherfy
            </button>
            <div class="w-full text-center text-light-grey">
              <p class="b1 font-semibold">Create an account!</p>
              <p class="b3">Sign up and join us.</p>
            </div>
          </div>
          <div
            class="jus flex min-w-[300px] flex-col items-center gap-6 rounded-b-xl bg-white p-5 shadow-lg lg:w-[550px] lg:min-w-[320px] lg:rounded-r-xl lg:p-10"
          >
            <button @click="handleLoginPopup" class="absolute right-5 top-5">
              <Cancle />
            </button>
            <div class="bottom-2 right-5 flex gap-2">
              <button
                @click="signUpIndex = 0"
                :class="
                  signUpIndex >= 0
                    ? 'bg-burgundy text-white'
                    : 'bg-light-grey text-dark'
                "
                class="b4 right-32 flex aspect-square w-6 shrink-0 items-center justify-center rounded-full"
              >
                1
              </button>
              <div
                :class="
                  signUpIndex >= 1 ? 'border-burgundy' : 'border-light-grey'
                "
                class="w-full min-w-[20px] translate-y-1/2 border-t-[2px]"
              ></div>
              <button
                @click="signUpIndex = 1"
                :class="
                  signUpIndex >= 1
                    ? 'bg-burgundy text-white'
                    : 'bg-light-grey text-dark'
                "
                class="b4 right-32 flex aspect-square w-6 shrink-0 items-center justify-center rounded-full"
              >
                2
              </button>
              <div
                :class="
                  signUpIndex >= 2 ? 'border-burgundy' : 'border-light-grey'
                "
                class="w-full min-w-[20px] translate-y-1/2 border-t-[2px]"
              ></div>
              <button
                @click="signUpIndex = 2"
                :class="
                  signUpIndex >= 2
                    ? 'bg-burgundy text-white'
                    : 'bg-light-grey text-dark'
                "
                class="b4 right-32 flex aspect-square w-6 shrink-0 items-center justify-center rounded-full"
              >
                3
              </button>
            </div>
            <div v-if="signUpIndex === 0" class="flex flex-col gap-4">
              <div class="b3 text-red-600" v-if="signUpErrorResponse">
                <p
                  v-for="er in signUpErrorResponse.details"
                  class="flex items-center gap-1"
                >
                  <Cancle /> {{ er }}
                </p>
              </div>

              <div class="flex flex-col gap-3">
                <div class="flex gap-3">
                  <div class="w-full">
                    <p class="b3 font pb-1 font-semibold">Firstname</p>
                    <input
                      v-if="isSignup"
                      type="text"
                      v-model="signupData.firstname"
                      placeholder="First name"
                      class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
                    />
                    <p
                      v-if="
                        !checkField['firstname'] && isClickSignBtn && isSignup
                      "
                      class="b4 text-red-600"
                    >
                      {{ fieldErrorMessages['firstname'] }}
                    </p>
                  </div>
                  <div class="w-full">
                    <p class="b3 font pb-1 font-semibold">Lastname</p>
                    <input
                      v-if="isSignup"
                      type="text"
                      v-model="signupData.lastname"
                      placeholder="Last name"
                      class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
                    />
                    <p
                      v-if="
                        !checkField['lastname'] && isClickSignBtn && isSignup
                      "
                      class="b4 text-red-600"
                    >
                      {{ fieldErrorMessages['lastname'] }}
                    </p>
                  </div>
                </div>
                <div>
                  <p class="b3 font pb-1 font-semibold">Email</p>

                  <input
                    v-if="isSignup"
                    type="text"
                    v-model="signupData.email"
                    placeholder="Email"
                    class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
                  />
                  <p
                    v-if="!checkField['email'] && isClickSignBtn && isSignup"
                    class="b4 text-red-600"
                  >
                    {{ fieldErrorMessages['email'] }}
                  </p>
                </div>
                <div>
                  <p class="b3 font pb-1 font-semibold">Phone</p>
                  <input
                    v-if="isSignup"
                    type="text"
                    v-model="signupData.phone"
                    placeholder="Phone"
                    class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
                  />
                  <p
                    v-if="!checkField['phone'] && isClickSignBtn && isSignup"
                    class="b4 text-red-600"
                  >
                    {{ fieldErrorMessages['phone'] }}
                  </p>
                </div>
                <div class="flex gap-2" v-if="isSignup">
                  <div class="w-full">
                    <p class="b3 font pb-1 font-semibold">Gender</p>
                    <select
                      id="gender"
                      v-model="selectedGender"
                      class="b3 rounded-lg border-[1px] border-black/20 p-2"
                    >
                      <option disabled value="">
                        Please select your gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                    <p
                      v-if="!checkField['gender'] && isClickSignBtn && isSignup"
                      class="b4 text-red-600"
                    >
                      {{ fieldErrorMessages['gender'] }}
                    </p>
                  </div>
                  <div class="w-full">
                    <p class="b3 font pb-1 font-semibold">Birthday</p>
                    <input
                      id="birthday"
                      type="date"
                      v-model="birthday"
                      class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
                    />
                    <p
                      v-if="
                        !checkField['birthday'] && isClickSignBtn && isSignup
                      "
                      class="b4 text-red-600"
                    >
                      {{ fieldErrorMessages['birthday'] }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="signUpIndex === 1" class="flex w-full flex-col gap-4">
              <div class="b3 text-red-600" v-if="signUpErrorResponse">
                <p
                  v-for="er in signUpErrorResponse.details"
                  class="flex items-center gap-1"
                >
                  <Cancle /> {{ er }}
                </p>
              </div>

              <div class="flex flex-col gap-3">
                <div>
                  <p class="b3 font pb-1 font-semibold">Username or Email</p>
                  <input
                    type="text"
                    :placeholder="!isSignup ? 'Username or Email' : 'Username'"
                    v-model="username"
                    class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
                  />
                  <p
                    v-if="!checkField['username'] && isClickSignBtn"
                    class="b4 text-red-600"
                  >
                    {{ fieldErrorMessages['username'] }}
                  </p>
                </div>
                <div>
                  <p class="b3 font pb-1 font-semibold">Password</p>
                  <div class="relative">
                    <input
                      @keypress.enter="handleSignin"
                      :type="showPassword ? 'text' : 'password'"
                      v-model="password"
                      placeholder="Enter your password"
                      class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
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
                        patternCheck['minLength']
                          ? 'text-green-700'
                          : 'text-red-500'
                      "
                    >
                      <Check v-if="patternCheck['minLength']" /><Cancle
                        v-else
                      />
                      At least 8 characters
                    </div>
                    <div
                      class="flex items-center"
                      :class="
                        patternCheck['uppercase']
                          ? 'text-green-700'
                          : 'text-red-500'
                      "
                    >
                      <Check v-if="patternCheck['uppercase']" /><Cancle
                        v-else
                      />At least one uppercase letter (A–Z)
                    </div>
                    <div
                      class="flex items-center"
                      :class="
                        patternCheck['lowercase']
                          ? 'text-green-700'
                          : 'text-red-500'
                      "
                    >
                      <Check v-if="patternCheck['lowercase']" /><Cancle
                        v-else
                      />At least one lowercase letter (a–z)
                    </div>
                    <div
                      class="flex items-center"
                      :class="
                        patternCheck['number']
                          ? 'text-green-700'
                          : 'text-red-500'
                      "
                    >
                      <Check v-if="patternCheck['number']" /><Cancle v-else />At
                      least one number (0–9)
                    </div>
                    <div
                      class="flex items-center"
                      :class="
                        patternCheck['specialChar']
                          ? 'text-green-700'
                          : 'text-red-500'
                      "
                    >
                      <Check v-if="patternCheck['specialChar']" /><Cancle
                        v-else
                      />At least one special character (@, #, $, %, ^, &, +, =,
                      ., *, etc.)
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
                  <p class="b3 font pb-1 font-semibold">Confirm password</p>
                  <div class="relative">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      v-model="confirmPassword"
                      placeholder="Confirm your password"
                      class="b3 w-full rounded-lg border-[1px] border-black/20 p-2"
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
                    v-if="
                      !checkField['confirmPassword'] &&
                      isClickSignBtn &&
                      isSignup
                    "
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
              </div>
            </div>
            <div
              v-if="signUpIndex === 2"
              class="b3 flex h-full w-full flex-col justify-between"
            >
              <div>
                <p class="b3 pb-2 text-center">What would you like to do?</p>
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
                    @click="selectRole('Organizer')"
                    class="group relative flex w-full items-center justify-center rounded-lg p-2 py-10"
                    :class="
                      selectedRole === 'Organizer'
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
              <di class="ite flex flex-col justify-end">
                <button
                  @click="handleSignin"
                  class="b1 mt-2 flex w-full items-center justify-center rounded-lg bg-dark-grey py-2 text-white"
                >
                  <p>{{ isSignup ? 'Sign Up' : 'Sign in now' }}</p>

                  <div :class="isWaitAuthen ? 'load ml-3 w-4' : ''"></div>
                </button>

                <div v-if="!isSignup" class="flex w-full gap-2">
                  <div
                    class="w-full -translate-y-1/2 border-b-[1px] border-b-black/20"
                  ></div>
                  <p class="b3 text-black/60">OR</p>
                  <div
                    class="w-full -translate-y-1/2 border-b-[1px] border-b-black/20"
                  ></div>
                </div>
                <div>
                  <p class="b3 text-center">
                    {{ isSignup ? 'Already' : 'Don’t' }} have an account?
                    <button class="font-semibold" @click="changeToSignUp">
                      {{ isSignup ? 'Sign In' : 'Sign Up' }}
                    </button>
                  </p>
                </div>
              </di>
            </div>
            <UStepper :items="items" class="w-full" />
            <div
              class="absolute bottom-2 right-2 flex gap-2 lg:bottom-5 lg:right-5"
            >
              <button
                v-show="signUpIndex !== 0"
                @click="handleSignUpIndex('prev')"
                class="b2 right-32 flex aspect-square w-7 shrink-0 items-center justify-center rounded-full bg-light-grey text-dark"
              >
                <Arrow />
              </button>
              <button
                v-show="signUpIndex !== 2"
                @click="handleSignUpIndex('next')"
                class="b2 right-32 flex aspect-square w-7 shrink-0 rotate-180 items-center justify-center rounded-full bg-light-grey text-dark"
              >
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <div v-if="isSelectRolePopUp" class="fixed z-50 h-screen w-full">
    <div
      class="b3 absolute left-1/2 top-1/2 z-50 flex min-w-[420px] -translate-x-1/2 -translate-y-2/3 flex-col items-center justify-center gap-4 rounded-xl bg-white p-10 shadow-lg"
    >
      <p class="b3 text-center">Please select your role before continue</p>
      <p class="b3 pb-2 text-center">What would you like to do?</p>
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
          @click="selectRole('Organizer')"
          class="group relative flex w-full items-center justify-center rounded-lg p-2 py-10"
          :class="
            selectedRole === 'Organizer'
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

<style scoped></style>
