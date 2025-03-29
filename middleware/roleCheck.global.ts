export default defineNuxtRouteMiddleware((to, from) => {
  const role = useCookie('roleCookie');

  if (!role.value) {
    if (to.path.includes('backoffice')) {
      // return abortNavigation();
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
