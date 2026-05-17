// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import rehypeSectionize from '@hbsnow/rehype-sectionize';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  markdown: {
    rehypePlugins: [rehypeSectionize],
  },
  fonts: [
    {
      provider:  fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Newsreader',
      cssVariable: '--font-serif',
      weights: ['400 600'],
      styles: ['normal'],
      subsets: ['latin'],
    }
  ],
});
