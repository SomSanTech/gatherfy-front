<script setup lang="ts">
import Edit from '~/components/icons/Edit.vue';
// import { BrowserQRCodeReader } from '@zxing/browser';
// import QrcodeVue from 'qrcode.vue';

// const video = ref<HTMLVideoElement | null>(null);
// const scannedValue = ref<string | null>(null);

const selectedGender = ref<string | null>(null);
interface ProfileEdit {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  gender: string;
  email: string;
  phone: string;
  image: string;
  birthday: string;
}

const userProfile = useCookie<ProfileEdit | null>('profileData');

const selectedDay = ref<string | null>(null);
const selectedMonth = ref<number | null>(null);
const selectedYear = ref<string | null>(null);
const userProfileEdited = ref<ProfileEdit | null>({
  firstname: '',
  lastname: '',
  username: '',
  password: 'Orm6+5=11',
  gender: '',
  email: 'orm.kornnaphat@gmail.com',
  phone: '',
  image: '',
  birthday: '',
});

watch(
  userProfile,
  (newProfile) => {
    if (newProfile) {
      // console.log('userProfile ', userProfile.value);

      userProfileEdited.value = {
        firstname: newProfile.users_firstname,
        lastname: newProfile.users_lastname,
        username: newProfile.username,
        password: newProfile.password,
        gender: newProfile.users_gender,
        email: newProfile.users_email,
        phone: newProfile.users_phone,
        image: newProfile.users_image,
        birthday: newProfile.users_birthday,
      };

      const [year, month, day] = newProfile.users_birthday
        .split('T')[0]
        .split('-');

      selectedDay.value = day;
      selectedMonth.value = parseInt(month);
      selectedYear.value = year;
      selectedGender.value = newProfile.users_gender;
    }
  },
  { immediate: true }
);

onMounted(() => {
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

    const [year, month, day] = userProfile.value.users_birthday
      .split('T')[0]
      .split('-');

    selectedDay.value = day;
    selectedMonth.value = parseInt(month);
    selectedYear.value = year;

    console.log(selectedDay.value);
    console.log(selectedMonth.value);
    console.log(selectedYear.value);

    selectedGender.value = userProfile.value.users_gender;
  }
});
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
    const day = String(selectedDay.value).padStart(2, '0'); // เติมเลข 0 ข้างหน้า เช่น 01
    const month = String(selectedMonth.value).padStart(2, '0'); // เติมเลข 0 ข้างหน้า เช่น 01
    const year = selectedYear.value;

    return `${year}-${month}-${day}T00:00:00`;
  }
  return 'Please select a valid date';
});

const config = useRuntimeConfig();

const accessToken = useCookie('accessToken');
// const refreshToken = useCookie('refreshToken');
const editProfile = async () => {
  console.log('---------------------------------');
  userProfileEdited.value.birthday = formattedBirthday.value;
  const fileName = userProfileEdited.value.image.replace(
    `${config.public.minioUrl}/profiles/`,
    ''
  );
  userProfileEdited.value.image = fileName;

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
    userProfile.value = userProfileData.data;
  }
};
// "http://cp24us1.sit.kmutt.ac.th:7070/profiles/http://cp24us1.sit.kmutt.ac.th:7070/profiles/00k.jpg"
// onBeforeUnmount(() => {
//   qrCodeReader.reset(); // ปิดกล้องเมื่อออกจากหน้า
// });
const socialUrl = ref('');
const socialType = computed(() => {
  if (!socialUrl.value) return '';

  const patterns = {
    facebook: /facebook\.com/i,
    instagram: /instagram\.com/i,
    x: /x\.com/i,
    linkedin: /linkedin\.com/i,
    tiktok: /tiktok\.com/i,
    youtube: /youtube\.com/i,
  };

  for (const [platform, pattern] of Object.entries(patterns)) {
    if (pattern.test(socialUrl.value)) {
      return platform;
    }
  }

  return 'unknown'; // ถ้าไม่ตรงกับ Social ไหนเลย
});
</script>

<template>
  <div class="mx-auto my-28 flex w-screen max-w-6xl gap-9">
    <div class="bg- w-[280px] rounded-xl border border-black/70"></div>
    <div class="w-full">
      <p class="t3">My Profile</p>
      <div class="flex gap-20 rounded-xl border border-black/70 p-8 px-20">
        <div class="relative h-fit shrink-0">
          <img
            :src="userProfile?.users_image"
            alt=""
            class="relative h-40 w-40 rounded-full"
          />
          <div
            class="absolute bottom-0 right-3 w-fit rounded-full bg-gray-200 p-2"
          >
            <Edit />
          </div>
        </div>
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
            <p class="b2 font pb-1 font-semibold">Password</p>
            <input
              type="text"
              placeholder="Password"
              v-model="userProfileEdited.password"
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
            {{ userProfileEdited.birthday }}
            <p class="mt-4 text-gray-600">
              Result: <span class="font-mono">{{ formattedBirthday }}</span>
            </p>
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

            <p class="mt-4 text-gray-600">
              Gender Result: <span class="font-mono">{{ selectedGender }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <Instagram
              v-if="socialType.toLowerCase() === 'Instagram'.toLowerCase()"
              class="text-4xl"
            />
            <X
              v-else-if="socialType.toLowerCase() === 'X'.toLowerCase()"
              class="text-4xl"
            />
            <Facebook
              v-else-if="socialType.toLowerCase() === 'Facebook'.toLowerCase()"
              class="text-4xl"
            />
            <Linkedin
              v-else-if="socialType.toLowerCase() === 'Linkedin'.toLowerCase()"
              class="text-4xl"
            />
            <LinkSocial v-else class="text-4xl" />
            <input
              v-model="socialUrl"
              placeholder="ใส่ลิงก์โซเชียลมีเดีย"
              class="w-full border p-2"
            />

            <!-- <p v-if="socialType">
              ประเภทโซเชียล:
              <span v-if="socialType !== 'unknown'">{{ socialType }}</span>
              <span v-else>ไม่สามารถระบุได้</span>
            </p> -->
          </div>
          <div class="flex items-center gap-2">
            <Instagram
              v-if="socialType.toLowerCase() === 'Instagram'.toLowerCase()"
              class="text-4xl"
            />
            <X
              v-else-if="socialType.toLowerCase() === 'X'.toLowerCase()"
              class="text-4xl"
            />
            <Facebook
              v-else-if="socialType.toLowerCase() === 'Facebook'.toLowerCase()"
              class="text-4xl"
            />
            <Linkedin
              v-else-if="socialType.toLowerCase() === 'Linkedin'.toLowerCase()"
              class="text-4xl"
            />
            <LinkSocial v-else class="text-4xl" />
            <input
              v-model="socialUrl"
              placeholder="ใส่ลิงก์โซเชียลมีเดีย"
              class="w-full border p-2"
            />

            <!-- <p v-if="socialType">
              ประเภทโซเชียล:
              <span v-if="socialType !== 'unknown'">{{ socialType }}</span>
              <span v-else>ไม่สามารถระบุได้</span>
            </p> -->
          </div>
          <div class="flex items-center gap-2">
            <Instagram
              v-if="socialType.toLowerCase() === 'Instagram'.toLowerCase()"
              class="text-4xl"
            />
            <X
              v-else-if="socialType.toLowerCase() === 'X'.toLowerCase()"
              class="text-4xl"
            />
            <Facebook
              v-else-if="socialType.toLowerCase() === 'Facebook'.toLowerCase()"
              class="text-4xl"
            />
            <Linkedin
              v-else-if="socialType.toLowerCase() === 'Linkedin'.toLowerCase()"
              class="text-4xl"
            />
            <LinkSocial v-else class="text-4xl" />
            <input
              v-model="socialUrl"
              placeholder="ใส่ลิงก์โซเชียลมีเดีย"
              class="w-full border p-2"
            />

            <p v-if="socialType">
              ประเภทโซเชียล:
              <span v-if="socialType !== 'unknown'">{{ socialType }}</span>
              <span v-else>ไม่สามารถระบุได้</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <Instagram
              v-if="socialType.toLowerCase() === 'Instagram'.toLowerCase()"
              class="text-4xl"
            />
            <X
              v-else-if="socialType.toLowerCase() === 'X'.toLowerCase()"
              class="text-4xl"
            />
            <Facebook
              v-else-if="socialType.toLowerCase() === 'Facebook'.toLowerCase()"
              class="text-4xl"
            />
            <Linkedin
              v-else-if="socialType.toLowerCase() === 'Linkedin'.toLowerCase()"
              class="text-4xl"
            />
            <LinkSocial v-else class="text-4xl" />
            <input
              v-model="socialUrl"
              placeholder="ใส่ลิงก์โซเชียลมีเดีย"
              class="w-full border p-2"
            />

            <!-- <p v-if="socialType">
              ประเภทโซเชียล:
              <span v-if="socialType !== 'unknown'">{{ socialType }}</span>
              <span v-else>ไม่สามารถระบุได้</span>
            </p> -->
          </div>
        </div>

        <button class="" @click="editProfile">save</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
