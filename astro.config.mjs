// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      compatibilityDate: '2026-04-13',
      enabled: false,
    },
  }),
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});
