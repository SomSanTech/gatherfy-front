<script setup lang="ts">
const route = useRoute();
console.log(route.params.id);
</script>
<template>
  <div class="relative">
    <div class="mx-auto my-20 w-full max-w-5xl">
      <!-- header -->
      <div class="flex w-full gap-12 border">
        <div class="h-[500px] w-[350px] bg-zinc-200">
          <img src="https://picsum.photos/350/500" alt="" class="h- w-" />
        </div>

        <div class="flex w-fit flex-col justify-center gap-3">
          <div class="tag-group flex gap-2">
            <button class="rounded-md bg-zinc-200 px-4 text-sm">Tag 1</button>
            <button class="rounded-md bg-zinc-200 px-4 text-sm">Tag 2</button>
          </div>
          <p class="text-3xl font-semibold">SomSan 1st Fancon in Bangkok</p>
          <div><p>13 Sep 2024 09:00 - 15 Sep 2024 19:00</p></div>
          <div>
            <p>IMPACT, Muang Thong,<span> Hall 7</span></p>
            <p>Nonthaburi, Thailand</p>
          </div>
          <div class="flex gap-2">
            <button class="rounded-sm border border-black px-5 py-2">
              Add To Calendar
            </button>
            <button class="rounded-sm border border-black px-5 py-2">
              Follow
            </button>
            <button class="rounded-sm border border-black px-5 py-2">
              Add To Fav
            </button>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-3 py-4">
        <p>Free tickets<span> available</span></p>

        <button class="rounded-sm bg-black px-7 py-2 text-white">
          Register now
        </button>
      </div>
      <!-- content -->
      <div class="flex flex-col gap-4 py-8">
        <h1 class="font-semibold">Event Information</h1>
        <!-- image -->
        <div class="h-[500px] w-full bg-zinc-200">
          <img
            src="https://picsum.photos/1000/500"
            alt=""
            class="h-full w-full"
          />
        </div>
        <!-- text -->
        <div>
          <h1 class="text-2xl font-semibold">SomSan CONCERT ‘YOUR BOY’</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto
            incidunt dolores esse pariatur. Veritatis ipsam ea sint, facilis
            modi possimus accusamus magni voluptate dolores, dicta fugit,
            perferendis officiis? Ex, ad.
          </p>
        </div>
      </div>
    </div>
    <div
      class="fixed -top-0 right-3 h-screen w-2/5 rounded-lg bg-white p-7 shadow-2xl"
    >
      <button class="p-3">>></button>
      <div class="flex flex-col gap-5">
        <img
          src="https://picsum.photos/350/350"
          class="mx-auto rounded-lg"
          alt=""
        />

        <div>
          <h1 class="text-2xl font-semibold">SomSan 1st Fancon in Bangkok</h1>
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
            <button class="rounded-md bg-zinc-200 py-1">Register</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
