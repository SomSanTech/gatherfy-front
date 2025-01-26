export default defineNuxtRouteMiddleware((to, from) => {
  const role = useCookie('roleCookie');
  console.log('roleck', role.value);

  if (role.value?.trim() === 'Attendee') {
    console.log('yes');

    if (to.path.includes('backoffice')) {
      // return abortNavigation();
      return navigateTo('/');
    }
  } else {
    return;
  }

  // if (role.value?.trim() === 'Organization') {
  //   console.log('yes');
  //   navigateTo('/');
  //   // if (to.path.includes('backoffice')) {
  //   //   // return abortNavigation();
  //   //   return
  //   // }
  // }
});
