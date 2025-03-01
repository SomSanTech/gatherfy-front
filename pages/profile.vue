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
const userName = ref('John Doe');
const userJob = ref('Software Developer');
const profileImage = ref('https://www.example.com/profile.jpg');
const phone = ref('+123 456 7890');
const email = ref('john.doe@example.com');

const socialLinks = ref({
  instagram: 'https://www.instagram.com/johndoe',
  facebook: 'https://www.facebook.com/johndoe',
  linkedin: 'https://www.linkedin.com/in/johndoe',
  twitter: 'https://www.twitter.com/johndoe',
  x: 'https://www.x.com/johndoe',
});
const isShareContact = ref(false);
const shareProfile = () => {
  isShareContact.value = !isShareContact.value;
  // const shareData = {
  //   title: `${userName.value}'s Profile`,
  //   text: `Contact ${userName.value} for any inquiries!`,
  //   url: window.location.href,
  // };
  // navigator.share && navigator.share(shareData);
};
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
    <div class="flex w-fit flex-col gap-5">
      <div
        :class="isShareContact ? 'w-screen max-w-6xl flex-row' : 'flex-col'"
        class="flex w-full gap-5 rounded-xl border border-zinc-500/10 bg-[#E9E9E9]/70 p-5 shadow-md shadow-zinc-300/30 duration-700"
      >
        <div
          class="group relative w-full max-w-lg overflow-hidden rounded-2xl shadow-lg duration-700"
        >
          <!-- Background Image -->
          <div class="b3 group relative duration-700">
            <img
              :src="userProfile.users_image"
              alt="Severance"
              class="h-[500px] w-full object-cover"
            />

            <!-- Blurred Overlay (ต้องมาก่อน content เพื่อให้ blur อยู่ข้างล่าง) -->
            <div class="mask-gradient-profile"></div>
            <div class="mask-gradient-profile"></div>
            <div
              class="absolute bottom-0 right-0 z-50 h-4/5 w-full bg-gradient-to-t from-black/90"
            ></div>
            <!-- Content (วางให้อยู่ข้างหน้าสุด) -->
            <div class="p absolute bottom-4 z-50 w-full px-4 text-white">
              <h2 class="mt-4 text-xl font-semibold">
                {{ userProfile.username }}
              </h2>
              <p class="text-white">
                {{ userProfile.users_firstname }}
                {{ userProfile.users_lastname }}
              </p>
              <div
                class="mt-2 flex w-full flex-col gap-2 rounded-md border border-dashed p-2"
              >
                <div class="flex items-center gap-1">
                  <Phone class="fill-white text-[15px]" />
                  <p>{{ userProfile.users_phone }}</p>
                </div>
                <div class="flex items-center gap-1">
                  <Gmail class="fill-white text-[15px]" />
                  <p>{{ userProfile.users_email }}</p>
                </div>
              </div>
              <div class="mt-2 flex gap-4">
                <a
                  v-if="socialLinks.instagram"
                  :href="socialLinks.instagram"
                  target="_blank"
                >
                  <Instagram class="text-2xl" />
                </a>
                <a
                  v-if="socialLinks.facebook"
                  :href="socialLinks.facebook"
                  target="_blank"
                >
                  <Facebook class="text-2xl" />
                </a>
                <a
                  v-if="socialLinks.linkedin"
                  :href="socialLinks.linkedin"
                  target="_blank"
                >
                  <Linkedin class="text-2xl" />
                </a>
                <a v-if="socialLinks.x" :href="socialLinks.x" target="_blank">
                  <X class="text-2xl" />
                </a>
              </div>

              <!-- Share Button -->
              <div class="mt-3 w-full">
                <button
                  @click="shareProfile"
                  class="b3 w-full rounded-lg bg-white px-4 py-2 text-black hover:bg-blue-600"
                >
                  Share contact
                </button>
              </div>
            </div>

            <!-- Watch Now Button -->
            <!-- <button
              class="absolute bottom-4 right-4 z-50 rounded-lg bg-white/80 px-4 py-2 text-sm font-medium text-black shadow-md backdrop-blur-md hover:bg-white"
            >
              Watch Now
            </button> -->
          </div>
        </div>
        <div
          v-if="isShareContact"
          class="w-full rounded-xl border border-black/60 p-10 duration-500"
        >
          this is qrcode
        </div>
        <!-- <div
          class="b3 flex w-full flex-col items-center gap-4 rounded-xl bg-white p-6 shadow-lg"
        >
          <div class="flex flex-col items-center">
            <img
              src="../components/images/kornnaphat.png"
              alt="User Profile Image"
              class="h-24 w-24 rounded-full object-cover"
            />
            <h2 class="mt-4 text-xl font-semibold">
              {{ userProfile.username }}
            </h2>
            <p class="text-gray-500">
              {{ userProfile.users_firstname }} {{ userProfile.users_lastname }}
            </p>
          </div>

          <div class="mt-4 flex w-full flex-col gap-2">
            <div class="flex items-center gap-2">
              <i class="fas fa-phone-alt text-lg text-gray-600"></i>
              <p>{{ userProfile.users_phone }}</p>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-envelope text-lg text-gray-600"></i>
              <p>{{ userProfile.users_email }}</p>
            </div>
          </div>

          <div class="mt-4 flex gap-4">
            <a
              v-if="socialLinks.instagram"
              :href="socialLinks.instagram"
              target="_blank"
            >
              <Instagram class="text-2xl text-pink-600" />
            </a>
            <a
              v-if="socialLinks.facebook"
              :href="socialLinks.facebook"
              target="_blank"
            >
              <Facebook class="text-2xl text-blue-600" />
            </a>
            <a
              v-if="socialLinks.linkedin"
              :href="socialLinks.linkedin"
              target="_blank"
            >
              <Linkedin class="text-2xl text-blue-700" />
            </a>
            <a v-if="socialLinks.x" :href="socialLinks.x" target="_blank">
              <X class="text-2xl text-blue-500" />
            </a>
          </div>

          <div class="mt-6 w-full">
            <button
              @click="shareProfile"
              class="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Share contact
            </button>
          </div>
        </div> -->
      </div>
      <div
        class="g-[#E9E9E9]/40 flex h-full gap-20 rounded-xl border border-zinc-500/10 p-8 px-20 shadow-md shadow-zinc-300/30"
      >
        <p>Account setting</p>
      </div>
    </div>
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
                Gender Result:
                <span class="font-mono">{{ selectedGender }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="flex w-full gap-3">
          <div
            class="g-[#E9E9E9]/40 flex flex-col gap-5 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30"
          >
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
                v-else-if="
                  socialType.toLowerCase() === 'Facebook'.toLowerCase()
                "
                class="text-4xl"
              />
              <Linkedin
                v-else-if="
                  socialType.toLowerCase() === 'Linkedin'.toLowerCase()
                "
                class="text-4xl"
              />
              <LinkSocial v-else class="text-4xl" />
              <input
                v-model="socialUrl"
                placeholder="ใส่ลิงก์โซเชียลมีเดีย"
                class="w-full border p-2"
              />
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
                v-else-if="
                  socialType.toLowerCase() === 'Facebook'.toLowerCase()
                "
                class="text-4xl"
              />
              <Linkedin
                v-else-if="
                  socialType.toLowerCase() === 'Linkedin'.toLowerCase()
                "
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
                v-else-if="
                  socialType.toLowerCase() === 'Facebook'.toLowerCase()
                "
                class="text-4xl"
              />
              <Linkedin
                v-else-if="
                  socialType.toLowerCase() === 'Linkedin'.toLowerCase()
                "
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
                v-else-if="
                  socialType.toLowerCase() === 'Facebook'.toLowerCase()
                "
                class="text-4xl"
              />
              <Linkedin
                v-else-if="
                  socialType.toLowerCase() === 'Linkedin'.toLowerCase()
                "
                class="text-4xl"
              />
              <LinkSocial v-else class="text-4xl" />
              <input
                v-model="socialUrl"
                placeholder="ใส่ลิงก์โซเชียลมีเดีย"
                class="w-full border p-2"
              />
            </div>
          </div>
          <div
            class="g-[#E9E9E9]/40 flex flex-col gap-5 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30"
          >
            <div>
              <p class="b2 font pb-1 font-semibold">Change pass</p>
              <input
                type="text"
                placeholder="Password"
                v-model="userProfileEdited.password"
                class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
              />
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
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round"></span>
            </label>
          </div>
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
  </div>
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
  height: 80%;
  pointer-events: none;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 25px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 19px;
  width: 19px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2f3131;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(10px);
  -ms-transform: translateX(10px);
  transform: translateX(19px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 22px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
