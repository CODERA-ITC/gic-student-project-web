// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  // srcDir: "app",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/eslint",
  ],
  css: ["~/assets/css/main.css"],

  // Add Google Fonts
  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
        },
      ],
    },
  },
  // Vite configuration
  vite: {
    server: {
      hmr: {
        protocol: "ws",
        host: "localhost",
        port: 24679,
      },
    },
  },

  // Enable TypeScript checking in dev
  typescript: {
    typeCheck: false,
    strict: false,
  },

  colorMode: {
    preference: "light",
    classSuffix: "",
  },

  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3017", // Backend API base URL
    },
  },

  // Auto-import configuration
  imports: {
    autoImport: true,
    dirs: ["stores", "types", "composables"],
  },

  // Component auto-discovery
  // components: [
  //   {
  //     path: "~/components",
  //     pathPrefix: false,
  //   },
  //   {
  //     path: "~/app/components",
  //     // pathPrefix: false,
  //   },
  // ],

  ui: {},
});
