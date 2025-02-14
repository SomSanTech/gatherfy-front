<script setup lang="ts">
import Nav from './components/Nav.vue';
import { nextTick } from 'vue';

const loginPopup = useLoginPopup();
const isOTPPopup = useState('isOTPPopup');
const route = useRoute();
const role = useRole();
const isBackoffice = ref(route.fullPath.includes('backoffice'));
const isSignUpPage = ref(route.fullPath.includes('signup'));
const isSessionTimeOuts = useState('isSessionTimeOut');
const handleSessionExpire = useAuth().handleSessionExpire;
const refreshCookie = useCookie('refreshToken');
const isUserSignIn = useState('isUserSignIn');

watchEffect(async () => {
  if (!refreshCookie.value && isUserSignIn.value) {
    isSessionTimeOuts.value = true;
    await nextTick();
  }
});
</script>
<template>
  <div class="relative mx-auto w-full">
    <div
      :class="loginPopup ? 'absolute top-0 z-50 h-full w-full bg-black/20' : ''"
    ></div>
    <Nav
      v-if="!isBackoffice && !isSignUpPage && role !== 'Organization'"
      class="fixed top-0 z-40 w-full"
    />
    <Login />
    <OtpPopup />
    <div
      class="-translate-y-1/6 absolute left-1/2 top-0 z-50 flex min-w-[420px] -translate-x-1/2 flex-col gap-4 rounded-xl bg-white p-10 text-center shadow-lg"
      v-if="isSessionTimeOuts"
    >
      <p class="b1">Session expired pls sign in mai ja</p>
      <button
        class="b2 rounded-lg bg-burgundy py-1 text-light-grey"
        @click="handleSessionExpire"
      >
        OK
      </button>
    </div>
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
