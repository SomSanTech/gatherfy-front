<script setup lang="ts">
definePageMeta({
  layout: 'profile',
});
const contacts = [
  { id: 1, name: 'Alice Smith', phone: '+1 987 654 321' },
  { id: 2, name: 'Bob Johnson', phone: '+1 555 666 777' },
  { id: 3, name: 'Charlie Brown', phone: '+1 444 333 222' },
];

function shareContact() {
  alert('Sharing your contact...');
}

function saveContact(contact) {
  if (contact) {
    alert(`Saving contact: ${contact.name}`);
  } else {
    alert('Saving your contact...');
  }
}

const userProfile = useCookie('profileData', { default: () => ({}) });
</script>

<template>
  <div class="w-full bg-red-200">aaa</div>
</template>

<style scoped></style>
