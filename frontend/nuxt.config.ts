// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
  '@unocss/nuxt'
  ],
  runtimeConfig: {
    public: {
      SOCKET_SERVER_URL: process.env.SOCKET_SERVER_URL || 'http://localhost:3001'
    }
  }
})
