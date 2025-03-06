<script setup lang="ts">
import Edit from '~/components/icons/Edit.vue';
definePageMeta({
  layout: 'profile',
});

interface ProfileEdit {
  firstname: string;
  lastname: string;
  username: string;
  gender: string;
  email: string;
  phone: string;
  image: string;
  birthday: string;
}

interface UserProfile {
  users_firstname: string;
  users_lastname: string;
  username: string;
  users_gender: string;
  users_email: string;
  users_phone: string;
  users_image: string;
  users_birthday: string; // << เพิ่มตรงนี้
}

const checked = ref(false);
const selectedGender = ref<string>('');

const userProfile = useCookie<UserProfile>('profileData');

const selectedDay = ref<number | null>(null);
const selectedMonth = ref<number | null>(null);
const selectedYear = ref<string | null>(null);

const userProfileEdited = ref<ProfileEdit>({
  firstname: '',
  lastname: '',
  username: '',
  gender: '',
  email: '',
  phone: '',
  image: '',
  birthday: '',
});

watch(
  userProfile,
  (newProfile) => {
    if (newProfile && Object.keys(newProfile).length) {
      userProfileEdited.value = {
        firstname: newProfile.users_firstname,
        lastname: newProfile.users_lastname,
        username: newProfile.username,
        gender: newProfile.users_gender,
        email: newProfile.users_email,
        phone: newProfile.users_phone,
        image: newProfile.users_image,
        birthday: newProfile.users_birthday,
      };
      if (newProfile.users_birthday) {
        const [year, month, day] = newProfile.users_birthday
          .split('T')[0]
          .split('-');

        selectedDay.value = parseInt(day);
        console.log('day', selectedDay.value);

        selectedMonth.value = parseInt(month);
        selectedYear.value = year;
      }
      selectedGender.value = newProfile.users_gender;
    }
  },
  { immediate: true }
);

// const socialLinks = ref({
//   instagram: 'https://www.instagram.com/johndoe',
//   facebook: 'https://www.facebook.com/johndoe',
//   linkedin: 'https://www.linkedin.com/in/johndoe',
//   twitter: 'https://www.twitter.com/johndoe',
//   x: 'https://www.x.com/johndoe',
// });
const isShareContact = ref<boolean>(false);
const shareProfile = () => {
  isShareContact.value = !isShareContact.value;
  // const shareData = {
  //   title: `${userName.value}'s Profile`,
  //   text: `Contact ${userName.value} for any inquiries!`,
  //   url: window.location.href,
  // };
  // navigator.share && navigator.share(shareData);
};

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const years = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() - i
);

const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

const formattedBirthday = computed(() => {
  if (selectedDay.value && selectedMonth.value && selectedYear.value) {
    const day = String(selectedDay.value).padStart(2, '0');
    const month = String(selectedMonth.value).padStart(2, '0');
    const year = selectedYear.value;

    return `${year}-${month}-${day}T00:00:00`;
  } else {
    return 'Please select a valid date';
  }
});

const config = useRuntimeConfig();

const accessToken = useCookie<string>('accessToken');

const fileToUpload = ref();
const previewImage = ref('');
const uploadFileName = ref();

function handelFileUpload(file: any) {
  console.log('file', file);

  const target = file.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    previewImage.value = URL.createObjectURL(file);
    uploadFileName.value = file.name;
    fileToUpload.value = file;
  }
}
const fileInput = ref<HTMLInputElement>();

function triggerFileInput() {
  fileInput.value?.click();
}
const editProfile = async () => {
  userProfileEdited.value.birthday = formattedBirthday.value;
  userProfileEdited.value.gender = selectedGender.value;
  // const fileName = userProfileEdited.value.image.replace(
  //   `${config.public.minioUrl}/profiles/`,
  //   ''
  // );
  // userProfileEdited.value.image = fileName;
  const currentFileName = userProfile.value.users_image.replace(
    `${config.public.minioUrl}/profiles/`,
    ''
  );

  console.log('currentFileName', currentFileName);
  console.log('uploadFileName', uploadFileName.value);

  if (uploadFileName.value) {
    await useFetchWithAuth(
      `v1/files/delete/${currentFileName}?bucket=profiles`,
      'DELETE',
      accessToken.value
    );
    userProfileEdited.value.image = uploadFileName.value;
    await useFetchUpload(
      `v1/files/upload`,
      fileToUpload.value,
      'profiles',
      accessToken.value
    );
  } else {
    userProfileEdited.value.image = currentFileName;
  }
  console.log('userProfileEdited: ', userProfileEdited.value);

  const response = await useFetchWithAuth(
    `v1/profile`,
    'PUT',
    accessToken.value,
    userProfileEdited.value
  );

  if (response.status === 200) {
    const userProfileData = await useFetchWithAuth(
      'v1/profile',
      'GET',
      accessToken.value
    );

    if ('data' in userProfileData) {
      userProfile.value = userProfileData.data;
    }
  }
};

const socialLinks = ref([
  { socialPlatform: '', socialLink: '' },
  { socialPlatform: '', socialLink: '' },
  { socialPlatform: '', socialLink: '' },
  { socialPlatform: '', socialLink: '' },
]);

const socialUrl = ref('');
const socialType = computed(() => {
  if (!socialUrl.value) return '';

  const patterns = {
    Facebook: /facebook\.com/i,
    Instagram: /instagram\.com/i,
    X: /x\.com/i,
    LinkIn: /linkedin\.com/i,
    tiktok: /tiktok\.com/i,
    youtube: /youtube\.com/i,
  };

  for (const [platform, pattern] of Object.entries(patterns)) {
    if (pattern.test(socialUrl.value)) {
      return platform;
    }
  }

  return 'Website'; // ถ้าไม่ตรงกับ Social ไหนเลย
});

const currentPassword = ref('');
const newPassword = ref('');

const changePassword = async () => {
  const response = await useFetchWithAuth(
    'v1/password',
    'PUT',
    accessToken.value,
    {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    }
  );

  if (response.status === 200) {
    alert('change pass');
  } else {
    alert('failed');
  }
};

const handleAddSocial = async () => {
  console.log(socialLinkSet.value);
  const filteredSocialLinks = socialLinkSet.value.filter((sc: SocialLink) => {
    return sc.socialLink !== '';
  });
  console.log('filteredSocialLinks', { socialLinks: filteredSocialLinks });

  const response = await useFetchWithAuth(
    'v1/socials',
    'PUT',
    accessToken.value,
    { socialLinks: filteredSocialLinks }
  );

  console.log(response);
};
const socialLinksData = ref();
const socialLinkSet = ref();
type SocialLink = {
  socialPlatform: string;
  socialLink: string;
};

const fillSocialLinks = (socialLinks: SocialLink[]) => {
  const MAX_LENGTH = 4;

  while (socialLinks.length < MAX_LENGTH) {
    socialLinks.push({
      socialPlatform: '',
      socialLink: '',
    });
  }

  return socialLinks;
};

const detectType = (url: string): string => {
  const patterns = {
    Facebook: /facebook\.com/i,
    Instagram: /instagram\.com/i,
    X: /x\.com/i,
    LinkedIn: /linkedin\.com/i,
    TikTok: /tiktok\.com/i,
    YouTube: /youtube\.com/i,
  };
  for (const [name, pattern] of Object.entries(patterns)) {
    if (pattern.test(url)) return name;
  }
  return 'Website';
};

watch(
  socialLinkSet,
  (newLinks) => {
    newLinks.forEach((link: SocialLink, index: number) => {
      // อัปเดตเฉพาะช่องที่มีการกรอกข้อมูล
      if (link.socialLink && link.socialLink !== '') {
        socialLinkSet.value[index].socialPlatform = detectType(link.socialLink);
      }
    });
  },
  { deep: true }
);

const fetchSocialLink = async () => {
  const response = await useFetchWithAuth(
    'v1/socials',
    'GET',
    accessToken.value
  );
  if ('data' in response) {
    socialLinksData.value = response.data;
    console.log(response.data);
  }
};

onMounted(async () => {
  console.log('userProfile ', userProfile.value);
  if (userProfile.value) {
    userProfileEdited.value = {
      firstname: userProfile.value.users_firstname,
      lastname: userProfile.value.users_lastname,
      username: userProfile.value.username,
      gender: userProfile.value.users_gender,
      email: userProfile.value.users_email,
      phone: userProfile.value.users_phone,
      image: userProfile.value.users_image,
      birthday: '',
    };
    if (userProfile.value.users_birthday !== null) {
      const [year, month, day] = userProfile.value.users_birthday
        .split('T')[0]
        .split('-');

      selectedDay.value = parseInt(day);
      selectedMonth.value = parseInt(month);
      selectedYear.value = year;

      console.log(selectedDay.value);
      console.log(selectedMonth.value);
      console.log(selectedYear.value);
    }
    if (userProfile.value.users_gender) {
      selectedGender.value = userProfile.value.users_gender;
    }
    if (accessToken.value) {
      await fetchSocialLink();
      socialLinkSet.value = fillSocialLinks(socialLinksData.value);
      console.log('socialLinkSet', socialLinkSet.value);
    }
  }
});
</script>

<template>
  <!-- <div class="mx-auto my-28 flex w-screen max-w-6xl gap-9"> -->

  <div
    class="w-full duration-300"
    :class="isShareContact ? 'opacity-0' : 'opacity-100'"
  >
    <!-- <p class="t3">My Profile</p> -->
    <div class="flex flex-col gap-5">
      <div
        class="g-[#E9E9E9]/40 flex gap-20 rounded-xl border border-zinc-500/10 p-8 px-20 shadow-md shadow-zinc-300/30"
      >
        <div class="relative h-fit shrink-0">
          <img
            v-if="!previewImage"
            :src="userProfile?.users_image"
            alt=""
            class="relative h-40 w-40 shrink-0 rounded-full object-cover"
          /><img
            v-if="previewImage"
            :src="previewImage"
            class="relative h-40 w-40 shrink-0 rounded-full object-cover"
          />
          <div
            class="absolute bottom-0 right-3 w-fit rounded-full bg-gray-200 p-2"
            @click="triggerFileInput"
          >
            <Edit />
          </div>
        </div>

        <input
          type="file"
          id="upload"
          ref="fileInput"
          accept="image/*"
          class="hidden"
          @change="handelFileUpload($event)"
        />
        <div class="flex w-full flex-col gap-2">
          <div>
            <p class="b2 font pb-1 font-semibold">Firstname</p>
            <input
              type="text"
              placeholder="Firstname"
              v-model="userProfileEdited.firstname"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
          </div>
          <div>
            <p class="b2 font pb-1 font-semibold">Lastname</p>
            <input
              type="text"
              placeholder="Lastname"
              v-model="userProfileEdited.lastname"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
          </div>
          <div>
            <p class="b2 font pb-1 font-semibold">Username</p>
            <input
              type="text"
              placeholder="Username"
              v-model="userProfileEdited.username"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
          </div>
          <div>
            <p class="b2 font pb-1 font-semibold">Email</p>
            <input
              type="text"
              placeholder="Email"
              v-model="userProfileEdited.email"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
          </div>

          <div>
            <p class="b2 font pb-1 font-semibold">Phone</p>
            <input
              type="text"
              placeholder="Phone"
              v-model="userProfileEdited.phone"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
          </div>
          <div>
            <p class="b2 font pb-1 font-semibold">Birthday</p>
            <div class="flex gap-4">
              <!-- Dropdown สำหรับวัน -->
              <select
                v-model="selectedDay"
                class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
              >
                <option disabled value="">Day</option>
                <option v-for="day in days" :key="day" :value="day">
                  {{ day }}
                </option>
              </select>

              <!-- Dropdown สำหรับเดือน -->
              <select
                v-model="selectedMonth"
                class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
              >
                <option disabled value="">Month</option>
                <option
                  v-for="(month, index) in months"
                  :key="index"
                  :value="index + 1"
                >
                  {{ month }}
                </option>
              </select>

              <!-- Dropdown สำหรับปี -->
              <select
                v-model="selectedYear"
                class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
              >
                <option disabled value="">Year</option>
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
            <!-- {{ userProfileEdited.birthday }} -->
            <!-- <p class="mt-4 text-gray-600">
              Result: <span class="font-mono">{{ formattedBirthday }}</span>
            </p> -->
          </div>
          <div>
            <p class="b2 font pb-1 font-semibold">Gender</p>
            <select
              v-model="selectedGender"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            >
              <option disabled value="">Select Gender</option>
              <option v-for="gender in genders" :key="gender" :value="gender">
                {{ gender }}
              </option>
            </select>

            <!-- <p class="mt-4 text-gray-600">
              Gender Result:
              <span class="font-mono">{{ selectedGender }}</span>
            </p> -->
          </div>
          <div class="flex gap-2 self-end">
            <button
              class="b2 mt-10 w-fit self-end rounded-md border border-black/90 px-5 py-1 text-black"
              @click="editProfile"
            >
              cancle
            </button>
            <button
              class="b2 mt-10 w-fit self-end rounded-md bg-black/90 px-5 py-1 text-light-grey"
              @click="editProfile"
            >
              save
            </button>
          </div>
        </div>
      </div>
      <div class="grid w-full grid-cols-2 gap-3">
        <div
          class="g-[#E9E9E9]/40 flex flex-col gap-5 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30"
        >
          <div v-if="socialLinkSet !== []" class="flex flex-col gap-2">
            <div
              v-for="(item, index) in socialLinkSet"
              :key="index"
              class="b2 flex items-center gap-2"
            >
              <!-- {{ item }} -->
              <Instagram
                v-if="
                  item.socialPlatform.toLowerCase() ===
                  'Instagram'.toLowerCase()
                "
                class="text-4xl"
              />
              <X
                v-else-if="
                  item.socialPlatform.toLowerCase() === 'X'.toLowerCase()
                "
                class="text-4xl"
              />
              <Facebook
                v-else-if="
                  item.socialPlatform.toLowerCase() === 'Facebook'.toLowerCase()
                "
                class="text-4xl"
              />
              <Linkedin
                v-else-if="
                  item.socialPlatform.toLowerCase() === 'Linkedin'.toLowerCase()
                "
                class="text-4xl"
              />
              <LinkSocial v-else class="text-4xl" />
              <input
                v-model="item.socialLink"
                placeholder="Insert your link"
                class="w-full rounded-lg border p-2"
              />
            </div>
            <button
              @click="handleAddSocial"
              class="w-fit self-end rounded-md bg-dark-grey px-3 py-1 text-light-grey"
            >
              Save
            </button>
          </div>
        </div>
        <div
          class="g-[#E9E9E9]/40 flex w-full flex-col gap-5 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30"
        >
          <p class="b2 font-semibold">Change password</p>
          <div class="flex flex-col gap-2">
            <input
              type="password"
              placeholder="current password"
              v-model="currentPassword"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
            <input
              type="password"
              placeholder="new password"
              v-model="newPassword"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
            />
            <button
              @click="changePassword"
              class="w-fit self-end rounded-md bg-dark-grey px-3 py-1 text-light-grey"
            >
              Save
            </button>
            {{ currentPassword }}
            {{ newPassword }}
          </div>
        </div>
      </div>
      <div
        class="g-[#E9E9E9]/40 flex flex-col gap-5 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30"
      >
        <div>
          <p class="b2 font pb-1 font-semibold">Noti setting ja</p>
          <div class="flex items-center gap-1">
            <input
              type="checkbox"
              placeholder="Password"
              v-model="userProfileEdited.password"
              class="b2 rounded-lg border-[1px] border-black/20 p-2"
            />
            <p class="b3">Everything</p>
          </div>
          <!-- Rounded switch -->
          <UToggle color="gray" v-model="checked" />
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<style scoped>
.mask-gradient-profile {
  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0)
  );
  -webkit-mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0)
  );
  backdrop-filter: blur(20px);
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50%;
  pointer-events: none;
}
</style>
