<script setup>
import { GoogleMap, Marker } from 'vue3-google-map';
const userLocation = ref(null);
const center = ref({
  lat: 13.912834696317232,
  lng: 100.56777395501795,
  title: 'จุดที่ 1',
});

// const markers = [
//   { lat: 13.912834696317232, lng: 100.54777395501795, title: 'จุดที่ 1' },
//   { lat: 13.912, lng: 100.55, title: 'จุดที่ 2' },
//   { lat: 13.91, lng: 100.54, title: 'จุดที่ 3' },
// ];
const marker = {
  lat: 13.912834696317232,
  lng: 100.56777395501795,
  title: 'จุดที่ 1',
};
const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // center.value = userLocation.value; // Center the map on user's location
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

onMounted(() => {
  if (process.client) {
    getUserLocation();
  }
});
</script>
<template>
  <GoogleMap
    api-key="AIzaSyBtFE4aYR3RL_4BvHNaE0wlkYMZ35uS2fs"
    style="width: 350px; height: 350px; border-radius: 15px; overflow: hidden"
    :center="center"
    :zoom="15"
  >
    <!-- <Marker
      v-for="(marker, index) in markers"
      :key="index"
      :options="{
        position: { lat: marker.lat, lng: marker.lng },
        title: marker.title,
      }"
    /> -->
    <Marker
      v-if="marker"
      :options="{ position: marker, title: 'ตำแหน่งของคุณ' }"
    />

    <!-- <Marker
      v-if="userLocation"
      :options="{ position: userLocation, title: 'ตำแหน่งของคุณ' }"
    /> -->
  </GoogleMap>
</template>
<style scoped></style>
