<script setup lang="ts">
import Nav from './components/Nav.vue';
import { nextTick } from 'vue';
useHead({
  script: [
    { src: 'https://accounts.google.com/gsi/client', async: true, defer: true },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
});
const isLoggingOut = useState('isLoggingOut', () => false);
const isOTPPopup = useState('isOTPPopup', () => {
  // Check if running on the client-side
  if (process.client) {
    return localStorage.getItem('isOTPPopup') === 'true';
  }
  return false; // Default value for SSR
});

const route = useRoute();
const isBackoffice = ref(route.fullPath.includes('backoffice'));
const isSessionTimeOuts = useState('isSessionTimeOut');
const handleSessionExpire = useAuth().handleSessionExpire;
const isSignInCookie = useCookie('is_user_sign_in');
const isHavePopupOpen = useState('isHavePopupOpen', () => false);
const isClickOK = useState('isClickOk');
const isLoading = useState('isLoading', () => true);
// const showBanner = useState('showCookieBanner')
const { state, showPopup } = usePopup();

onMounted(() => {
  if (process.client) {
    isOTPPopup.value = localStorage.getItem('isOTPPopup') === 'true';
  }
  const observer = new MutationObserver(() => {
    if (isLoggingOut.value) return;
    if (!isClickOK.value) {
      if (
        !document.cookie.includes('refreshToken') &&
        isSignInCookie.value === 'yes'
      ) {
        showPopup('Your session has expired. Please sign in again.', 'warn');
        isSessionTimeOuts.value = true;
        state.isVisible = true;
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

watchEffect(() => {
  isBackoffice.value = route.fullPath.includes('backoffice');
});

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
    <AcceptCookie />

    <div :class="isHavePopupOpen ? 'fixed inset-0 z-50 bg-dark/20' : ''"></div>
    <Nav v-if="!isBackoffice && !isLoading" class="fixed top-0 z-40 w-full" />
    <Login />
    <OtpPopup />
    <CompleteModal
      :isShowCompleteModal="state.isVisible"
      :title="state.text"
      :status="state.status"
      @complete-action="
        handleSessionExpire();
        state.isVisible = false;
      "
    />
    <!-- <div
      class="absolute left-1/2 top-[600px] z-50 flex min-w-[420px] -translate-x-1/2 -translate-y-[100%] flex-col gap-4 rounded-xl bg-white p-10 text-center shadow-lg"
      v-if="true"
    >
      <p class="b1">Session expired pls sign in again</p>
      <button
        class="b2 rounded-lg bg-burgundy py-1 text-light-grey"
        @click="handleSessionExpire"
      >
        OK
      </button>
    </div> -->
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
