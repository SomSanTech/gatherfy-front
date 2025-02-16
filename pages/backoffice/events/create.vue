<script setup lang="ts">
import Arrow from '~/components/icons/Arrow.vue';
import Cancle from '~/components/icons/Cancle.vue';
import CheckCircle from '~/components/icons/CheckCircle.vue';
import type { EditEvent } from '~/models/event';
import type { Tag } from '~/models/tag';
import type { UserProfile } from '~/models/userProfile';

definePageMeta({
  layout: 'backoffice',
});

const router = useRouter();
const error = useError();
const event = ref<EditEvent>({
  event_name: '',
  event_desc: '',
  event_detail: '',
  event_start_date: '',
  event_end_date: '',
  event_ticket_start_date: '',
  event_ticket_end_date: '',
  event_location: '',
  event_google_map: '',
  event_capacity: 0,
  event_registration_goal: 0,
  event_slug: '',
  event_image: '',
  event_owner: 0,
  tags: [],
});

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

const validateInput = ref({
  name: true,
  nameLength: true,
  slug: true,
  slugLength: true,
  tag: true,
  image: true,
  desc: true,
  detail: true,
  ticketStart: true,
  ticketEnd: true,
  ticketValid: true,
  startDate: true,
  endDate: true,
  dateValid: true,
  capacity: true,
  goal: true,
  location: true,
  map: true,
});

const validateInputErrText = ref({
  name: '*Please enter the event name.',
  nameLength: '*Please keep event name within 255 characters.',
  slug: '*Please enter the event slug.',
  slugLength: '*Please keep event slug within 100 characters.',
  tag: '*Please provide at least one tag.',
  image: '*Please upload a valid image.',
  desc: '*Please provide a short event description.',
  detail: '*Please provide detailed event information.',
  ticketStart: '*Please specify the ticket sales start date.',
  ticketEnd: '*Please specify the ticket sales end date.',
  ticketValid: '*Ticket sales must end after they start.',
  startDate: '*Please enter the event start date.',
  endDate: '*Please enter the event end date.',
  dateValid: '*The event must end after it starts.',
  capacity: '*Please specify the event capacity.',
  goal: '*Please describe the event’s goal.',
  location: '*Please provide the event location.',
  map: '*Please enter a valid map link or coordinates.',
});

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
const tags = ref<Tag[]>([]);
const isChangeStatusComplete = ref();
const filteredTag = ref();
const isDropdownVisible = ref(false);
const inputTag = ref('');
const isLoading = ref(false);
const iframeSrc = ref();
const selectedTags = ref<Tag[]>([]);
const previewImage = ref();
const uploadFileName = ref();
const fileToUpload = ref();
const autoGenerateSlug = ref('');
const validateTagsInput = ref('');
const validateFileInput = ref('');
const profileData = useCookie<UserProfile>('profileData');
const accessToken = useCookie('accessToken');
const errorMsg = ref();
async function fetchData() {
  const fetchedTags = await useFetchData(`v1/tags`, 'GET');
  if (fetchedTags.error) {
    error.value = fetchedTags.error;
  } else {
    tags.value = fetchedTags.data || [];
  }
}

async function fetchEventCreate() {
  const formattedTags = getFormattedTags(selectedTags.value);
  event.value.tags = formattedTags;
  concatDateTime();

  if (!validateForm()) {
    event.value.event_image = uploadFileName.value;
    const fetchedData = await useFetchWithAuth(
      `v2/backoffice/events`,
      'POST',
      accessToken.value,
      event.value
    );

    let fetchedUpload;
    console.log('fetchData status', fetchedData.status);
    if (fetchedData.errorData) {
      errorMsg.value = fetchedData.errorData;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (fetchedData.status === 200) {
      console.log('dai ja');
      fetchedUpload = await useFetchUpload(
        `v1/files/upload`,
        fileToUpload.value,
        'thumbnails',
        accessToken.value
      );
    }
    if (fetchedData.data && fetchedUpload) {
      router.push('/backoffice/events');
    } else {
      isChangeStatusComplete.value = false;
    }
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function validateForm() {
  console.log('event', event.value);

  const checkField = {
    name: event.value.event_name.trim(),
    nameLength: event.value.event_name.trim().length <= 255,
    slug: event.value.event_slug.trim(),
    slugLength: event.value.event_slug.trim().length <= 100,
    tag: selectedTags.value.length > 0,
    image: fileToUpload.value,
    desc: event.value.event_desc.trim(),
    detail: event.value.event_detail.trim(),
    ticketStart: event.value.event_ticket_start_date !== 'T',
    ticketEnd: event.value.event_ticket_end_date !== 'T',
    ticketValid:
      new Date(event.value.event_ticket_end_date).getTime() >
      new Date(event.value.event_ticket_start_date).getTime(),
    startDate: event.value.event_start_date !== 'T',
    endDate: event.value.event_end_date !== 'T',
    dateValid:
      new Date(event.value.event_end_date).getTime() >
      new Date(event.value.event_start_date).getTime(),
    capacity: event.value.event_capacity > 0,
    goal: event.value.event_registration_goal > 0,
    location: event.value.event_location.trim(),
    map: true,
  };

  Object.entries(checkField).forEach(([key, value]) => {
    const typedKey = key as keyof typeof checkField;
    validateInput.value[typedKey] = Boolean(value);
  });
  const hasError = Object.values(validateInput.value).includes(false);

  return hasError;
}

function getFormattedTags(tags: Tag[]) {
  return tags.map(({ tag_id }) => tag_id);
}

function filterTag(value: string) {
  const tagLeft = tags.value.filter(
    (item) =>
      !selectedTags.value.some(
        (selectedTag) => selectedTag.tag_title === item.tag_title
      )
  );
  const filter = tagLeft?.filter((item) =>
    item.tag_title.toLowerCase().startsWith(value.toLowerCase())
  );
  filteredTag.value = filter;
  console.log(filteredTag.value);
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
  const target = file.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    previewImage.value = URL.createObjectURL(file);
    uploadFileName.value = file.name;
    fileToUpload.value = file;
    if (validateFileInput) {
      validateFileInput.value = '';
    }
  }
}

function concatDateTime() {
  event.value.event_ticket_start_date =
    dateInput.value.ticket_start_date.concat(
      'T',
      dateInput.value.ticket_start_time
    );
  event.value.event_ticket_end_date = dateInput.value.ticket_end_date.concat(
    'T',
    dateInput.value.ticket_end_time
  );
  event.value.event_start_date = dateInput.value.start_date.concat(
    'T',
    dateInput.value.start_time
  );
  event.value.event_end_date = dateInput.value.end_date.concat(
    'T',
    dateInput.value.end_time
  );
}

function getAutoGenerateSlug() {
  if (!autoGenerateSlug.value) {
    slugify(event.value.event_name);
  }
  event.value.event_slug = autoGenerateSlug.value;
}

onMounted(async () => {
  try {
    isLoading.value = true;
    await fetchData();
    console.log(profileData.value);
    if (profileData.value) {
      event.value.event_owner = profileData.value.users_id;
    }
  } finally {
    isLoading.value = false;
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
          <h1 class="regis-detail-title t1">Create Event</h1>
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
          <div>
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
                  <div class="flex items-center justify-between">
                    <p class="b1">
                      Event Name
                      <span
                        v-if="!validateInput.name || !validateInput.nameLength"
                        class="b3 italic text-burgundy"
                      >
                        {{
                          !validateInput.name
                            ? validateInputErrText.name
                            : !validateInput.nameLength
                              ? validateInputErrText.nameLength
                              : ''
                        }}</span
                      >
                    </p>
                    <p class="b3">
                      <span
                        :class="
                          event.event_name.length > 255 ? 'text-burgundy' : ''
                        "
                      >
                        {{ event.event_name.length }} </span
                      ><span> / 255</span>
                    </p>
                  </div>
                  <input
                    type="text"
                    class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.event_name"
                    @input="slugify(event.event_name)"
                    placeholder="Enter event name"
                    required
                  />
                </div>
                <div class="col-span-3">
                  <div class="flex items-center justify-between">
                    <p class="b1 flex items-baseline gap-2">
                      Slug
                      <span
                        v-if="!validateInput.slug || !validateInput.slugLength"
                        class="b3 italic text-burgundy"
                      >
                        {{
                          !validateInput.slug
                            ? validateInputErrText.slug
                            : !validateInput.slugLength
                              ? validateInputErrText.slugLength
                              : ''
                        }}</span
                      >
                    </p>
                    <p class="b3">
                      <span
                        :class="
                          event.event_slug.length > 255 ? 'text-burgundy' : ''
                        "
                      >
                        {{ event.event_slug.length }} </span
                      ><span> / 100</span>
                    </p>
                  </div>
                  <span class="b3 italic"
                    >*You can use
                    <span
                      @click="getAutoGenerateSlug"
                      class="cursor-pointer text-burgundy underline"
                      >default slug</span
                    >
                    or customize your slug but slugs should be
                    'easy-to-read'</span
                  >
                  <input
                    type="text"
                    class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                    :placeholder="autoGenerateSlug"
                    v-model="event.event_slug"
                    pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
                    required
                  />
                </div>
                <div class="col-span-3">
                  <p class="b1">
                    Tags
                    <span
                      v-if="!validateInput.tag"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.tag }}</span
                    >
                  </p>
                  <div
                    class="tag-input my-4 flex items-center gap-2 rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner"
                  >
                    <div
                      v-for="(tag, index) of selectedTags"
                      class="b2 flex w-fit cursor-pointer items-center gap-2 rounded-lg border bg-white px-2 py-1 duration-100"
                    >
                      {{ tag.tag_title }}
                      <Cancle
                        class="m-1 rounded-full duration-150 hover:bg-burgundy hover:text-white"
                        @click="
                          onDeleteSelectedTag(index),
                            (isDropdownVisible = false)
                        "
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
                          <button @click="onSelectTag(tag)">
                            {{ tag.tag_title }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-3 col-start-1">
                  <p class="b1">
                    Event Thumbnail
                    <span
                      v-if="!validateInput.image"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.image }}</span
                    >
                  </p>
                  <div class="my-4 flex text-center">
                    <label
                      for="upload"
                      class="w-full cursor-pointer border-2 border-dashed py-10"
                      :class="validateFileInput ? 'border-burgundy' : ''"
                    >
                      <div v-if="!previewImage">
                        <img
                          src="/components/images/empty-image.png"
                          class="m-auto h-[250px] object-cover"
                        />
                        <p class="b2">Choose image here</p>
                        <span class="b3">Max size: 100 MB.</span>
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
                  <p class="b1">
                    Event Description
                    <span
                      v-if="!validateInput.desc"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.desc }}</span
                    >
                  </p>
                  <input
                    type="text"
                    class="event-detail-desc b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.event_desc"
                    placeholder="Enter event description"
                    required
                  />
                </div>
                <div class="col-span-3">
                  <p class="b1">
                    Event Detail
                    <span
                      v-if="!validateInput.detail"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.detail }}</span
                    >
                  </p>
                  <textarea
                    rows="8"
                    type="text"
                    class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.event_detail"
                    placeholder="Enter event detail"
                    required
                  />
                </div>
                <div class="">
                  <p class="b1">
                    Ticket Start Date
                    <span
                      v-if="!validateInput.ticketStart"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.ticketStart }}</span
                    >
                  </p>
                  <div class="my-4 flex gap-3">
                    <input
                      type="date"
                      class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                      v-model="dateInput.ticket_start_date"
                      required
                    />
                    <input
                      type="time"
                      class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                      v-model="dateInput.ticket_start_time"
                      required
                    />
                  </div>
                  <span
                    v-if="!validateInput.ticketValid"
                    class="b3 italic text-burgundy"
                  >
                    {{ validateInputErrText.ticketValid }}</span
                  >
                </div>
                <div class="">
                  <p class="b1">
                    Ticket End Date
                    <span
                      v-if="!validateInput.ticketEnd"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.ticketEnd }}</span
                    >
                  </p>
                  <div class="my-4 flex gap-3">
                    <input
                      type="date"
                      class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                      v-model="dateInput.ticket_end_date"
                      required
                    />
                    <input
                      type="time"
                      class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                      v-model="dateInput.ticket_end_time"
                      required
                    />
                  </div>
                </div>
                <div class="col-start-1">
                  <p class="b1">
                    Event Start Date
                    <span
                      v-if="!validateInput.startDate"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.startDate }}</span
                    >
                  </p>
                  <div class="my-4 flex gap-3">
                    <input
                      type="date"
                      class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                      v-model="dateInput.start_date"
                      required
                    />
                    <input
                      type="time"
                      class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                      v-model="dateInput.start_time"
                      required
                    />
                  </div>
                  <span
                    v-if="!validateInput.dateValid"
                    class="b3 italic text-burgundy"
                  >
                    {{ validateInputErrText.dateValid }}</span
                  >
                </div>
                <div class="">
                  <p class="b1">
                    Event End Date
                    <span
                      v-if="!validateInput.endDate"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.endDate }}</span
                    >
                  </p>
                  <div class="my-4 flex gap-3">
                    <input
                      type="date"
                      class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                      v-model="dateInput.end_date"
                      required
                    />
                    <input
                      type="time"
                      class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                      v-model="dateInput.end_time"
                      required
                    />
                  </div>
                </div>

                <div class="col-span-1 col-start-1">
                  <p class="b1">
                    Capacity
                    <span
                      v-if="!validateInput.capacity"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.capacity }}</span
                    >
                  </p>
                  <input
                    type="number"
                    class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.event_capacity"
                    placeholder="The maximum number of people"
                    required
                  />
                </div>
                <div class="col-span-1">
                  <p class="b1">
                    Goal
                    <span
                      v-if="!validateInput.goal"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.goal }}</span
                    >
                  </p>
                  <input
                    type="number"
                    class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.event_registration_goal"
                    placeholder="Registration goal for reference"
                    required
                  />
                </div>
                <div class="col-span-3">
                  <p class="b1">
                    Location
                    <span
                      v-if="!validateInput.location"
                      class="b3 italic text-burgundy"
                    >
                      {{ validateInputErrText.location }}</span
                    >
                  </p>
                  <input
                    type="text"
                    class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.event_location"
                    placeholder="Enter location name"
                    required
                  />
                </div>
                <div class="col-span-3">
                  <p class="b1">Map</p>
                  <textarea
                    rows="5"
                    type="text"
                    class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                    v-model="event.event_google_map"
                    placeholder='&lt;iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8730478848183!2d100.54497267612477!3d13.726134986663078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f2476aee2a3%3A0x6e91389d33667ab8!2sOne%20Bangkok!5e0!3m2!1sen!2sth!4v1732998492170!5m2!1sen!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"&gt;&lt;/iframe&gt;'
                    @input="renderIframe(event.event_google_map)"
                    required
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
              <div class="flex justify-end gap-5" @click="fetchEventCreate">
                <input
                  type="submit"
                  value="Save"
                  class="b3 w-fit rounded-md bg-[#16C098]/25 px-6 py-2 font-semibold text-[#008767] duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
