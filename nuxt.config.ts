// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: { strict: true },
  nitro: {
    preset: 'cloudflare-pages',
    storage: {
      cache: {
        driver: 'cloudflare-kv-binding',
        binding: 'KV_CACHE',
      },
    },
  },
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
  },
})
