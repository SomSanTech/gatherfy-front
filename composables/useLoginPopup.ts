import { useRuntimeConfig } from '#app';
export const isSessionTimeOut = () => useState('isSessionTimeOut', () => false);
export const useLoginPopup = () => useState('loginPopup', () => false);
export const isOTPPopup = () => useState('isOTPPopup', () => false);
export const isSignup = () => useState('isSignup', () => false);
export const useUserProfile = () => useState('userProfile', () => null);
export const useRole = () => useState('useRole', () => null);

export const useIsUserSignIn = () => {
  // const isUserSignIn = useState('isUserSignIn', () => false); // เก็บสถานะผู้ใช้
  const accessToken = useCookie('accessToken'); // ดึงคุกกี้ accessToken
  // const refreshToken = useCookie('refreshToken'); // ดึงคุกกี้ refreshToken

  // ฟังก์ชันสำหรับอัปเดตสถานะ isUserSignIn
  // const updateSignInStatus = () => {
  //   // เช็คว่าคุกกี้ทั้งสองมีค่าหรือไม่
  //   if (accessToken.value) {
  //     isUserSignIn.value = true; // ถ้ามีค่าทั้งสอง อัปเดตเป็น true
  //   } else {
  //     isUserSignIn.value = false; // ถ้าไม่มีค่าใดค่าให้เป็น false
  //   }
  // };

  // ใช้ watch เพื่อติดตามค่าของคุกกี้
  // watch(
  //   [accessToken],
  //   () => {
  //     updateSignInStatus(); // อัปเดตสถานะเมื่อคุกกี้เปลี่ยน
  //   },
  //   { immediate: true } // เรียกครั้งแรกทันทีเมื่อโหลด
  // );

  // return isUserSignIn;
};
