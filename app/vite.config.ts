import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import legacy from '@vitejs/plugin-legacy'
import { load } from 'cheerio'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy({ targets: 'Chrome 53', }),
    process.env.NODE_ENV !== 'dev' ?
      {
        name: 'Remove modern bundles',
        enforce: 'post',
        transformIndexHtml: {
          transform: (html, ctx) => {
            const $ = load(html)
            $("[type=module]").remove()
            $("script").removeAttr('nomodule').removeAttr('crossorigin ')
            return {
              html: $.html(),
              tags: []
            }
          }
        }
      } as const : undefined,
    svelte(),
    tsconfigPaths()
  ].filter(p => !!p),
  build: {
    outDir: "../dist/app",
    emptyOutDir: true,
    rollupOptions: {
      external: ['webos-service']
    }
  },
  base: '',
})
