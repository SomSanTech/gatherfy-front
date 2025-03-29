export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', async (error) => {
    if (error.response?.status === 401) {
      const auth = useAuth();
      await auth.refresh();
    }
  });
});
