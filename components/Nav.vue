<script setup lang="ts">
import SearchIcon from './icons/Search.vue';

const router = useRouter();
const searchKw = ref('');
const handleSearch = () => {
  if (searchKw.value.length > 0) {
    router.push({
      path: '/events',
      query: { k: encodeURIComponent(searchKw.value) },
    });
  } else {
    router.push({
      path: '/events',
    });
  }
};
const loginPopup = useLoginPopup();
const isUserSignIn = useIsUserSignIn();

function openLoginPopup() {
  loginPopup.value = true;
}

watch(
  () => isUserSignIn.value, // ฟังก์ชันที่คืนค่าที่ต้องการติดตาม
  (newVal, oldVal) => {
    // ฟังก์ชัน callback เมื่อค่าเปลี่ยนแปลง
    if (newVal) {
      console.log('User is now signed in');
      // คุณสามารถเรียกฟังก์ชันอื่น หรือทำ action อื่นๆ ที่ต้องการได้ที่นี่
    } else {
      console.log('User is signed out');
      openLoginPopup(); // เปิด popup ล็อกอินเมื่อ signed out
    }
  }
);
const userProfile = useUserProfile();
const isOpenProfilePopup = ref(false);

const handleOpenProfilePopup = () => {
  isOpenProfilePopup.value = !isOpenProfilePopup.value;
};
onMounted(async () => {
  const accessToken = useCookie('accessToken');
  console.log();

  const userProfileData = await useFetchWithAuth(
    'profile',
    'GET',
    accessToken.value
  );
  userProfile.value = userProfileData;
});

const deleteCookie = () => {
  const accessToken = useCookie('accessToken');
  const refreshToken = useCookie('refreshToken');

  // ลบคุกกี้โดยการตั้งค่าเป็น null
  accessToken.value = null;
  refreshToken.value = null;
  router.push('/').then(() => {
    window.location.reload();
  });
  console.log('Cookies deleted');
};
</script>

<template>
  <div class="w-screen bg-white/20 py-4 backdrop-blur-sm lg:py-6">
    <div
      class="mx-auto flex items-center justify-between px-5 lg:max-w-6xl lg:px-0"
    >
      <!-- {{ userProfile }} -->
      <NuxtLink to="/">
        <button class="go-home-btn oooh-baby-regular text-xl lg:text-4xl">
          Gatherfy
        </button>
      </NuxtLink>

      <div class="flex items-center gap-5">
        <div
          class="b3 flex rounded-2xl border border-grey px-2 lg:px-4 lg:py-2"
        >
          <input
            type="text"
            name=""
            id=""
            placeholder="search.."
            v-model="searchKw"
            class="bg-white/0 focus:outline-none"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch()" class="search-btn">
            <SearchIcon class="h-3 w-3 text-black" />
          </button>
        </div>
        <BtnComp
          v-if="!isUserSignIn"
          text="Sign in"
          color="red"
          @click="openLoginPopup"
        />
        <div class="relative" v-else>
          <div
            @click="handleOpenProfilePopup"
            class="h-8 w-8 rounded-full bg-zinc-300"
          >
            <img
              v-if="userProfile"
              :src="userProfile?.users_image"
              alt=""
              class="h-8 w-8 rounded-full"
            />
          </div>
          <div
            v-if="isOpenProfilePopup"
            class="absolute right-0 top-12 flex w-max flex-col items-start gap-1 rounded-lg bg-white p-3 text-start shadow-xl"
          >
            <NuxtLink to="/profile">
              <button
                class="w-full rounded-md px-2 py-2 text-start hover:bg-grey"
              >
                My Profile
              </button>
            </NuxtLink>
            <NuxtLink to="/tickets">
              <button
                class="w-full rounded-md px-2 py-2 text-start hover:bg-grey"
              >
                My Tickets
              </button>
            </NuxtLink>
            <button
              @click="deleteCookie"
              class="w-full rounded-md px-2 py-2 text-start hover:bg-grey"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
