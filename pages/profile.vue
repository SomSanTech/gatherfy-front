<script setup lang="ts">
import BtnComp from '~/components/BtnComp.vue';
import Edit from '~/components/icons/Edit.vue';
import Ticket from '~/components/icons/Ticket.vue';
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
  users_birthday: string;
  email_new_events: boolean;
  email_reminders_day: boolean;
  email_reminders_hour: boolean;
  email_updated_events: boolean;
}

type SocialLink = {
  socialPlatform: string;
  socialLink: string;
};

// const checked = ref(false);
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
const config = useRuntimeConfig();
const accessToken = useCookie<string>('accessToken');
const fileToUpload = ref();
const previewImage = ref<string>('');
const uploadFileName = ref();
const fileInput = ref<HTMLInputElement>();
const isShowCompleteModal = ref<boolean>(false);
const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const socialLinksData = ref();
const socialLinkSet = ref();
const isShowConfirmSave = ref<boolean>(false);
const errors = ref({
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  phone: '',
  birthday: '',
  gender: '',
});
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
const isFormValid = computed(() => {
  return Object.values(errors.value).every((error) => error === '');
});

const notiSetting = ref({
  newEvents: false,
  remindersDay: false,
  remindersHour: false,
  updatedEvents: false,
});

const notiSettingMsg = ref({
  newEvents: {
    title: 'Notify me when a new event is created',
    desc: 'Get notified when a new event is created under the tags you follow.',
  },
  remindersDay: {
    title: 'Reminder one day before the event',
    desc: 'Receive a reminder one day before the event starts to help you prepare.',
  },
  remindersHour: {
    title: 'Reminder one hour before the event',
    desc: 'Get a last-minute reminder one hour before the event begins.',
  },
  updatedEvents: {
    title: 'Notify me when an event is updated',
    desc: 'Stay informed when an event you follow gets updated or modified.',
  },
});
const { state, showPopup } = usePopup();
const isSaving = ref({
  noti: false,
  password: false,
  profile: false,
  social: false,
});

const handleNotiSetting = async () => {
  if (isSaving.value['noti']) return; // ป้องกันกดซ้ำ

  isSaving.value = { ...isSaving.value, ['noti']: true }; // เริ่มโหลดเฉพาะปุ่มนี้
  try {
    const response = await useFetchWithAuth(
      `v1/profile`,
      'PUT',
      accessToken.value,
      notiSetting.value
    );

    if (response.status === 200) {
      showPopup('Update email notification success', 'complete');
      const userProfileData = await useFetchWithAuth(
        'v1/profile',
        'GET',
        accessToken.value
      );

      if ('data' in userProfileData) {
        userProfile.value = userProfileData.data;
      }
    } else {
      showPopup('Update email notification fail, try again later', 'error');
    }
  } catch (error) {
    showPopup('Update email notification fail, try again later', 'error');
  }
  isSaving.value = { ...isSaving.value, ['noti']: false };
};

const handelFileUpload = (file: any) => {
  const target = file.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    previewImage.value = URL.createObjectURL(file);
    uploadFileName.value = file.name;
    fileToUpload.value = file;
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const editProfile = async () => {
  if (isSaving.value['profile']) return; // ป้องกันกดซ้ำ

  isSaving.value = { ...isSaving.value, ['profile']: true }; // เริ่มโหลดเฉพาะปุ่มนี้

  userProfileEdited.value.birthday = formattedBirthday.value;
  userProfileEdited.value.gender = selectedGender.value;
  validateForm();

  if (isFormValid.value) {
    try {
      if (userProfile.value.users_image !== null) {
        const currentFileName = userProfile.value.users_image.replace(
          `${config.public.minioUrl}/profiles/`,
          ''
        );

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
      }

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

        isShowConfirmSave.value = !isShowConfirmSave.value;
        isShowCompleteModal.value = !isShowCompleteModal.value;
        showPopup('Update profile success', 'complete');
      }
    } catch (error) {
      console.error(error);
      showPopup('Fail, try again later', 'error');
    }
  } else {
    showPopup('Please complete all fields', 'warn');
  }

  isSaving.value = { ...isSaving.value, ['profile']: false };
};
const allPatternCheck = ref<boolean>();

const patternCheck = ref<{ [key: string]: boolean }>({});
const checkPasswordPattern = () => {
  const hasUppercase = /[A-Z]/.test(newPassword.value);
  const hasLowercase = /[a-z]/.test(newPassword.value);
  const hasNumber = /[0-9]/.test(newPassword.value);
  const hasSpecialChar = /[@#$%^&+=.*!]/.test(newPassword.value);
  const isMinLength = newPassword.value.length >= 8;

  if (hasUppercase) {
    patternCheck.value['uppercase'] = true;
  } else {
    patternCheck.value['uppercase'] = false;
  }
  if (hasLowercase) {
    patternCheck.value['lowercase'] = true;
  } else {
    patternCheck.value['lowercase'] = false;
  }
  if (hasNumber) {
    patternCheck.value['number'] = true;
  } else {
    patternCheck.value['number'] = false;
  }
  if (hasSpecialChar) {
    patternCheck.value['specialChar'] = true;
  } else {
    patternCheck.value['specialChar'] = false;
  }
  if (isMinLength) {
    patternCheck.value['minLength'] = true;
  } else {
    patternCheck.value['minLength'] = false;
  }

  if (
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar &&
    isMinLength
  ) {
    allPatternCheck.value = true;
  } else {
    allPatternCheck.value = false;
  }
};
watch(
  newPassword,
  (newPassword) => {
    if (newPassword) {
      checkPasswordPattern();
    }
  },
  { immediate: true }
);
const changePassword = async () => {
  if (isSaving.value['password']) return;

  isSaving.value = { ...isSaving.value, ['password']: true };
  try {
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
      showPopup('Change password success', 'complete');
    } else if ('error' in response) {
      showPopup(`${response.error}`, 'error');
    } else {
      showPopup('Change password fail, try again later', 'error');
    }
  } catch (error) {
    showPopup('Change password fail, try again later', 'error');
  }
  isSaving.value = { ...isSaving.value, ['password']: false };
};

const handleAddSocial = async () => {
  if (isSaving.value['social']) return; // ป้องกันกดซ้ำ

  isSaving.value = { ...isSaving.value, ['social']: true };
  const filteredSocialLinks = socialLinkSet.value.filter((sc: SocialLink) => {
    return sc.socialLink !== '';
  });

  const response = await useFetchWithAuth(
    'v1/socials',
    'PUT',
    accessToken.value,
    { socialLinks: filteredSocialLinks }
  );
  if (response.status === 200) {
    showPopup('Add social success', 'complete');
  } else {
    showPopup('Add social fail', 'error');
  }

  isSaving.value = { ...isSaving.value, ['social']: false };
};

const trimTrailingSlash = (url: string) => {
  return url.replace(/\/$/, '');
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

const fetchSocialLink = async () => {
  const response = await useFetchWithAuth(
    'v1/socials',
    'GET',
    accessToken.value
  );
  if ('data' in response) {
    socialLinksData.value = response.data;
  }
};

const validateField = (field: keyof typeof errors.value, value: string) => {
  errors.value[field] = value ? '' : 'This field is required.';
};

const validateForm = () => {
  validateField('firstname', userProfileEdited.value.firstname);
  validateField('lastname', userProfileEdited.value.lastname);
  validateField('username', userProfileEdited.value.username);
  validateField('email', userProfileEdited.value.email);
  validateField('phone', userProfileEdited.value.phone);
  validateField(
    'birthday',
    selectedDay.value && selectedMonth.value && selectedYear.value
      ? 'valid'
      : ''
  );
  validateField('gender', selectedGender.value);
};

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

        selectedMonth.value = parseInt(month);
        selectedYear.value = year;
      }
      selectedGender.value = newProfile.users_gender;
    }
  },
  { immediate: true }
);

watch(
  socialLinkSet,
  (newLinks) => {
    newLinks.forEach((link: SocialLink, index: number) => {
      if (link.socialLink && link.socialLink !== '') {
        socialLinkSet.value[index].socialPlatform = detectType(link.socialLink);
      }
    });
  },
  { deep: true }
);

const isLoading = useState<boolean>('isLoading', () => true);
defineExpose({ isLoading });
onMounted(async () => {
  try {
    isLoading.value = true;
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
      }
      if (userProfile.value.users_gender) {
        selectedGender.value = userProfile.value.users_gender;
      }
      if (accessToken.value) {
        await fetchSocialLink();
        socialLinkSet.value = fillSocialLinks(socialLinksData.value);
      }

      notiSetting.value.newEvents = userProfile.value.email_new_events;
      notiSetting.value.remindersDay = userProfile.value.email_reminders_day;
      notiSetting.value.remindersHour = userProfile.value.email_reminders_hour;
      notiSetting.value.updatedEvents = userProfile.value.email_updated_events;
    }
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
  <!-- <div class="mx-auto my-28 flex w-screen max-w-6xl gap-9"> -->
  <Loader v-if="isLoading" />
  <div v-else class="relative w-full px-8 duration-300 lg:px-0">
    <CompleteModal
      :isShowCompleteModal="state.isVisible"
      :title="state.text"
      :status="state.status"
      @complete-action="state.isVisible = false"
    />
    <div class="flex flex-col gap-5">
      <div
        class="flex flex-col items-center gap-6 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30 lg:flex-row lg:items-start lg:gap-20 lg:px-20"
      >
        <div class="relative h-fit w-fit shrink-0">
          <img
            v-if="!previewImage && userProfile?.users_image"
            :src="userProfile?.users_image"
            alt=""
            class="relative h-32 w-32 shrink-0 rounded-full object-cover lg:h-40 lg:w-40"
          />

          <div
            v-if="!previewImage && !userProfile?.users_image"
            class="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-black/90 object-cover lg:h-40 lg:w-40"
          >
            <img
              src="/favicon.ico"
              class="relative h-28 w-28 shrink-0 rounded-full object-cover"
            />
          </div>
          <img
            v-if="previewImage"
            :src="previewImage"
            class="relative h-32 w-32 shrink-0 rounded-full object-cover lg:h-40 lg:w-40"
          />
          <button
            class="absolute bottom-0 right-3 w-fit cursor-pointer rounded-full border-2 border-black/0 bg-gray-200 p-2 duration-150 hover:border-red-700"
            @click="triggerFileInput"
          >
            <Edit />
          </button>
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
          <!-- Firstname -->
          <div>
            <p class="b2 font pb-1 font-semibold">Firstname</p>
            <input
              type="text"
              placeholder="Firstname"
              v-model="userProfileEdited.firstname"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
              @blur="validateField('firstname', userProfileEdited.firstname)"
            />
            <p v-if="errors.firstname" class="b4 mt-1 text-sm text-red-500">
              {{ errors.firstname }}
            </p>
          </div>

          <!-- Lastname -->
          <div>
            <p class="b2 font pb-1 font-semibold">Lastname</p>
            <input
              type="text"
              placeholder="Lastname"
              v-model="userProfileEdited.lastname"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
              @blur="validateField('lastname', userProfileEdited.lastname)"
            />
            <p v-if="errors.lastname" class="mt-1 text-sm text-red-500">
              {{ errors.lastname }}
            </p>
          </div>

          <!-- Username -->
          <div>
            <p class="b2 font pb-1 font-semibold">Username</p>
            <input
              type="text"
              placeholder="Username"
              v-model="userProfileEdited.username"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
              @blur="validateField('username', userProfileEdited.username)"
            />
            <p v-if="errors.username" class="b4 mt-1 text-sm text-red-500">
              {{ errors.username }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <p class="b2 font pb-1 font-semibold">Email</p>
            <input
              disabled
              type="email"
              placeholder="Email"
              v-model="userProfileEdited.email"
              class="b2 w-full cursor-not-allowed rounded-lg border-[1px] border-black/20 bg-gray-400/40 p-2 text-gray-600 disabled:border-gray-300 disabled:bg-gray-200 disabled:text-gray-400"
              @blur="validateField('email', userProfileEdited.email)"
            />
            <p v-if="errors.email" class="b4 mt-1 text-sm text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <!-- Phone -->
          <div>
            <p class="b2 font pb-1 font-semibold">Phone</p>
            <input
              type="text"
              placeholder="Phone"
              v-model="userProfileEdited.phone"
              class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
              @blur="validateField('phone', userProfileEdited.phone)"
            />
            <p v-if="errors.phone" class="b4 mt-1 text-sm text-red-500">
              {{ errors.phone }}
            </p>
          </div>

          <!-- Birthday -->
          <div>
            <p class="b2 font pb-1 font-semibold">Birthday</p>
            <div class="flex gap-4">
              <select
                v-model="selectedDay"
                class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
              >
                <option disabled value="">Day</option>
                <option v-for="day in days" :key="day" :value="day">
                  {{ day }}
                </option>
              </select>
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
            <p v-if="errors.birthday" class="b4 mt-1 text-sm text-red-500">
              Please select a valid birthday.
            </p>
          </div>

          <!-- Gender -->
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
            <p v-if="errors.gender" class="b4 mt-1 text-sm text-red-500">
              {{ errors.gender }}
            </p>
          </div>

          <!-- Save Button -->
          <div class="flex gap-2 self-end">
            <BtnComp
              :text="isSaving['profile'] ? 'Saving...' : 'Save'"
              color="black"
              class="mt-8 h-fit"
              :disabled="isSaving['profile']"
              :isLoading="isSaving['profile']"
              @click="editProfile"
            />
          </div>
        </div>
      </div>
      <div class="grid w-full gap-3 lg:grid-cols-2">
        <div
          class="g-[#E9E9E9]/40 flex flex-col gap-5 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30"
        >
          <p class="b1 pb-5 font-semibold">Social Links</p>

          <div
            v-if="socialLinkSet && socialLinkSet.length !== 0"
            class="flex flex-col gap-2"
          >
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
                class="text-2xl"
              />
              <X
                v-else-if="
                  item.socialPlatform.toLowerCase() === 'X'.toLowerCase()
                "
                class="text-2xl"
              />
              <Facebook
                v-else-if="
                  item.socialPlatform.toLowerCase() === 'Facebook'.toLowerCase()
                "
                class="text-2xl"
              />
              <Linkedin
                v-else-if="
                  item.socialPlatform.toLowerCase() === 'Linkedin'.toLowerCase()
                "
                class="text-2xl"
              />
              <LinkSocial v-else class="text-2xl" />
              <input
                @blur="item.socialLink = trimTrailingSlash(item.socialLink)"
                v-model="item.socialLink"
                placeholder="Insert your link"
                class="w-full rounded-lg border p-2"
              />
              <button
                v-if="item.socialLink !== ''"
                @click="
                  item.socialLink = '';
                  item.socialPlatform = '';
                "
              >
                <TrashSolid
                  class="text-gray-500 duration-200 hover:text-burgundy"
                />
              </button>
            </div>
            <BtnComp
              @click="handleAddSocial"
              text="Save"
              :disabled="isSaving['social']"
              :isLoading="isSaving['social']"
              color="black"
              class="mt-3 w-fit self-end"
            />
          </div>
        </div>
        <div
          class="g-[#E9E9E9]/40 flex w-full flex-col justify-between gap-5 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30"
        >
          <div>
            <p class="b1 pb-5 font-semibold">Change password</p>
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
              <div v-if="newPassword.length > 0" class="b4">
                <div
                  class="flex items-center"
                  :class="
                    patternCheck['minLength']
                      ? 'text-green-700'
                      : 'text-red-500'
                  "
                >
                  <Check v-if="patternCheck['minLength']" /><Cancle v-else /> At
                  least 8 characters
                </div>
                <div
                  class="flex items-center"
                  :class="
                    patternCheck['uppercase']
                      ? 'text-green-700'
                      : 'text-red-500'
                  "
                >
                  <Check v-if="patternCheck['uppercase']" /><Cancle v-else />At
                  least one uppercase letter (A–Z)
                </div>
                <div
                  class="flex items-center"
                  :class="
                    patternCheck['lowercase']
                      ? 'text-green-700'
                      : 'text-red-500'
                  "
                >
                  <Check v-if="patternCheck['lowercase']" /><Cancle v-else />At
                  least one lowercase letter (a–z)
                </div>
                <div
                  class="flex items-center"
                  :class="
                    patternCheck['number'] ? 'text-green-700' : 'text-red-500'
                  "
                >
                  <Check v-if="patternCheck['number']" /><Cancle v-else />At
                  least one number (0–9)
                </div>
                <div
                  class="flex items-center"
                  :class="
                    patternCheck['specialChar']
                      ? 'text-green-700'
                      : 'text-red-500'
                  "
                >
                  <Check v-if="patternCheck['specialChar']" /><Cancle
                    v-else
                  />At least one special character (@, #, $, %, ^, &, +, =, .,
                  *, etc.)
                </div>
              </div>
            </div>
          </div>
          <BtnComp
            @click="changePassword"
            :text="isSaving['password'] ? 'Saving...' : 'Save'"
            :isLoading="isSaving['password']"
            color="black"
            :class="
              isSaving['password'] ||
              currentPassword.length === 0 ||
              newPassword.length === 0 ||
              !allPatternCheck
                ? 'cursor-not-allowed opacity-50'
                : ''
            "
            class="mt-3 w-fit self-end"
            :disabled="
              isSaving['password'] ||
              currentPassword.length === 0 ||
              newPassword.length === 0 ||
              !allPatternCheck
            "
          />
        </div>
      </div>
      <div
        class="g-[#E9E9E9]/40 rounded-xl border border-zinc-500/10 p-8 shadow-md shadow-zinc-300/30"
      >
        <div class="flex flex-col gap-5">
          <p class="b1 font pb-5 font-semibold">Custom Notification</p>
          <div class="flex flex-col gap-2">
            <div
              v-for="noti in Object.keys(notiSetting)"
              class="b3 flex items-center justify-between rounded-md border p-4"
            >
              <div class="flex items-center gap-3">
                <Ticket class="text-2xl" />
                <div>
                  <p class="b2 font-semibold">
                    {{ notiSettingMsg[noti]?.title }}
                  </p>
                  <p>
                    {{ notiSettingMsg[noti]?.desc }}
                  </p>
                </div>
              </div>
              <label class="inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  v-model="notiSetting[noti]"
                  class="peer sr-only"
                />

                <div
                  class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800"
                ></div>
              </label>
            </div>
          </div>
          <BtnComp
            @click="handleNotiSetting"
            text="Save"
            color="black"
            class="mt-3 w-fit self-end"
            :disabled="isSaving['noti']"
            :isLoading="isSaving['noti']"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
