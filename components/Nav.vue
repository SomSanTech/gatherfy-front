<script setup lang="ts">
import type { UserProfile } from '~/models/userProfile';
import { vOnClickOutside } from '@vueuse/components';

import SearchIcon from './icons/Search.vue';
import User from './icons/User.vue';

const router = useRouter();
const searchKw = ref('');
const loginPopup = useState('loginPopup');

const isUserSignIn = useState('isUserSignIn');
const isOpenProfilePopup = ref(false);
const isHavePopupOpen = useState('isHavePopupOpen');
function openLoginPopup() {
  loginPopup.value = true;
  isHavePopupOpen.value = true;
}

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

const handleOpenProfilePopup = () => {
  isOpenProfilePopup.value = !isOpenProfilePopup.value;
};

const signOut = useAuth().logout;

const profileData = useCookie<UserProfile>('profileData');
</script>

<template>
  <div class="z-50 w-screen bg-white/20 py-4 backdrop-blur-sm lg:py-6">
    <div
      class="mx-auto flex items-center justify-between px-5 lg:max-w-6xl lg:px-0"
    >
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
          v-if="!profileData"
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
              v-if="profileData?.users_image"
              :src="profileData?.users_image"
              alt=""
              class="h-8 w-8 rounded-full"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center rounded-full bg-black/80"
            >
              <img
                src="/favicon.ico"
                class="relative h-5 w-5 shrink-0 rounded-full object-cover"
              />
            </div>
          </div>
          <div
            v-if="isOpenProfilePopup"
            v-on-click-outside="handleOpenProfilePopup"
            @click="isOpenProfilePopup = false"
            class="b2 absolute right-0 top-12 flex w-max flex-col items-start gap-1 rounded-xl bg-white p-2 shadow-lg"
          >
            <NuxtLink to="/profile" class="w-full">
              <button
                @click.stop
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start transition-all hover:bg-gray-100"
              >
                <UserProfile class="h-5 w-5 text-gray-600" />
                <span>My Profile</span>
              </button>
            </NuxtLink>
            <NuxtLink to="/tickets" class="w-full">
              <button
                @click.stop
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start transition-all hover:bg-gray-100"
              >
                <Ticket class="h-5 w-5 text-gray-600" />
                <span>My Tickets</span>
              </button>
            </NuxtLink>
            <NuxtLink to="/contact" class="w-full">
              <button
                @click.stop
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start transition-all hover:bg-gray-100"
              >
                <Contact class="h-5 w-5 text-gray-600" />
                <span>My Contact</span>
              </button>
            </NuxtLink>
            <NuxtLink
              v-if="profileData && profileData.users_role !== 'Attendee'"
              to="/backoffice"
              class="w-full"
            >
              <button
                @click.stop
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start transition-all hover:bg-gray-100"
              >
                <Bookmark class="h-5 w-5 text-gray-600" />
                <span>Manage Event</span>
              </button>
            </NuxtLink>
            <!-- Divider -->
            <div class="my-1 h-px w-full bg-gray-200"></div>

            <button
              @click="signOut"
              @click.stop
              class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-red-600 transition-all hover:bg-red-100"
            >
              <SignOut class="fill-red-600 text-red-600" />
              <span>Sign Out</span>
            </button>
          </div>

          <!-- <div
            v-if="isOpenProfilePopup"
            v-on-click-outside="handleOpenProfilePopup"
            @click="isOpenProfilePopup = false" 
            class="b2 absolute right-0 top-12 flex w-max flex-col items-start gap-1 rounded-lg bg-white p-3 text-start shadow-xl"
          >
            <NuxtLink to="/profile">
              <button
              @click.stop
                class="w-full rounded-md px-2 py-2 text-start hover:bg-grey"
              >
                My Profile
              </button>
            </NuxtLink>
            <NuxtLink to="/tickets">
              <button
              @click.stop
                class="w-full rounded-md px-2 py-2 text-start hover:bg-grey"
              >
                My Tickets
              </button>
            </NuxtLink>
            <button
              @click="signOut"
              @click.stop
              class="w-full rounded-md px-2 py-2 text-start hover:bg-grey"
            >
              Sign out
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.mask-gradient {
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0)
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0)
  );
  /* backdrop-filter: blur(20px); */
  /* position: fixed; */
  /* z-index: 1; */
  /* top: 0;  */
  /* width: 100%; */
  /* height: 10%; */
}
</style>
