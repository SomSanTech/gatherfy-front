<script setup lang="ts">
definePageMeta({
  layout: 'profile',
});
const accessToken = useCookie('accessToken');

const favEvent = ref();
const getFavEvent = async () => {
  const favData = await useFetchWithAuth(
    'v1/favorites',
    'GET',
    accessToken.value
  );
  if ('data' in favData) favEvent.value = favData.data;
};

const handleFavEvent = async (id) => {
  let isFav = favEvent.value.find((f) => f.eventId === id);

  let fav;
  if (isFav) {
    fav = await useFetchWithAuth(
      `v1/favorites/${id}`,
      'DELETE',
      accessToken.value
    );
  } else {
    fav = await useFetchWithAuth('v1/favorites', 'POST', accessToken.value, {
      eventId: id,
    });
  }
  if (fav.status === 200) {
    getFavEvent();
  } else {
    // showPopup('Can not fav this event try again later', 'error');
  }
};
const isLoading = useState<boolean>('isLoading', () => true);
onMounted(async () => {
  try {
    isLoading.value = true;
    getFavEvent();
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
});
</script>

<template>
  <Loader v-if="isLoading" />
  <div v-else class="relative w-full px-8 duration-300 lg:px-0">
    <p class="t3 pb-2">My Favorites</p>
    <div v-if="!favEvent || favEvent.length === 0" class="pt-12">no fav</div>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div
        v-if="favEvent"
        v-for="event in favEvent.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )"
      >
        <NuxtLink
          v-if="event?.slug"
          :to="{ name: 'event-id', params: { id: event?.slug } }"
        >
          <EventListCard
            @handle-fav="handleFavEvent"
            :event-detail="event"
            :is-square="true"
            :isFav="
              favEvent.find((a) => {
                return a.eventId === event.eventId;
              })
            "
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
