import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
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
export default defineConfig({
  base: '/sinau-jp',
  define: {
    APP_VERSION: JSON.stringify(packageJson.version),
    APP_NAME: JSON.stringify(packageJson.name)
  },
  plugins: [
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
