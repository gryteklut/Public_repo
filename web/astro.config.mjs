// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

// https://gryteklut.github.io/Public_repo/
export default defineConfig({
  site: 'https://gryteklut.github.io',
  base: '/Public_repo',
  integrations: [react()],
  trailingSlash: 'always',
})
