<script setup lang="ts">
import ArrowIcon from '~/components/icons/ArrowIcon.vue';
const data = ref([]);
const fetchEvents = async () => {
  let fetchData = await fetch('/events.json');
  console.log(fetchData);
  const jsonData = await fetchData.json();
  data.value = jsonData;
  console.log(data.value);
};

function test(a: string) {
  return a;
}
onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <div class="mx-auto my-20 max-w-4xl">
    <NuxtLink :to="{ name: 'event-id', params: { id: 1 } }">
      <div class="h-[500px] w-full rounded-2xl bg-zinc-100">
        <img
          src="https://picsum.photos/900/500"
          alt=""
          class="h-full w-full rounded-2xl"
        />
      </div>
    </NuxtLink>
    <div class="w-full py-7">
      <h1 class="t1">Reccomment Event</h1>
      <div class="relative flex w-full items-center justify-between gap-3 py-5">
        <button class="absolute left-0 h-fit rounded-full bg-zinc-100 p-2">
          <ArrowIcon class="text-zinc-300" />
        </button>
        <div class="flex w-full flex-col gap-3">
          <div class="flex gap-3">
            <div class="h-[250px] w-full bg-zinc-100 p-4">
              <h3 class="text-xl font-semibold">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Perferendis in esse fugiat iste quibusdam.
              </h3>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
                voluptates est explicabo reprehenderit cum enim commodi ad
                pariatur. Necessitatibus, a!
              </p>
            </div>
            <div class="h-[250px] w-full bg-zinc-100">
              <img
                src="https://picsum.photos"
                alt=""
                class="h-full w-full rounded-2xl"
              />
            </div>
          </div>
          <div class="grid grid-cols-6 gap-3">
            <div class="col-span-4 h-[150px] w-full bg-zinc-100">c</div>
            <NuxtLink
              :to="{ name: 'event-id', params: { id: 1 } }"
              class="col-span-2"
            >
              <button class="h-[150px] w-full bg-zinc-100">d</button>
            </NuxtLink>
          </div>
        </div>
        <button class="absolute right-0 h-fit rounded-full bg-zinc-100 p-2">
          <ArrowIcon class="rotate-180 text-zinc-300" />
        </button>
      </div>
    </div>
    <div class="w-full py-7">
      <div class="flex gap-4 rounded-full bg-zinc-100 px-8 py-4">
        <button>Today event</button>
        <button>Upcoming event</button>
        <button>All event</button>
      </div>
      <h1 class="t1 py-4">Today, 5 Jan</h1>
      <div class="w-full overflow-x-auto">
        <div class="flex w-full gap-3">
          <div
            v-for="n in 10"
            class="h-[280px] w-[200px] shrink-0 rounded-md bg-zinc-100"
          >
            <img
              src="https://picsum.photos/200/280"
              alt=""
              class="h-full w-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="py-7">
      <h1 class="t1 py-3">Tags</h1>
      <div class="flex flex-wrap gap-2">
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
      </div>
    </div>
    <div class="py-7">
      <h1 class="t1 py-3">Explore by date</h1>
      <div class="flex justify-between gap-5">
        <div>
          <p class="py-2 text-lg font-semibold">
            Jan 5 <span class="text-sm text-zinc-500">Monday</span>
          </p>
          <div class="flex flex-col gap-3">
            <div class="flex w-fit gap-3 rounded-lg bg-zinc-100 p-4">
              <div>
                <div>
                  <p class="text-sm text-zinc-400">11:00 AM</p>
                  <p class="max-w-[350px] font-semibold">
                    PRIMETIME ‘Good Time For Our Memory’ EXCLUSIVE FANCON
                  </p>
                  <p class="text-sm text-zinc-400">By Somsan</p>
                  <p class="text-sm text-zinc-400">At KMUTT</p>
                </div>
                <div class="pt-3">
                  <button class="rounded-md bg-zinc-300 px-2 text-sm">
                    Concert
                  </button>
                </div>
              </div>
              <div class="h-[100px] w-[100px] rounded-md bg-zinc-200">
                <img
                  src="https://picsum.photos/100/100"
                  alt=""
                  class="rounded-md"
                />
              </div>
            </div>
            <div class="flex w-fit gap-3 rounded-lg bg-zinc-100 p-4">
              <div>
                <div>
                  <p class="text-sm text-zinc-400">11:00 AM</p>
                  <p class="max-w-[350px] font-semibold">
                    PRIMETIME ‘Good Time For Our Memory’ EXCLUSIVE FANCON
                  </p>
                  <p class="text-sm text-zinc-400">By Somsan</p>
                  <p class="text-sm text-zinc-400">At KMUTT</p>
                </div>
                <div class="pt-3">
                  <button class="rounded-md bg-zinc-300 px-2 text-sm">
                    Concert
                  </button>
                </div>
              </div>
              <div class="h-[100px] w-[100px] bg-zinc-200">
                <img
                  src="https://picsum.photos/100/100"
                  alt=""
                  class="rounded-md"
                />
              </div>
            </div>
            <div class="flex w-fit gap-3 rounded-lg bg-zinc-100 p-4">
              <div>
                <div>
                  <p class="text-sm text-zinc-400">11:00 AM</p>
                  <p class="max-w-[350px] font-semibold">
                    PRIMETIME ‘Good Time For Our Memory’ EXCLUSIVE FANCON
                  </p>
                  <p class="text-sm text-zinc-400">By Somsan</p>
                  <p class="text-sm text-zinc-400">At KMUTT</p>
                </div>
                <div class="pt-3">
                  <button class="rounded-md bg-zinc-300 px-2 text-sm">
                    Concert
                  </button>
                </div>
              </div>
              <div class="h-[100px] w-[100px] rounded-md bg-zinc-200">
                <img
                  src="https://picsum.photos/100/100"
                  alt=""
                  class="rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="h-[250px] w-[250px] rounded-md bg-zinc-200"></div>
          <div class="h-[250px] w-[250px] rounded-md bg-zinc-200"></div>
        </div>
      </div>
    </div>
  </div>
</template>
