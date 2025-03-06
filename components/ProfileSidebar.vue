<script setup lang="ts">
const route = useRoute();
const isTicketPage = ref(route.fullPath.includes('tickets'));
const contacts = [
  { id: 1, name: 'Alice Smith', phone: '+1 987 654 321' },
  { id: 2, name: 'Bob Johnson', phone: '+1 555 666 777' },
  { id: 3, name: 'Charlie Brown', phone: '+1 444 333 222' },
];

function shareContact() {
  alert('Sharing your contact...');
}

function saveContact(contact) {
  if (contact) {
    alert(`Saving contact: ${contact.name}`);
  } else {
    alert('Saving your contact...');
  }
}

const userProfile = useCookie('profileData', { default: () => ({}) });
</script>

<template>
  <div
    class="flex w-fit flex-col gap-5"
    :class="isTicketPage ? 'shrink-0' : ''"
  >
    <div
      v-if="!isTicketPage"
      :class="isShareContact ? 'w-screen max-w-6xl flex-row' : 'flex-col'"
      class="flex w-full gap-5 rounded-xl border border-zinc-500/10 bg-[#E9E9E9]/70 p-5 shadow-md shadow-zinc-300/30 duration-700"
    >
      <div
        class="group relative w-full max-w-lg overflow-hidden rounded-2xl shadow-lg duration-700"
      >
        <div class="b3 group relative duration-700">
          <img
            :src="userProfile.users_image"
            alt="Severance"
            class="h-[500px] w-full object-cover"
          />

          <div class="mask-gradient-profile"></div>
          <div class="mask-gradient-profile"></div>
          <div
            class="absolute bottom-0 right-0 z-50 h-4/5 w-full bg-gradient-to-t from-black/90"
          ></div>
          <div class="p absolute bottom-4 z-50 w-full px-4 text-white">
            <h2 class="mt-4 text-xl font-semibold">
              {{ userProfile.username }}
            </h2>
            <p class="text-white">
              {{ userProfile.users_firstname }}
              {{ userProfile.users_lastname }}
            </p>
            <div
              class="mt-2 flex w-full flex-col gap-2 rounded-md border border-dashed p-2"
            >
              <div class="flex items-center gap-1">
                <Phone class="fill-white text-[15px]" />
                <p>{{ userProfile.users_phone }}</p>
              </div>
              <div class="flex items-center gap-1">
                <Gmail class="fill-white text-[15px]" />
                <p>{{ userProfile.users_email }}</p>
              </div>
            </div>
            <!-- <div class="mt-2 flex gap-4">
                <a
                  v-if="socialLinks.instagram"
                  :href="socialLinks.instagram"
                  target="_blank"
                >
                  <Instagram class="text-2xl" />
                </a>
                <a
                  v-if="socialLinks.facebook"
                  :href="socialLinks.facebook"
                  target="_blank"
                >
                  <Facebook class="text-2xl" />
                </a>
                <a
                  v-if="socialLinks.linkedin"
                  :href="socialLinks.linkedin"
                  target="_blank"
                >
                  <Linkedin class="text-2xl" />
                </a>
                <a v-if="socialLinks.x" :href="socialLinks.x" target="_blank">
                  <X class="text-2xl" />
                </a>
              </div> -->

            <div class="mt-3 w-full">
              <button
                @click="shareProfile"
                class="b3 w-full rounded-lg bg-white px-4 py-2 text-black hover:bg-blue-600"
              >
                Share contact
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- <div
          v-if="isShareContact"
          class="w-full rounded-xl border border-black/60 p-10 duration-500"
        >
          this is qrcode
        </div> -->
      <!-- <div
          class="b3 flex w-full flex-col items-center gap-4 rounded-xl bg-white p-6 shadow-lg"
        >
          <div class="flex flex-col items-center">
            <img
              src="../components/images/kornnaphat.png"
              alt="User Profile Image"
              class="h-24 w-24 rounded-full object-cover"
            />
            <h2 class="mt-4 text-xl font-semibold">
              {{ userProfile.username }}
            </h2>
            <p class="text-gray-500">
              {{ userProfile.users_firstname }} {{ userProfile.users_lastname }}
            </p>
          </div>

          <div class="mt-4 flex w-full flex-col gap-2">
            <div class="flex items-center gap-2">
              <i class="fas fa-phone-alt text-lg text-gray-600"></i>
              <p>{{ userProfile.users_phone }}</p>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-envelope text-lg text-gray-600"></i>
              <p>{{ userProfile.users_email }}</p>
            </div>
          </div>

          <div class="mt-4 flex gap-4">
            <a
              v-if="socialLinks.instagram"
              :href="socialLinks.instagram"
              target="_blank"
            >
              <Instagram class="text-2xl text-pink-600" />
            </a>
            <a
              v-if="socialLinks.facebook"
              :href="socialLinks.facebook"
              target="_blank"
            >
              <Facebook class="text-2xl text-blue-600" />
            </a>
            <a
              v-if="socialLinks.linkedin"
              :href="socialLinks.linkedin"
              target="_blank"
            >
              <Linkedin class="text-2xl text-blue-700" />
            </a>
            <a v-if="socialLinks.x" :href="socialLinks.x" target="_blank">
              <X class="text-2xl text-blue-500" />
            </a>
          </div>

          <div class="mt-6 w-full">
            <button
              @click="shareProfile"
              class="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Share contact
            </button>
          </div>
        </div> -->
    </div>
    <div
      class="g-[#E9E9E9]/40 b2 flex h-full w-full flex-col gap-5 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30"
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
    </div>
  </div>
</template>

<style scoped></style>
