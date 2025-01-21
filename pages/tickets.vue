<script setup lang="ts"></script>

<template>
  <div class="mx-auto mt-32 flex w-screen max-w-6xl gap-9">
    <div class="bg- w-[280px] rounded-xl border border-black/70"></div>
    <div class="w-full">
      <p class="t3">My Ticket</p>
      <div
        class="flex w-full items-center justify-between rounded-xl border border-black-1 p-1 lg:p-2 lg:pr-4"
      >
        <div
          :class="`flex gap-2 ${isShowSort ? 'pointer-events-none opacity-0' : ''}`"
        >
          <button
            @click="selectTime('today')"
            :class="`btn b3 rounded-md px-2 py-2 lg:px-4 ${selectedEventTime === 'today' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
          >
            Upcoming events
          </button>
          <button
            @click="selectTime('upcome')"
            :class="`btn b3 rounded-md px-2 py-2 lg:px-4 ${selectedEventTime === 'upcome' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
          >
            Past events
          </button>
        </div>
      </div>
      <div>
        <div class="mt-4 flex shadow-xl">
          <div class="aspect-square w-[300px] rounded-[5px]">
            <img
              src="../components/images/2025-SMTown.jpg"
              class="aspect-square w-[500px] object-cover"
              alt=""
            />
          </div>
          <div class="rounded-[5px] bg-white p-4 px-5">
            <h1 class="t2">Startup Pitch Night</h1>
            <p class="b3">Technology</p>
            <div class="mt-4">
              <p class="b2 font-semibold">25.12.2025</p>
              <p class="b2">Sunday 7PM - 11PM</p>
            </div>

            <div class="mt-[105px]">
              <p class="b3 font-semibold">Co-Working Space</p>
              <p class="b3">Chiang Mai, Thailand</p>
            </div>
          </div>
          <div
            class="w- b3 flex items-center justify-center border-l-[1px] border-dashed px-12 text-center"
          >
            <p class="mx-auto">
              Click to view <br />
              QR Code
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
