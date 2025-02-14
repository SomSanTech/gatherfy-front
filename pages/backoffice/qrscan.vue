<script setup lang="ts">
import { BrowserQRCodeReader } from '@zxing/browser';

definePageMeta({
  layout: 'backoffice',
});
const video = ref<HTMLVideoElement | null>(null);
const scannedValue = ref<string | null>(null);

const apiResponse = ref<string | null>(null);
let qrCodeReader: BrowserQRCodeReader;

onMounted(async () => {
  qrCodeReader = new BrowserQRCodeReader();
  qrCodeReader.decodeFromVideoDevice(
    null,
    video.value,
    async (result, error) => {
      if (result) {
        scannedValue.value = result.getText(); // ดึงค่าจาก QR Code
        if (scannedValue.value) {
          apiResponse.value = scannedValue.value;
          console.log(scannedValue.value);

          try {
            // ส่งคำขอ PUT ไปที่ backend พร้อม Authorization header
            const response = await useFetchWithAuth(
              `v1/check-in`,
              'PUT',
              scannedValue.value
            );
            // const response = await fetch(
            //   'http://localhost:4040/api/v1/check-in',
            //   {
            //     method: 'PUT',
            //     headers: {
            //       Authorization: `Bearer ${scannedValue.value}`, // แนบ token ใน header
            //     },
            //   }
            // );
            // apiResponse.value = JSON.stringify(data, null, 2); // แสดงผลลัพธ์
            apiResponse.value = response.data;
          } catch (err) {
            console.error('API call failed:', err);
            apiResponse.value = 'API call failed!';
          }
        } else {
          console.log('test');
        }
      }
      if (error) console.error(error);
    }
  );
});

// onBeforeUnmount(() => {
//   qrCodeReader.reset(); // ปิดกล้องเมื่อออกจากหน้า
// });
</script>
<template>
  <div class="ml-80 h-screen w-full">
    <div class="flex h-full justify-center px-10 text-center">
      <div class="my-auto flex h-full w-full">
        <video ref="video" width="400" height="400" class="rounded-lg"></video>
        <p v-if="scannedValue">Scanned Value: {{ scannedValue }}</p>
        <p v-if="apiResponse" class="mt-4 text-blue-600">
          API Response: {{ apiResponse }}
        </p>
      </div>
      <div></div>
    </div>
  </div>
</template>
