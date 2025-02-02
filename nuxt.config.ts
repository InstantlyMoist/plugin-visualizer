// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  mongoose: {
    uri: process.env.MONGODB_CONNECTION_URI || 'mongodb://localhost:27017/test',
  },
  nitro: {
    storage: {
      db: {
        driver: 'fs',
        base: './data/db'
      }
    },
    experimental: {
      tasks: true
    },
    scheduledTasks: {
      '*/5 * * * *': ['remove_old']
    }
  },
  nuxtRateLimit: {
    enabled: true,

    routes: {
      '/api/v1/plugins/upload': {
        maxRequests: 1,
        intervalSeconds: 30,
      },
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-mongoose',
    '@nuxt/icon',
    '@nuxt/image',
    'nuxt-rate-limit'
  ]
})