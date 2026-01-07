import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig } from 'vite'
import { pluginExposeRenderer } from './vite.base.config'
import path from 'path'

// https://vitejs.dev/config
export default defineConfig((env: ConfigEnv<'renderer'>) => {
  const forgeEnv = env
  const { root, mode, forgeConfigSelf } = forgeEnv
  const name = forgeConfigSelf.name ?? ''

  console.log('root', root)

  const config: UserConfig = {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`
    },
    plugins: [pluginExposeRenderer(name)],
    resolve: {
      preserveSymlinks: true,
      alias: {
        '~': path.resolve(__dirname, 'src')
      }
    },
    clearScreen: false
  }

  return config
})
