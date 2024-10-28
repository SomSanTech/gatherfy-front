<script setup lang="ts">
import Calendar from './icons/Calendar.vue';
import Dashboard from './icons/Dashboard.vue';
import User from './icons/User.vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';

const isClient = ref(false);
const menuOpen = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
onMounted(() => {
  isClient.value = true;
});
</script>

<template>
  <div class="h-full w-80 bg-white px-14 py-16 drop-shadow-lg">
    <div class="oooh-baby-regular mb-10 text-center text-5xl">Gatherfy</div>
    <div class="flex flex-col gap-10">
      <div class="flex items-center gap-3 text-gray-600">
        <Dashboard class="t2" />
        <p class="font-semibold">Dashboard</p>
      </div>
      <div class="flex items-center gap-3 text-gray-600">
        <Calendar class="t2" />
        <p class="font-semibold">Events</p>
      </div>
      <div class="flex items-center gap-3 text-gray-600">
        <User class="t2" />
        <p class="font-semibold">Registration</p>
      </div>
      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton
            v-if="isClient"
            :aria-expanded="menuOpen ? 'true' : 'false'"
            @click="toggleMenu"
            class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Options
            <ChevronDownIcon
              class="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </MenuButton>
        </div>

        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  ]"
                  >Account settings</a
                >
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  ]"
                  >Support</a
                >
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  ]"
                  >License</a
                >
              </MenuItem>
              <form method="POST" action="#">
                <MenuItem v-slot="{ active }">
                  <button
                    type="submit"
                    :class="[
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block w-full px-4 py-2 text-left text-sm',
                    ]"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </form>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>
