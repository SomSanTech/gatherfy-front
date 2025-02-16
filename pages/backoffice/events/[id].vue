<script setup lang="ts">
import Arrow from '~/components/icons/Arrow.vue';
import Cancle from '~/components/icons/Cancle.vue';
import CheckCircle from '~/components/icons/CheckCircle.vue';
import type { EditEvent, Event as EventDto } from '~/models/event';
import type { Tag } from '~/models/tag';

definePageMeta({
  layout: 'backoffice',
});
const originalEvent = ref<EventDto | null>(null);
const originalDateInput = ref();
const error = useError();
const event = ref();
const tags = ref<Tag[]>([]);
const route = useRoute();
const param = route.params.id;
const isLoading = ref(true);
const filteredTag = ref();
const inputTag = ref('');
const isDropdownVisible = ref(false);
const selectedTags = ref<Tag[]>([]);
const isChangeStatusComplete = ref();
const iframeSrc = ref();
const previewImage = ref('');
const compareExistTags = ref<Tag[]>([]);
const saveAlert = ref(false);
const saveAlertMessage = ref('');
const uploadFileName = ref();
const fileToUpload = ref();
const autoGenerateSlug = ref('');
const validateTagsInput = ref('');
const statusStyle = {
  success: {
    style: 'bg-[#16C098]/25 text-[#008767]',
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
function toEditEventDTO(event: EventDto): EditEvent {
  return {
    event_name: event.name,
    event_desc: event.description,
    event_detail: event.detail,
    event_start_date: event.start_date,
    event_end_date: event.end_date,
    event_ticket_start_date: event.ticket_start_date,
    event_ticket_end_date: event.ticket_end_date,
    event_registration_goal: event.registration_goal,
    event_location: event.location,
    event_google_map: event.map,
    event_capacity: event.capacity,
    event_slug: event.slug,
    event_image: event.image,
    event_owner: 2,
    tags: event.tags,
  };
}
const dateInput = ref({
  start_date: '',
  start_time: '',
  end_date: '',
  end_time: '',
  ticket_start_date: '',
  ticket_start_time: '',
  ticket_end_date: '',
  ticket_end_time: '',
});

const accessToken = useCookie('accessToken');

async function fetchData() {
  const fetchedData = await useFetchWithAuth(
    `v2/backoffice/events/${param}`,
    'GET',
    accessToken.value
  );
  const fetchedTags = await useFetchData(`v1/tags`, 'GET');
  if (fetchedData.error || fetchedTags.error) {
    error.value = fetchedData ? fetchedData : fetchedTags;
  } else {
    event.value = (await fetchedData.data) || [];
    originalEvent.value = JSON.parse(JSON.stringify(event.value));
    tags.value = (await fetchedTags.data) || [];
    selectedTags.value = event.value.tags;
    currentDateTime();
    compareExistTags.value = selectedTags.value.map((item: any) => ({
      ...item,
    }));
  }
}

async function currentDateTime() {
  if (event.value.ticket_start_date) {
    dateInput.value.ticket_start_date = useFormatDateTime(
      event.value.ticket_start_date,
      'ISOdate'
    );
    dateInput.value.ticket_start_time = useFormatDateTime(
      event.value.ticket_start_date,
      'time'
    );
    dateInput.value.ticket_end_date = useFormatDateTime(
      event.value.ticket_end_date,
      'ISOdate'
    );
    dateInput.value.ticket_end_time = useFormatDateTime(
      event.value.ticket_end_date,
      'time'
    );
    dateInput.value.start_date = useFormatDateTime(
      event.value.start_date,
      'ISOdate'
    );
    dateInput.value.start_time = useFormatDateTime(
      event.value.start_date,
      'time'
    );
    dateInput.value.end_date = useFormatDateTime(
      event.value.end_date,
      'ISOdate'
    );
    dateInput.value.end_time = useFormatDateTime(event.value.end_date, 'time');

    originalDateInput.value = JSON.parse(JSON.stringify(dateInput.value));
  }
}
function getFormattedTags(tags: Tag[]) {
  return tags.map(({ tag_id }) => tag_id);
}
function getChangedFields<T>(original: T, updated: T): Partial<T> {
  const changedFields: Partial<T> = {};
  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changedFields[key] = updated[key];
    }
  }
  return changedFields;
}

function getChangeTimeed(originalDateInput, dateInput) {
  const changedFields = getChangedFields(originalDateInput, dateInput);
  const updatedData = {};

  for (const key in changedFields) {
    if (key.includes('_date')) {
      const timeKey = key.replace('_date', '_time');

      // ถ้ามีค่าใหม่ของเวลา ใช้ค่าจาก dateInput
      // ถ้าไม่มี ให้ใช้ค่าของเวลาเดิมจาก originalDateInput
      const timeValue = dateInput[timeKey] ?? originalDateInput[timeKey];

      updatedData[key] = `${changedFields[key]}T${timeValue}`;
    }
  }

  return updatedData;
}

function transformEventData(input) {
  const fieldMap = {
    name: 'event_name',
    description: 'event_desc',
    detail: 'event_detail',
    start_date: 'event_start_date',
    end_date: 'event_end_date',
    ticket_start_date: 'event_ticket_start_date',
    ticket_end_date: 'event_ticket_end_date',
    registration_goal: 'event_registration_goal',
    location: 'event_location',
    map: 'event_google_map',
    capacity: 'event_capacity',
    slug: 'event_slug',
    image: 'event_image',
  };

  return Object.keys(input).reduce((acc, key) => {
    if (fieldMap[key]) {
      acc[fieldMap[key]] = input[key];
    } else if (
      [
        'start_date',
        'end_date',
        'ticket_start_date',
        'ticket_end_date',
      ].includes(key)
    ) {
      acc[fieldMap[key]] = new Date(input[key]).toISOString();
    } else if (key === 'tags' && Array.isArray(input[key])) {
      acc['tags'] = input[key].map((tag) => tag.tag_id);
    } else {
      acc[key] = input[key]; // ถ้าไม่มีใน fieldMap ก็เก็บไว้เหมือนเดิม
    }
    return acc;
  }, {});
}

const errorMsg = ref();
const fetchEventEdit = async () => {
  try {
    if (validateForm() && originalEvent.value) {
      const changedFields = getChangedFields(originalEvent.value, event.value);
      if (Object.keys(changedFields).length === 0) {
        console.log('No changes detected');
        return;
      }
      const getChangeTime = getChangeTimeed(
        originalDateInput.value,
        dateInput.value
      );
      if (Object.keys(changedFields).length === 0) {
        console.log('No changes detected');
        return;
      } else {
        changedFields;
      }
      const updatedChangedFields = { ...changedFields, ...getChangeTime };
      const dataDTO = transformEventData(updatedChangedFields);
      const formattedTags = await getFormattedTags(selectedTags.value);
      dataDTO.tags = formattedTags;

      const currentFileName = event.value.image.replace(
        'http://cp24us1.sit.kmutt.ac.th:7070/thumbnails/',
        ''
      );

      if (uploadFileName.value) {
        await useFetchDelete(`v1/files/delete/${currentFileName}`);
        dataDTO.event_image = uploadFileName.value;
        await useFetchUpload(
          `v1/files/upload`,
          fileToUpload.value,
          'thumbnails',
          accessToken.value
        );
      } else {
        dataDTO.event_image = currentFileName;
      }

      concatDateTime();
      const fetchedData = await useFetchWithAuth(
        `v2/backoffice/events/${param}`,
        'PUT',
        accessToken.value,
        dataDTO
      );
      if (fetchedData.errorData) {
        errorMsg.value = fetchedData.errorData;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (fetchedData) {
        console.log('Update successful');
      } else {
        console.log('Update failed');
      }
    }
  } finally {
    saveAlert.value = true;
    setTimeout(() => {
      saveAlert.value = false;
    }, 3000);
  }
};

// const fetchEventEdit = async () => {
//   console.log('fetchEventEdit called');
//   try {
//     if (validateForm()) {
//       const formattedTags = await getFormattedTags(selectedTags.value);
//       event.value.tags = await formattedTags;
//       const editEventDto = toEditEventDTO(event.value);
//       const currentFileName = editEventDto.event_image.replace(
//         'http://cp24us1.sit.kmutt.ac.th:7070/thumbnails/',
//         ''
//       );
//       if (uploadFileName.value) {
//         await useFetchDelete(`v1/files/delete/${currentFileName}`);
//         editEventDto.event_image = uploadFileName.value;
//         await useFetchUpload(
//           `v1/files/upload`,
//           fileToUpload.value,
//           'thumbnails',
//           accessToken.value
//         );
//       } else {
//         editEventDto.event_image = currentFileName;
//       }
//       concatDateTime();
//       const fetchedData = await useFetchWithAuth(
//         `v2/backoffice/events/${param}`,
//         'PUT',
//         accessToken.value,
//         editEventDto
//       );
//       if (fetchedData) {
//         isChangeStatusComplete.value = true;
//         saveAlertMessage.value = 'Your change are saved';
//       } else {
//         isChangeStatusComplete.value = false;
//         saveAlertMessage.value = 'Something went wrong';
//       }
//     } else {
//       window.scrollTo(0, 0);
//     }
//   } finally {
//     saveAlert.value = true;
//     setTimeout(() => {
//       saveAlert.value = false;
//     }, 3000);
//   }
// };
function filterTag(value: string) {
  const tagLeftFromEvent = tags.value.filter(
    (item) => !event.value.tags.includes(item.tag_title)
  );
  const tagLeft = tagLeftFromEvent.filter(
    (item) =>
      !selectedTags.value.some(
        (selectedTag) => selectedTag.tag_title === item.tag_title
      )
  );
  const filter = tagLeft?.filter((item) =>
    item.tag_title.toLowerCase().startsWith(value.toLowerCase())
  );
  filteredTag.value = filter;
}
function onSelectTag(tag: Tag) {
  isDropdownVisible.value = false;
  selectedTags.value.push(tag);
  filterTag('');
  inputTag.value = '';
  if (validateTagsInput.value) {
    validateTagsInput.value = '';
  }
}
function onDeleteSelectedTag(index: number) {
  selectedTags.value.splice(index, 1);
  filterTag('');
}
function slugify(eventName: string) {
  eventName = eventName.replace(/^\s+|\s+$/g, '');
  eventName = eventName.toLowerCase();
  autoGenerateSlug.value = eventName
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
function renderIframe(content: string) {
  const srcMatch = content.match(/src="([^"]+)"/);
  iframeSrc.value = srcMatch ? srcMatch[1] : '';
}
function handelFileUpload(file: Event) {
  console.log('file', file);

  const target = file.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    previewImage.value = URL.createObjectURL(file);
    uploadFileName.value = file.name;
    fileToUpload.value = file;
  }
}
function concatDateTime() {
  event.value.ticket_start_date = dateInput.value.ticket_start_date.concat(
    'T',
    dateInput.value.ticket_start_time
  );
  event.value.ticket_end_date = dateInput.value.ticket_end_date.concat(
    'T',
    dateInput.value.ticket_end_time
  );
  event.value.start_date = dateInput.value.start_date.concat(
    'T',
    dateInput.value.start_time
  );
  dateInput.value.end_time = dateInput.value.end_date.concat(
    'T',
    dateInput.value.end_time
  );
}

function getGenerateSlug() {
  if (!autoGenerateSlug.value) {
    slugify(event.value.name);
  }
  event.value.slug = autoGenerateSlug.value;
}
function validateForm() {
  if (selectedTags.value.length === 0) {
    validateTagsInput.value = '*Select at least 1 tag';
    return false;
  } else {
    return true;
  }
}
onMounted(async () => {
  try {
    isLoading.value = true;
    // await fetchData();
    await currentDateTime();
    renderIframe(event.value.map);
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  if (param) {
    fetchData();
  }
});
</script>

<template>
  <div class="ml-80 flex h-fit w-screen bg-ghost-white">
    <div
      class="mx-20 mb-16 mt-32 h-fit w-full rounded-3xl bg-white drop-shadow-lg"
    >
      <div class="p-12">
        <NuxtLink
          to="/backoffice/events"
          class="mb-5 flex items-center gap-2 text-dark-grey duration-200 hover:-ml-3"
        >
          <Arrow />
          <p class="b2">Back to event list</p>
        </NuxtLink>
        <div class="grid grid-cols-2">
          <h1 class="regis-detail-title t1">Event Detail</h1>
          <NuxtLink
            :to="{
              name: `backoffice-feedback-id`,
              params: { id: param },
            }"
            class="flex justify-end"
          >
            <BtnComp text="Manage Feedback" color="blue" />
          </NuxtLink>
        </div>
        <div
          v-if="errorMsg"
          class="b2 flex w-full shrink-0 flex-col gap-2 pt-4"
        >
          <p
            v-for="e in errorMsg.details"
            class="flex items-center gap-2 rounded-md bg-red-200 px-3 py-1 text-red-600"
          >
            <Cancle />{{ e }}
          </p>
        </div>
        <div v-if="isLoading" class="my-16 flex items-center justify-center">
          <span class="loader"></span>
        </div>
        <div v-else>
          <form @submit.prevent="fetchEventEdit">
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
                    class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/5 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.name"
                    @input="slugify(event.name)"
                    placeholder="Enter event name"
                    required
                  />
                </div>
                <div class="col-span-3">
                  <p class="b1">
                    Slug
                    <span class="b3 italic"
                      >*You can use
                      <span
                        @click="getGenerateSlug"
                        class="cursor-pointer text-burgundy underline"
                        >default slug</span
                      >
                      or customize your slug but slugs should be
                      easy-to-read</span
                    >
                  </p>
                  <input
                    type="text"
                    class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/5 px-4 py-2 shadow-inner focus:outline-none"
                    :placeholder="autoGenerateSlug"
                    v-model="event.slug"
                    pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
                    required
                  />
                </div>
                <div class="col-span-3">
                  <p class="b1">Tags</p>
                  <div
                    class="tag-input my-4 flex items-center gap-2 rounded-lg bg-lavender-gray/5 px-4 py-2 shadow-inner"
                  >
                    <div
                      v-for="(tag, index) of selectedTags"
                      class="b2 flex w-fit cursor-pointer items-center gap-2 rounded-lg border bg-white px-2 py-1 duration-100"
                    >
                      {{ tag.tag_title }}
                      <Cancle
                        class="m-1 rounded-full duration-150 hover:bg-burgundy hover:text-white"
                        @click="onDeleteSelectedTag(index)"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        id="add-tag"
                        class="b2 item relative bg-transparent px-2 py-1 focus:outline-none"
                        @input="filterTag(inputTag)"
                        @focus="isDropdownVisible = true"
                        v-model="inputTag"
                        placeholder="+ Add tag"
                        @click="filterTag(inputTag)"
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
                            @click="onSelectTag(tag)"
                            @blur="isDropdownVisible = false"
                          >
                            {{ tag.tag_title }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-3 col-start-1">
                  <p class="b1">Event Thumbnail</p>
                  <div class="my-4 flex text-center">
                    <label
                      for="upload"
                      class="w-full cursor-pointer border-2 border-dashed py-10"
                    >
                      <div v-if="!previewImage">
                        <img
                          :src="`${event?.image}`"
                          class="m-auto h-[400px] object-cover"
                        />
                      </div>
                      <img
                        v-if="previewImage"
                        :src="previewImage"
                        class="m-auto h-[400px] object-cover"
                      />
                    </label>
                    <input
                      type="file"
                      id="upload"
                      accept="image/*"
                      class="hidden"
                      @change="handelFileUpload($event)"
                    />
                  </div>
                </div>
                <div class="col-span-3">
                  <p class="b1">Event Description</p>
                  <input
                    type="text"
                    class="event-detail-desc b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/5 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.description"
                    placeholder="Enter event description"
                    required
                  />
                </div>
                <div class="col-span-3">
                  <p class="b1">Event Detail</p>
                  <textarea
                    rows="8"
                    type="text"
                    class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/5 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.detail"
                    placeholder="Enter event detail"
                    required
                  />
                </div>
                <div class="">
                  <p class="b1">Ticket Start Date</p>
                  <div class="my-4 flex gap-3">
                    <input
                      type="date"
                      class="b2 rounded-lg border bg-lavender-gray/5 px-4 py-2 shadow-inner"
                      required
                      v-model="dateInput.ticket_start_date"
                    />
                    <input
                      type="time"
                      class="b2 rounded-lg border bg-lavender-gray/5 px-4 py-2 shadow-inner"
                      required
                      v-model="dateInput.ticket_start_time"
                    />
                  </div>
                </div>
                <div class="">
                  <p class="b1">Ticket End Date</p>
                  <div class="my-4 flex gap-3">
                    <input
                      type="date"
                      class="b2 rounded-lg border bg-lavender-gray/5 px-4 py-2 shadow-inner"
                      required
                      v-model="dateInput.ticket_end_date"
                    />
                    <input
                      type="time"
                      class="b2 rounded-lg border bg-lavender-gray/5 px-4 py-2 shadow-inner"
                      required
                      v-model="dateInput.ticket_end_time"
                    />
                  </div>
                </div>
                <div class="col-start-1">
                  <p class="b1">Event Start Date</p>
                  <div class="my-4 flex gap-3">
                    <input
                      type="date"
                      class="b2 rounded-lg border bg-lavender-gray/5 px-4 py-2 shadow-inner"
                      required
                      v-model="dateInput.start_date"
                    />
                    <input
                      type="time"
                      class="b2 rounded-lg border bg-lavender-gray/5 px-4 py-2 shadow-inner"
                      required
                      v-model="dateInput.start_time"
                    />
                  </div>
                </div>
                <div class="">
                  <p class="b1">Event End Date</p>
                  <div class="my-4 flex gap-3">
                    <input
                      type="date"
                      class="b2 rounded-lg border bg-lavender-gray/5 px-4 py-2 shadow-inner"
                      required
                      v-model="dateInput.end_date"
                    />
                    <input
                      type="time"
                      class="b2 rounded-lg border bg-lavender-gray/5 px-4 py-2 shadow-inner"
                      required
                      v-model="dateInput.end_time"
                    />
                  </div>
                </div>
                <div class="col-span-1 col-start-1">
                  <p class="b1">Capacity</p>
                  <input
                    type="number"
                    class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/5 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.capacity"
                    placeholder="The maximum number of people"
                    required
                  />
                </div>
                <div class="col-span-1">
                  <p class="b1">Goal</p>
                  <input
                    type="number"
                    class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/5 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.registration_goal"
                    placeholder="Registration goal for reference"
                    required
                  />
                </div>
                <div class="col-span-3">
                  <p class="b1">Location</p>
                  <input
                    type="text"
                    class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/5 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.location"
                    placeholder="Enter location name"
                    required
                  />
                </div>
                <div class="col-span-3">
                  <p class="b1">Map</p>
                  <textarea
                    rows="5"
                    type="text"
                    class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/5 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.map"
                    @input="renderIframe(event.map)"
                    required
                    placeholder='&lt;iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8730478848183!2d100.54497267612477!3d13.726134986663078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f2476aee2a3%3A0x6e91389d33667ab8!2sOne%20Bangkok!5e0!3m2!1sen!2sth!4v1732998492170!5m2!1sen!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"&gt;&lt;/iframe&gt;'
                  />
                  <div v-if="iframeSrc">
                    <iframe
                      :src="iframeSrc"
                      class="h-[400px] w-full"
                      style="border: 0"
                      allowfullscreen="false"
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    >
                    </iframe>
                  </div>
                </div>
              </div>
              <div class="flex justify-end gap-5">
                <BtnComp text="Save" color="green" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div
    :class="
      saveAlert ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    "
    class="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-[#16C098]/25 px-20 py-3 text-[#008767] duration-500"
    role="alert"
  >
    <p class="b2">Your change are saved</p>
  </div>
</template>

<style scoped></style>
