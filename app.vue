<script setup lang="ts">
import Nav from './components/Nav.vue';
import { nextTick } from 'vue';

const loginPopup = useState('loginPopup');
const isLoggingOut = useState('isLoggingOut', () => false);
const isOTPPopup = useState('isOTPPopup');
const route = useRoute();
const role = useState('role');
const isBackoffice = ref(route.fullPath.includes('backoffice'));
const isSignUpPage = ref(route.fullPath.includes('signup'));
const isSessionTimeOuts = useState('isSessionTimeOut');
const handleSessionExpire = useAuth().handleSessionExpire;
const refreshCookie = useCookie('refreshToken');
const isUserSignIn = useState('isUserSignIn');
const isSignInCookie = useCookie('is_user_sign_in');
const isHavePopupOpen = useState('isHavePopupOpen', () => false);
const isClickOK = useState('isClickOk');

onMounted(() => {
  const observer = new MutationObserver(() => {
    // console.log('Cookies changed:', document.cookie);
    if (isLoggingOut.value) return;
    if (!isClickOK.value) {
      if (
        !document.cookie.includes('refreshToken=') &&
        isSignInCookie.value === 'yes'
      ) {
        console.log('Session timeout detected');
        isSessionTimeOuts.value = true;
        isHavePopupOpen.value = true;
      }
    }
  });

  observer.observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
  });
});
// watch(
//   refreshCookie,
//   async (newValue) => {
//     console.log('isUserSignIn', isSignInCookie.value);
//     console.log('refreshCookie', refreshCookie.value);

//     if (!newValue && isSignInCookie.value === 'yes') {
//       console.log('time out');

//       isSessionTimeOuts.value = true;
//       await nextTick();
//     }
//   },
//   { deep: true, immediate: true }
// );
watch(
  [isHavePopupOpen, isOTPPopup, isSessionTimeOuts],
  ([openPopup, otp, session]) => {
    if (process.client) {
      if (openPopup) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  }
);
</script>
<template>
  <div class="relative mx-auto w-full">
    <div :class="isHavePopupOpen ? 'fixed inset-0 z-50 bg-black/20' : ''"></div>
    <Nav
      v-if="!isBackoffice && !isSignUpPage && role !== 'Organization'"
      class="fixed top-0 z-40 w-full"
    />
    <Login />
    <OtpPopup />
    <div
      class="absolute left-1/2 top-[600px] z-50 flex min-w-[420px] -translate-x-1/2 -translate-y-[100%] flex-col gap-4 rounded-xl bg-white p-10 text-center shadow-lg"
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
