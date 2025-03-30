<script setup lang="ts">
const showBanner = useState('showCookieBanner', () => true);
const isLoading = useState('isLoading');
const isCookieConsent = useCookie('cookie_consent');
const acceptCookies = () => {
  document.cookie = 'cookie_consent=true; path=/; max-age=31536000';
  showBanner.value = false;
};
</script>

<template>
  <div
    v-if="showBanner && !isCookieConsent && !isLoading"
    class="b3 fixed bottom-4 left-4 right-4 z-50 flex flex-col items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-lg md:flex-row"
  >
    <div>
      <p class="text-sm text-gray-700">
        We use cookies to improve your experience on our site. By continuing,
        you agree to our
        <a href="/policy" target="_blank" class="text-blue-600 underline"
          >Privacy Policy</a
        >.
      </p>
    </div>
    <BtnComp
      @click="acceptCookies"
      text="Accept"
      color="red"
      :is-bold="false"
    />
  </div>
</template>

<style scoped></style>
