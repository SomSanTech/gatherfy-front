<script setup lang="ts">
import { ref, onMounted } from 'vue';

const otpLength = 6;
const otpValues = ref<string[]>(Array(otpLength).fill(''));
const otpInputs = ref<Array<HTMLInputElement | null>>([]);

const handleInput = (index: number) => {
  if (otpValues.value[index] && index < otpLength - 1) {
    otpInputs.value[index + 1]?.focus();
  }
};

const handleBackspace = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otpValues.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus();
  }
};
const loginPopup = useState('loginPopup');

const isSignup = useState('isSignup');

const verifyOTP = async () => {
  email.value = localStorage.getItem('email') || '';
  const otpString = otpValues.value.join('');
  const response = await useFetchData('v1/verify-otp', 'POST', {
    email: email.value,
    otp: otpString,
  });
  if (response?.error) {
    console.error('Error verifying OTP:', response.error);
    return;
  }
  if (response.status === 200) {
    localStorage.setItem('isOTPPopup', 'false');
    isOTPPopup.value = false;
    localStorage.removeItem('email');
    isSignup.value = false;
    loginPopup.value = true;
    otpValues.value = [];
  }
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const countdown = ref(180);
const isResendDisabled = ref(true);
let countdownInterval = null;

const startCountdown = () => {
  isResendDisabled.value = true;
  countdown.value = 180;

  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval as number);
      isResendDisabled.value = false;
    }
  }, 1000);
};
const resendOTP = async () => {
  if (!isResendDisabled.value) {
    const response = await useFetchCreateUpdate('v1/resend-otp', 'POST', {
      email: email.value,
    });
    startCountdown();
  }
};
const isOTPPopup = useState('isOTPPopup');
const email = ref();
onMounted(() => {
  email.value = localStorage.getItem('email') || '';
  otpInputs.value[0]?.focus();
  startCountdown();
});
</script>

<template>
  <div
    v-if="isOTPPopup"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="z-50 flex min-w-[420px] flex-col gap-4 rounded-xl bg-white p-8 shadow-lg"
    >
      <h2 class="text-center text-xl font-semibold">Enter OTP</h2>
      <p class="text-center text-gray-600">We've sent an OTP to your email</p>

      <div class="flex justify-center gap-2">
        <input
          v-for="(val, index) in otpValues"
          :key="index"
          ref="otpInputs"
          v-model="otpValues[index]"
          type="text"
          maxlength="1"
          class="h-12 w-12 rounded-lg border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-burgundy"
          @input="handleInput(index)"
          @keydown="handleBackspace(index, $event)"
        />
      </div>

      <button
        @click="verifyOTP"
        class="b3 mt-4 w-full rounded-lg bg-burgundy p-2 text-white hover:bg-burgundy-dark"
      >
        Verify OTP
      </button>
      <p class="text-center text-sm text-gray-500">
        Didn't receive the code?
        <button @click="resendOTP" class="b3 text-burgundy hover:underline">
          {{
            isResendDisabled
              ? `Resend OTP in ${formatTime(countdown)}`
              : 'Resend OTP'
          }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
