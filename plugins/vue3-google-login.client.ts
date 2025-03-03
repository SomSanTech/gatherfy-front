// plugins/vue3-google-login.client.ts
import vue3GoogleLogin from 'vue3-google-login';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3GoogleLogin, {
    clientId:
      '791441779465-25p6jvgk58ldmlhge5g7ac2f5r0flot0.apps.googleusercontent.com',
  });
});
