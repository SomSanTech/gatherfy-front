<script setup lang="ts">
// import { Client } from 'minio';
import Calendar from '~/components/icons/Calendar.vue';
import Location from '~/components/icons/Location.vue';
const route = useRoute();
const param = route.params.id;
const isOpenPopup = ref(false);

const regis = () => {
  alert('you regis leaw');
  isOpenPopup.value = false;
};
const event = ref();

// const minioClient = new Client({
//   endPoint: 'cp24us1.sit.kmutt.ac.th',
//   port: 9000,
//   accessKey: '3257BL5ZydsByO63I6N2',
//   secretKey: 'TSaA4wzqrMmxZcmeeNdC4XywYkhgrfbYgD9DVrXv',
//   useSSL: false,
// });
// Helper ฟังก์ชันในการแปลง ReadableStream เป็น Blob
// const streamToBlob = async (stream: any): Promise<Blob> => {
//   const chunks: Uint8Array[] = [];
//   for await (const chunk of stream) {
//     chunks.push(chunk);
//   }
//   return new Blob(chunks);
// };

// const image = ref();
// // ฟังก์ชันดาวน์โหลดรูปภาพและแสดงผล
// const downloadFile = async () => {
//   try {
//     const fileStream = await minioClient.getObject('thumnails', 'download.jpg');

//     // แปลง ReadableStream เป็น Blob
//     const blob = await streamToBlob(fileStream);
//     image.value = URL.createObjectURL(blob);
//   } catch (error) {
//     console.error('Error downloading file:', error);
//   }
// };

const getEventDetail = async () => {
  const { data, error } = await useFetch(
    `http://localhost:8080/api/events/${param}`
  );

  if (error.value) {
    console.log('Error fetching events:', error.value);
    return;
  }

  event.value = data.value;
};
onMounted(() => {
  getEventDetail();
});

watchEffect(() => {
  if (param) {
    console.log(param);

    getEventDetail();
  }
});
</script>
<template>
  <div class="relative my-24 w-full">
    <div class="mx-auto my-20 w-full">
      <!-- header -->
      <div
        :style="{ backgroundImage: `url(${event?.image})` }"
        class="w-screen bg-opacity-75 bg-cover bg-center backdrop-blur-md"
      >
        <div
          class="relative z-10 bg-black bg-opacity-30 p-10 py-32 backdrop-blur-md"
        >
          <div class="mx-auto flex w-full max-w-6xl gap-12 text-white">
            <div class="h-[500px] w-[350px] bg-zinc-200">
              <img
                :src="event?.image"
                alt=""
                class="h-full w-full object-fill"
              />
            </div>

            <div class="flex w-fit flex-col justify-center gap-3">
              <div class="tag-group flex gap-2">
                <button class="bg-zin-200 rounded-md text-sm">Tag 1</button>
                <button class="bg-zin-200 rounded-md text-sm">Tag 2</button>
              </div>
              <p class="text-3xl font-semibold">{{ event?.name }}</p>
              <div class="flex items-center gap-2">
                <Calendar />
                <p>13 Sep 2024 09:00 - 15 Sep 2024 19:00</p>
              </div>
              <div class="flex items-center gap-2">
                <Location />
                <p>{{ event?.location }}</p>
              </div>
              <div class="flex gap-2">
                <button class="rounded-xl bg-[#FEFEFE] px-5 py-2 text-black">
                  Register event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- content -->
      <div class="mx-auto mt-[100px] grid max-w-6xl grid-cols-5 gap-20">
        <div class="col-span-3 flex flex-col gap-4">
          <h1 class="font-semibold">Description</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa fuga
            aspernatur aperiam, tenetur, repellendus ipsum aliquid dolore et
            voluptatem, nisi reprehenderit maiores similique numquam ipsam sunt
            deserunt! Necessitatibus vel delectus ab atque ut impedit, nam
            error, nihil a dolor in. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ipsa fuga aspernatur aperiam, tenetur, repellendus
            ipsum aliquid dolore et voluptatem, nisi reprehenderit maiores
            similique numquam ipsam sunt deserunt! Necessitatibus vel delectus
            ab atque ut impedit, nam error, nihil a dolor in.
          </p>
          <!-- image -->
          <div class="h-[500px] w-fit bg-zinc-200">
            <img
              src="https://picsum.photos/1000/500"
              alt=""
              class="h-full w-fit"
            />
          </div>
        </div>
        <div class="col-span-2 flex flex-col gap-6">
          <div class="flex flex-col gap-5">
            <p>Event location</p>
            <div class="h-64 w-64 rounded-lg bg-slate-200"></div>
          </div>
          <div class="flex flex-col gap-5">
            <p>Tags</p>
            <div class="h-10 w-32 rounded-lg bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- pop up -->
    <div
      v-show="isOpenPopup"
      class="fixed -top-0 right-3 h-screen w-2/5 overflow-y-auto rounded-lg bg-white p-7 shadow-2xl"
    >
      <button @click="isOpenPopup = false" class="p-3">>></button>
      <div class="flex flex-col gap-5">
        <img
          src="https://picsum.photos/350/350"
          class="mx-auto rounded-lg"
          alt=""
        />

        <div>
          <h1 class="text-2xl font-semibold">{{ event?.name }}</h1>
          <p class="font-semibold text-zinc-600">Host by SomSan</p>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex w-fit flex-col">
            <div
              class="rounded-t-md border bg-zinc-200 px-3 text-[10px] font-semibold"
            >
              SEP
            </div>
            <div class="rounded-b-md border px-3 text-center font-semibold">
              15
            </div>
          </div>
          <div>
            <p class="font-semibold">Sunday, September 15</p>

            <p class="text-sm font-semibold text-zinc-500">
              6:00 AM - 10:00 AM
            </p>
          </div>
        </div>

        <div class="">
          <div
            class="rounded-t-md bg-zinc-300 px-4 py-1 font-semibold text-black"
          >
            Registration
          </div>
          <div class="flex flex-col gap-3 rounded-b-md border p-4">
            <div>
              <p>Name *</p>
              <input
                type="text"
                class="rounded-md border px-2 py-1"
                placeholder="Your Name"
              />
            </div>
            <div>
              <p>Email *</p>
              <input
                type="text"
                class="rounded-md border px-2 py-1"
                placeholder="you@gmail.com"
              />
            </div>
            <div>
              <p>Age *</p>
              <input
                type="text"
                class="rounded-md border px-2 py-1"
                placeholder="Your Age"
              />
            </div>
            <button @click="regis" class="rounded-md bg-zinc-200 py-1">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
