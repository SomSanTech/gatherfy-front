<script setup lang="ts"></script>

<template>
  <div class="mt-10 grid grid-cols-3 gap-x-16 gap-y-5">
    <div class="">
      <p class="b1">Event</p>
      <input
        type="text"
        class="border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
        placeholder="Name"
      />
    </div>
    <div class="col-start-1">
      <p class="b1">First name</p>
      <input
        type="text"
        class="border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
        placeholder="Name"
      />
    </div>
    <div class="">
      <p class="b1">Last name</p>
      <input
        type="text"
        class="border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
        placeholder="Name"
      />
    </div>
    <div class="">
      <p class="b1">Username</p>
      <input
        type="text"
        class="border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
        placeholder="Name"
      />
    </div>
    <div class="">
      <p class="b1">Email</p>
      <input
        type="text"
        class="border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
        placeholder="Name"
      />
    </div>
    <div class="">
      <p class="b1">Phone</p>
      <input
        type="text"
        class="border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
        placeholder="Name"
      />
    </div>
    <div class="">
      <p class="b1">Gender</p>
      <input
        type="text"
        class="border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
        placeholder="Name"
      />
    </div>
    <div class="">
      <p class="b1">Checked in</p>
      <input
        type="text"
        class="border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
        placeholder="Name"
      />
    </div>
  </div>
  <div class="flex justify-end gap-5">
    <BtnComp text="Save" color="green" />
    <BtnComp text="Cancle" color="outline-red" />
  </div>
</template>
