// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["nuxt-vuefire", "@nuxthq/ui"],
  ssr: true,

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ["/"],
      ignore: ["/login"],
    },
  },

  app: {
    head: {
      title: "Calendar Log App",
      link: [
        {
          href: "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css",
          rel: "stylesheet",
        },
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/vuefire.svg",
        },
      ],
    },
  },

  devServer: {
    host: "0.0.0.0",
  },

  css: ["@/assets/style.css"],
  vuefire: {
    auth: true,
    config: {
      apiKey: "AIzaSyBBGw8c8NcLXmSAqMcctS1zybaNxSPenK4",
      authDomain: "calendar-log-b65f5.firebaseapp.com",
      projectId: "calendar-log-b65f5",
      storageBucket: "calendar-log-b65f5.appspot.com",
      messagingSenderId: "525257340348",
      appId: "1:525257340348:web:12302b7721a59454fce7b9",
      measurementId: "G-0QH6YDGBZR",
    },
    admin: {
      serviceAccount: "./service-account.json",
    },
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },

  routeRules: {},
})
