<script setup lang="ts">
import { ref, onMounted } from 'vue';

const otpLength = 6;
const otpValues = ref<string[]>(Array(otpLength).fill(''));
const otpInputs = ref<Array<HTMLInputElement | null>>([]);

// ฟังก์ชันเปลี่ยนโฟกัสไปช่องถัดไป
const handleInput = (index: number) => {
  if (otpValues.value[index] && index < otpLength - 1) {
    otpInputs.value[index + 1]?.focus();
  }
};

// ฟังก์ชันกด Backspace แล้วย้อนกลับไปช่องก่อนหน้า
const handleBackspace = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otpValues.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus();
  }
};
const loginPopup = useLoginPopup();
const isSignup = useState('isSignup');

const verifyOTP = async () => {
  const otpString = otpValues.value.join('');
  console.log('OTP:', otpString);
  const response = await useFetchCreateUpdate2('v1/verify-otp', 'POST', {
    email: email.value,
    otp: otpString,
  });
  console.log('res OTP', response);
  if (response?.error) {
    console.error('Error verifying OTP:', response.error);
    return;
  }
  if (response.status === 200) {
    isOTPPopup.value = false;
    isSignup.value = !isSignup.value;
    loginPopup.value = true;
  }
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; // แสดงรูปแบบ mm:ss
};

const countdown = ref(300); // ⏳ เปลี่ยนจาก 30 เป็น 300 วินาที (5 นาที)
const isResendDisabled = ref(true);
let countdownInterval: number | null = null;

// ฟังก์ชันเริ่มนับถอยหลัง
const startCountdown = () => {
  isResendDisabled.value = true;
  countdown.value = 300; // รีเซ็ตกลับไป 5 นาที

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
    console.log('Resend OTP...');
    const response = await useFetchCreateUpdate('v1/resend-otp', 'POST', {
      email: email.value,
    });
    startCountdown(); // เริ่มนับถอยหลังใหม่
  }
};
const isOTPPopup = useState('isOTPPopup');
const email = ref();
// Autofocus ช่องแรกเมื่อเปิด
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
      <p class="text-center text-gray-600">We've sent an OTP to your phone.</p>

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
        class="mt-4 w-full rounded-lg bg-burgundy/80 p-2 text-white hover:bg-burgundy"
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
