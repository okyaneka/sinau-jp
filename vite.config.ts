import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Layouts from 'vite-plugin-vue-layouts'
import Pages from 'vite-plugin-pages'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import packageJson from './package.json'

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  const APP_NAME = JSON.stringify(packageJson.name)
  const APP_VERSION = JSON.stringify(packageJson.version)

  return defineConfig({
    base: process.env.mode == 'dev' ? '/sinau-jp' : '/',
    define: {
      APP_VERSION,
      APP_NAME
    },
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifest: {
          screenshots: [
            {
              src: 'img/app.png',
              type: 'image/png',
              sizes: '1080x1080',
              form_factor: 'narrow'
            },
            {
              src: 'img/app.png',
              type: 'image/png',
              sizes: '1080x1080',
              form_factor: 'wide'
            }
          ],
          name: process.env.VITE_APP_NAME,
          short_name: APP_NAME,
          description: '',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'img/icons/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'img/icons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        devOptions: {
          enabled: true
        },
        workbox: {
          clientsClaim: true,
          skipWaiting: true
        }
      }),
      vue(),
      AutoImport({
        dts: 'src/autoimport.d.ts',
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
          'pinia',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ],
        eslintrc: { enabled: true },
        resolvers: [NaiveUiResolver()],
        dirs: ['src/models', 'src/middlewares', 'src/plugins']
      }),
      Components({
        dts: 'src/components.d.ts',
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dirs: ['src/components'],
        directoryAsNamespace: true,
        resolvers: [NaiveUiResolver(), IconsResolver()]
      }),
      Icons({
        autoInstall: true,
        compiler: 'vue3'
      }),
      Pages({
        dirs: [{ baseRoute: '', dir: 'src/views' }]
      }),
      Layouts({
        layoutsDirs: 'src/layouts'
      })
    ],
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}
