export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
});
