<script setup lang="ts">
const loginPopup = useLoginPopup();

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
            class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
          />
        </div>
        <div>
          <p v-if="!isSignup" class="b2 font pb-1 font-semibold">Password</p>
          <input
            type="password"
            placeholder="Enter your password"
            class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
          />
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
      <button class="b1 w-full rounded-lg bg-dark-grey py-2 text-white">
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
