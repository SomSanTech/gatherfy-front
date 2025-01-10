<script setup lang="ts">
import EventDetail from '~/components/backoffice/EventDetail.vue';
import Arrow from '~/components/icons/Arrow.vue';
import Cancle from '~/components/icons/Cancle.vue';
import CheckCircle from '~/components/icons/CheckCircle.vue';
import type { EditEvent } from '~/models/event';
import type { Tag } from '~/models/tag';

definePageMeta({
  layout: 'backoffice',
});

const route = useRoute();
const param = route.params.id;
const error = useError();
const event = ref({
  name: '',
  description: '',
  detail: '',
  start_date: '',
  end_date: '',
  ticket_start_date: '',
  ticket_end_date: '',
  location: '',
  map: '',
  capacity: '',
  status: '',
  slug: '',
  image: '',
  owner: '',
  tags: '',
});
const tags = ref<Tag[]>([]);
const isChangeStatusComplete = ref();
const filteredTag = ref();
const isDropdownVisible = ref(false);
const inputTag = ref('');
const isLoading = ref(false);
const isIframeLoaded = ref(false);
const iframeSrc = ref();
const selectedFile = ref('');
const selectedTags = ref<Tag[]>([]);
const previewImage = ref();
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
const fetchData = async () => {
  const fetchedTags = await useFetchData(`v1/tags`);
  if (fetchedTags.error) {
    error.value = fetchedTags;
  } else {
    tags.value = fetchedTags || [];
  }
};
const fetchEventEdit = async () => {
  const fetchedData = await useFetchCreateUpdate(
    `v1/event/${param}`,
    'PUT',
    event.value
  );
  if (fetchedData.status === 200) {
    isChangeStatusComplete.value = true;
  } else {
    isChangeStatusComplete.value = false;
  }
  console.log(event.value);
};

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
  console.log(tag);
  isDropdownVisible.value = false;
  selectedTags.value.push(tag);
  filterTag('');
  inputTag.value = '';
  console.log(selectedTags.value);
}
function onDeleteSelectedTag(index: number) {
  selectedTags.value.splice(index, 1);
  filterTag('');
  console.log(selectedTags.value);
}
function slugify(eventName: string) {
  eventName = eventName.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
  eventName = eventName.toLowerCase(); // convert string to lowercase
  event.value.slug = eventName
    .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}
function renderIframe(content: string) {
  const srcMatch = content.match(/src="([^"]+)"/);
  iframeSrc.value = srcMatch ? srcMatch[1] : '';
}
// function iframeLoaded() {
//       isIframeLoaded.value = true;
//       console.log('Iframe has finished loading');
//     }
function handelFileUpload(event: Event) {
  // return URL.createObjectURL(file)
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    previewImage.value = URL.createObjectURL(file);
    console.log(previewImage.value);
  }
}
// const minioClient = new Minio.Client({
//   endPoint: 'http://cp24us1.sit.kmutt.ac.th',
//   port: 9000,
//   useSSL: true,
//   accessKey: 'GkoSvS50hlhyECckuivW',
//   secretKey: 'HKPlSB9ER5vd50BIxIvGuiES1u9wrSGLhid93XmP',
// })
// const minioClient = new Minio.Client({
//   endPoint: 'play.min.io',
//   port: 9000,
//   useSSL: true,
//   accessKey: 'Q3AM3UQ867SPQQA43P2F',
//   secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
// })
onMounted(async () => {
  try {
    isLoading.value = true;
    await fetchData();
    // const buckets = await minioClient.listBuckets()
    // console.log(buckets)
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
          <!-- <NuxtLink :to="{
              name: `backoffice-feedback-id`,
              params: { id: param },
            }" class="flex justify-end">
              <BtnComp text="Manage Feedback" color="blue" />
            </NuxtLink> -->
        </div>
        <div v-if="isLoading" class="my-16 flex items-center justify-center">
          <span class="loader"></span>
        </div>
        <div v-else>
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
                  class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                  v-model="event.name"
                  @input="slugify(event.name)"
                />
              </div>
              <div class="col-span-3">
                <p class="b1">
                  Slug
                  <span class="b3 italic"
                    >*You can customize your slug but slugs should be
                    easy-to-read</span
                  >
                </p>
                <input
                  type="text"
                  class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                  v-model="event.slug"
                />
              </div>
              <div class="col-span-3">
                <p class="b1">Tags</p>
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
                        onDeleteSelectedTag(index), (isDropdownVisible = false)
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
                <p class="b1">Event Thumbnail</p>
                <div class="my-4 flex text-center">
                  <label
                    for="upload"
                    class="w-full cursor-pointer border-2 border-dashed py-10"
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
                <p class="b1">Event Description</p>
                <input
                  type="text"
                  class="event-detail-desc b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                  v-model="event.description"
                />
              </div>
              <div class="col-span-3">
                <p class="b1">Event Detail</p>
                <textarea
                  rows="8"
                  type="text"
                  class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                  v-model="event.detail"
                />
              </div>
              <div class="">
                <p class="b1">Ticket Start Date</p>
                <div class="my-4 flex gap-3">
                  <input
                    type="date"
                    class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                    required
                  />
                  <input
                    type="time"
                    class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                    required
                  />
                </div>
              </div>
              <div class="">
                <p class="b1">Ticket End Date</p>
                <div class="my-4 flex gap-3">
                  <input
                    type="date"
                    class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                    required
                  />
                  <input
                    type="time"
                    class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                    required
                  />
                </div>
              </div>
              <div class="col-start-1">
                <p class="b1">Event Start Date</p>
                <div class="my-4 flex gap-3">
                  <input
                    type="date"
                    class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                    required
                  />
                  <input
                    type="time"
                    class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                    required
                  />
                </div>
              </div>
              <div class="">
                <p class="b1">Event End Date</p>
                <div class="my-4 flex gap-3">
                  <input
                    type="date"
                    class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                    required
                  />
                  <input
                    type="time"
                    class="b2 rounded-lg border bg-lavender-gray/10 px-4 py-2 shadow-inner"
                    required
                  />
                </div>
              </div>
              <div class="col-span-1 col-start-1">
                <p class="b1">Capacity</p>
                <input
                  type="number"
                  class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                  v-model="event.capacity"
                  placeholder="The maximum number of people"
                />
              </div>
              <div class="col-span-1">
                <p class="b1">Goal</p>
                <input
                  type="number"
                  class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                  v-model="event.capacity"
                  placeholder="Registration goal for reference, no impact on event."
                />
              </div>
              <div class="col-span-3">
                <p class="b1">Location</p>
                <input
                  type="text"
                  class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                  v-model="event.location"
                />
              </div>
              <div class="col-span-3">
                <p class="b1">Map</p>
                <textarea
                  rows="5"
                  type="text"
                  class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-lavender-gray/10 px-4 py-2 shadow-inner focus:outline-none"
                  v-model="event.map"
                  placeholder='&lt;iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8730478848183!2d100.54497267612477!3d13.726134986663078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f2476aee2a3%3A0x6e91389d33667ab8!2sOne%20Bangkok!5e0!3m2!1sen!2sth!4v1732998492170!5m2!1sen!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"&gt;&lt;/iframe&gt;'
                  @input="renderIframe(event.map)"
                />
                <!-- <div v-html="event.map"></div> -->
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
              <BtnComp text="Save" @click="fetchEventEdit" color="green" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
