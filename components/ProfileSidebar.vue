<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <div class="hidden w-fit shrink-0 flex-col gap-5 lg:flex">
    <div
      class="b2 flex h-full w-full min-w-[280px] flex-col gap-5 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30"
    >
      <NuxtLink to="/profile" class="w-full">
        <button
          @click.stop
          :class="
            route.fullPath.includes('profile')
              ? 'bg-burgundy fill-white text-white'
              : 'hover:bg-gray-100'
          "
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start transition-all"
        >
          <UserProfile class="h-5 w-5 text-gray-600" />
          <span>My Profile</span>
        </button>
      </NuxtLink>
      <NuxtLink to="/tickets" class="w-full">
        <button
          @click.stop
          :class="
            route.fullPath.includes('ticket')
              ? 'bg-burgundy fill-white stroke-white text-white'
              : 'stroke-gray-600 hover:bg-gray-100'
          "
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start transition-all"
        >
          <Ticket class="h-5 w-5 text-gray-600" />
          <span>My Tickets</span>
        </button>
      </NuxtLink>
      <NuxtLink to="/contact" class="w-full">
        <button
          @click.stop
          :class="
            route.fullPath.includes('contact')
              ? 'bg-burgundy fill-white text-white'
              : 'hover:bg-gray-100'
          "
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start transition-all"
        >
          <Contact class="h-5 w-5 text-gray-600" />
          <span>My Contact</span>
        </button>
      </NuxtLink>
      <NuxtLink to="/favorite" class="w-full">
        <button
          @click.stop
          :class="
            route.fullPath.includes('favorite')
              ? 'bg-burgundy fill-white stroke-white text-white'
              : 'stroke-gray-600 hover:bg-gray-100'
          "
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start transition-all"
        >
          <FavOutline class="h-5 w-5 text-gray-600" />
          <span>My Favorites</span>
        </button>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped></style>
