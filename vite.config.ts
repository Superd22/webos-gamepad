import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import legacy from '@vitejs/plugin-legacy'
import { load } from 'cheerio'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy({ targets: 'Chrome 53', }),

    {
      name: 'Remove modern bundles',
      enforce: 'post',
      transformIndexHtml: {
        // enforce: 'post',
        transform: (html, ctx) => {
          const $ = load(html);
          console.log("notice me wesh", html)
          $("[type=module]").remove()

          console.log($.html())
          return {
            html: $.html(),
            tags: []
          }
        }
      }
    },
    svelte(),
  ],
  build: {
    rollupOptions: {
      external: ['webos-service']
    }
  },
  base: '',
})
