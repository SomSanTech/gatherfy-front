<script setup lang="ts">
import type { Tag } from '~/models/tag';
import Arrow from '../icons/Arrow.vue';
import Cancle from '../icons/Cancle.vue';
import CheckCircle from '../icons/CheckCircle.vue';
import type { EditEvent } from '~/models/event';
const error = useError();
const route = useRoute();
const param = route.params.id;
const isLoading = ref(true);
const event = ref();
const eventBody = ref();
const isShowStatus = ref(true);
const isChangeStatusComplete = ref();
const isShowStatusBy = ref(false);

const selectedEventTimeStyle = {
  active: 'text-light-grey font-semibold bg-burgundy',
  notActive: 'text-black',
};
const statusStyle = {
  success: {
    style: 'bg-green-light/25 text-green-dark',
    text: 'Status has been updated',
  },
  failed: {
    style: 'bg-[#ef4444]/25 text-[#ef4444]',
    text: 'Sorry, something went wrong',
  },
  noChange: {
    style: 'bg-[#E8E8E8] text-[#939393]',
    text: 'Sorry, nothing changed',
  },
};

// ENUM('Awaiting Check-in', 'Checked in', 'Unattended')
const props = defineProps<{
  event?: EditEvent;
  tags?: Tag[];
  fetchEdit: Function;
}>();
const filteredTag = ref();
const inputTag = ref('');
const isDropdownVisible = ref(false);

function filterTag(value: string) {
  const tagLeft = props.tags?.filter(
    (item) => !props.event?.tags.includes(item.tag_title)
  );
  const filter = tagLeft?.filter((item) =>
    item.tag_title.toLowerCase().startsWith(value.toLowerCase())
  );
  filteredTag.value = filter;
}

function selectTag(tag: {}) {
  isDropdownVisible.value = false;
}

onMounted(() => {
  try {
    isLoading.value = true;
    // fetchData();
    isChangeStatusComplete.value = null;
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  if (param) {
    // fetchData();
    isChangeStatusComplete.value = null;
  }
});
</script>

<template>
  <!-- <div v-if="isLoading" class="my-16 flex items-center justify-center">
    <span class="loader"></span>
  </div> -->
  <div>
    <div class="mt-10 grid grid-cols-3 gap-x-16 gap-y-5">
      <div
        v-if="isChangeStatusComplete != null"
        :class="`col-span-3 flex items-center gap-2 rounded-lg px-4 py-2 ${isChangeStatusComplete === true ? statusStyle.success.style : statusStyle.failed.style}`"
      >
        <CheckCircle />
        <p class="alert-text b2">
          {{
            isChangeStatusComplete === true
              ? statusStyle.success.text
              : statusStyle.failed.text
          }}
        </p>
      </div>
      <div class="col-span-3">
        <p class="b1">Event Name</p>
        <input
          type="text"
          class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          v-model="event.name"
        />
      </div>
      <div class="col-span-3">
        <p class="b1">Slug</p>
        <input
          type="text"
          class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          v-model="event.slug"
        />
      </div>
      <div class="col-span-3">
        <p class="b1">Tags</p>
        <!-- <div class="flex items-center gap-2 my-4 rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner">
          <div v-for="tag of props.event?.tags"
            class="flex items-center gap-2 b2 border rounded-lg px-2 py-1 w-fit bg-white cursor-pointer duration-100">
            {{ tag }}
            <Cancle />
          </div>
          <div id="add-tag"
            class="relative b2 font-medium text-lavender-gray px-2 py-1 hover:bg-[#e3e5e9] rounded-lg cursor-pointer duration-150 hover:li">
            + Add tag
            <div id="tag-dropdown" class="absolute bg-white border rounded-lg left-0 mt-2">
              <div v-for="tag of tags"
                class="flex items-center justify-between gap-2 b2 px-4 py-1 cursor-pointer duration-100 text-black border-t">
                <label :for="tag.tag_title">{{ tag.tag_title }}</label><input type="checkbox" :id="tag.tag_title" :name="tag.tag_title" :value="tag.tag_title" />
              </div>
            </div>
          </div>
        </div> -->
        <div
          class="tag-input my-4 flex items-center gap-2 rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
        >
          <div
            v-for="tag of props.event?.tags"
            class="b2 flex w-fit cursor-pointer items-center gap-2 rounded-lg border bg-white px-2 py-1 duration-100"
          >
            {{ tag }}
            <Cancle />
          </div>
          <div>
            <input
              type="text"
              id="add-tag"
              class="b2 item relative bg-[#F8FBFF] px-2 py-1 focus:outline-none"
              @input="filterTag(inputTag)"
              @focus="isDropdownVisible = true"
              v-model="inputTag"
              placeholder="+ Add tag"
            />
            <div
              v-if="isDropdownVisible"
              class="absolute mt-2 rounded-lg border bg-white"
            >
              <div
                v-for="tag of filteredTag"
                class="b2 z-50 flex cursor-pointer items-center justify-between gap-2 border-t px-5 py-2 text-black duration-100 hover:bg-[#d0d2d4]"
              >
                <button
                  @click="selectTag(tag)"
                  @blur="isDropdownVisible = false"
                >
                  {{ tag.tag_title }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-3">
        <p class="b1">Event Description</p>
        <input
          type="text"
          class="event-detail-desc b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          v-model="event.description"
        />
      </div>
      <div class="col-span-3">
        <p class="b1">Event Detail</p>
        <textarea
          rows="8"
          type="text"
          class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          v-model="event.detail"
        />
      </div>
      <!-- <div class="">
        <p class="b1">Ticket Start Date</p>
        <div class="flex gap-3 my-4">
          <input type="date" class="b2 border px-4 py-2 bg-[#F8FBFF] shadow-inner rounded-lg" required :value="useFormatDateTime(props.event?.ticket_start_date, 'ISOdate')">
          <input type="time" class="b2 border px-4 py-2 bg-[#F8FBFF] shadow-inner rounded-lg" required :value="props.event?.ticket_start_date ? useFormatDateTime(props.event.ticket_start_date, 'time') : ''">
        </div>
      </div>
      <div class="">
        <p class="b1">Ticket End Date</p>
        <div class="flex gap-3 my-4">
          <input type="date" class="b2 border px-4 py-2 bg-[#F8FBFF] shadow-inner rounded-lg" required :value="useFormatDateTime(props.event?.ticket_end_date, 'ISOdate')">
          <input type="time" class="b2 border px-4 py-2 bg-[#F8FBFF] shadow-inner rounded-lg" required :value="props.event?.ticket_end_date ? useFormatDateTime(props.event.ticket_end_date, 'time') : ''">
        </div>
      </div> -->
      <!-- <div class="col-start-1">
        <p class="b1">Event Start Date</p>
        <div class="flex gap-3 my-4">
          <input type="date" class="b2 border px-4 py-2 bg-[#F8FBFF] shadow-inner rounded-lg" required
            :value="useFormatDateTime(props.event?.start_date, 'ISOdate')">
          <input type="time" class="b2 border px-4 py-2 bg-[#F8FBFF] shadow-inner rounded-lg" required
            :value="props.event?.start_date ? useFormatDateTime(props.event.start_date, 'time') : ''">
        </div>
      </div>
      <div class="">
        <p class="b1">Event End Date</p>
        <div class="flex gap-3 my-4">
          <input type="date" class="b2 border px-4 py-2 bg-[#F8FBFF] shadow-inner rounded-lg" required
            :value="useFormatDateTime(props.event?.end_date, 'ISOdate')">
          <input type="time" class="b2 border px-4 py-2 bg-[#F8FBFF] shadow-inner rounded-lg" required
            :value="props.event?.start_date ? useFormatDateTime(props.event.end_date, 'time') : ''">
        </div>
      </div> -->
      <div class="col-span-1 col-start-1">
        <p class="b1">Capacity</p>
        <input
          type="number"
          class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          v-model="event.capacity"
        />
      </div>
      <div class="col-span-1">
        <p class="b1">Goal</p>
        <input
          type="number"
          class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          v-model="event.capacity"
        />
      </div>
      <div class="col-span-3">
        <p class="b1">Location</p>
        <input
          type="text"
          class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          v-model="event.location"
        />
      </div>
      <div class="col-span-3">
        <p class="b1">Map</p>
        <textarea
          rows="6"
          type="text"
          class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          v-model="event.map"
        />
        <div v-html="props.event?.map"></div>
      </div>
    </div>
    <div class="flex justify-end gap-5">
      <BtnComp text="Save" @click="fetchEdit()" color="green" />
    </div>
  </div>
</template>
<style>
#add-tag:focus #tag-dropdown {
  display: block;
}

#tag-dropdown {
  display: none;
}
</style>
