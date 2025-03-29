// plugins/vue3-google-login.client.ts
import vue3GoogleLogin from 'vue3-google-login';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3GoogleLogin, {
    clientId:
      '208535017949-i5clt2a567g51nhu9lj58ctdqo8vkp2i.apps.googleusercontent.com',
  });
});
