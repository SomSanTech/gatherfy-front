export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', async (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized error detected.');
      const auth = useAuth();
      await auth.refresh();
    }
  });
});
