<script setup lang="ts">
import { useRuntimeConfig } from '#app';
const loginPopup = useLoginPopup();
const isUserSignIn = useIsUserSignIn();
const isSignup = ref(false);

function closePopup() {
  loginPopup.value = false;
}

const changeToSignUp = () => {
  isSignup.value = !isSignup.value;
};
const selectedGender = ref('female');
const birthday = ref();
const genderList = ['Male', 'Female', 'Other', 'Prefer not to say'];

const username = ref('');
const password = ref('');

const useFetch = async (url: string, method: string, body: object) => {
  const config = useRuntimeConfig();
  try {
    const response = await fetch(`${config.public.baseUrl}/api/v1/${url}`, {
      method: `${method}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Error fetching`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch data' };
  }
};
const userProfile = useUserProfile();
// const useFetchWithAuth = async (
//   url: string,
//   method: string,
//   token: any,
//   body?: object
// ) => {
//   // const token = 'your-access-token'; // เปลี่ยนเป็น token ของคุณ
//   const config = useRuntimeConfig();
//   try {
//     const response = await fetch(`${config.public.baseUrl}/api/v1/${url}`, {
//       method: method, // เช่น 'GET', 'POST', 'PUT', 'DELETE'
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`, // ใส่ Bearer token ใน header
//       },
//       body: body ? JSON.stringify(body) : undefined, // ใส่ body เฉพาะเมื่อมีค่า
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return { error: 'Failed to fetch data' };
//   }
// };

const handleSignin = async () => {
  if (username.value.length !== 0 && password.value.length !== 0) {
    const dataSend = {
      username: username.value,
      password: password.value,
    };

    console.log('Sending Data:', dataSend);

    const fetchedData = await useFetch(`login`, 'POST', dataSend);
    console.log('Fetched Data:', fetchedData);

    if (fetchedData.accessToken && fetchedData.refreshToken) {
      const accessCookie = useCookie('accessToken', {
        httpOnly: false, // Debugging Phase
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
      });
      accessCookie.value = fetchedData.accessToken;

      const refreshCookie = useCookie('refreshToken', {
        httpOnly: false, // Debugging Phase
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
      });
      refreshCookie.value = fetchedData.refreshToken;
      const userProfileData = await useFetchWithAuth(
        'profile',
        'GET',
        accessCookie.value
      );
      userProfile.value = userProfileData;
      console.log(userProfile.value);

      console.log('Access Token:', accessCookie.value);
    } else {
      console.error('Tokens not received from server');
    }

    loginPopup.value = false;
  }
};
</script>

<template>
  <div v-if="loginPopup" class="fixed z-50 h-screen w-full bg-black/20">
    <div
      class="absolute left-1/2 top-1/2 z-50 flex min-w-[420px] -translate-x-1/2 -translate-y-2/3 flex-col gap-4 rounded-xl bg-white p-10 shadow-lg"
    >
      <div v-if="!isSignup" class="text-center">
        <p class="t3">Welcome!</p>
        <p class="b1 text-gray-600">Please enter your details to sign in.</p>
      </div>
      <div v-else class="text-center">
        <p class="t3 text-center">Create an account!</p>
        <p class="b1 text-gray-600">Sign up and join with us.</p>
      </div>

      <div class="flex w-full justify-between gap-3">
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
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex gap-3">
          <input
            v-if="isSignup"
            type="text"
            placeholder="First name"
            class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
          />
          <input
            v-if="isSignup"
            type="text"
            placeholder="Last name"
            class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
          />
        </div>
        <input
          v-if="isSignup"
          type="text"
          placeholder="Email"
          class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
        />
        <div>
          <p v-if="!isSignup" class="b2 font pb-1 font-semibold">Username</p>
          <input
            type="text"
            placeholder="Username"
            v-model="username"
            class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
          />
          {{ username }}
        </div>
        <div>
          <p v-if="!isSignup" class="b2 font pb-1 font-semibold">Password</p>
          <input
            type="password"
            v-model="password"
            placeholder="Enter your password"
            class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
          />
          {{ password }}
        </div>

        <div class="flex gap-2" v-if="isSignup">
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
          <input
            id="birthday"
            type="date"
            v-model="birthday"
            class="b2 rounded-lg border-[1px] border-black/20 p-2"
          />
        </div>
        <div v-if="isSignup" class="b2">
          <p class="b2 pb-2 text-center">What would you like to do?</p>
          <div class="flex w-full justify-between gap-2">
            <button
              class="group relative flex w-full items-center justify-center rounded-lg border-[1px] border-black/20 p-2 py-10"
            >
              <div
                class="absolute bg-white text-center opacity-0 duration-500 group-hover:opacity-100"
              >
                For users who want to explore and join existing events.
              </div>
              <p class="font-semibold">Join Event</p>
            </button>
            <button
              class="group relative flex w-full items-center justify-center rounded-lg border-[1px] border-black/20 p-2 py-10"
            >
              <div
                class="absolute bg-white text-center opacity-0 duration-500 group-hover:opacity-100"
              >
                For users who want to create and manage their own events.
              </div>
              <p class="font-semibold">Create event</p>
            </button>
          </div>
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
        class="b1 w-full rounded-lg bg-dark-grey py-2 text-white"
      >
        {{ isSignup ? 'Sign Up' : 'Sign in now' }}
      </button>

      <p class="b2 text-center">
        {{ isSignup ? 'Already' : 'Don’t' }} have an account?
        <button class="font-semibold" @click="changeToSignUp">
          {{ isSignup ? 'Sign In' : 'Sign Up' }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
