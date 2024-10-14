<script setup>
const props = defineProps({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

import { onMounted } from 'vue';

onMounted(async () => {
  // โหลด Leaflet แบบไดนามิก
  const L = await import('leaflet');

  // สร้างแผนที่
  const map = L.map('map').setView([props.latitude, props.longitude], 10); // กรุงเทพฯ

  // เพิ่มแผนที่ฐาน
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  // ปักหมุด
  L.marker([props.latitude, props.longitude])
    .addTo(map)
    .bindPopup('นี่คือกรุงเทพฯ')
    .openPopup();
});
</script>

<template>
  <div>
    <div id="map" class="rounded-lg" style="height: 350px; width: 350px"></div>
  </div>
</template>

<style>
/* เพิ่มสไตล์เพิ่มเติมถ้าต้องการ */
@import 'leaflet/dist/leaflet.css'; /* เพิ่มการนำเข้า CSS ที่นี่ */
</style>
