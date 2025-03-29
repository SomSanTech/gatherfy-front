export default defineNuxtRouteMiddleware((to, from) => {
  const role = useCookie('roleCookie');
  const profileData = useCookie('profileData');

  if (!role.value) {
    if (to.path.includes('backoffice')) {
      // return abortNavigation();
      return navigateTo('/');
    }
  }
  if (!profileData.value) {
    if (
      to.path.includes('profile') ||
      to.path.includes('contact') ||
      to.path.includes('ticket')
    ) {
      return navigateTo('/');
    }
  }
  if (role.value?.trim() === 'Attendee') {
    if (to.path.includes('backoffice')) {
      // return abortNavigation();
      return navigateTo('/');
    }
  } else {
    return;
  }
});
