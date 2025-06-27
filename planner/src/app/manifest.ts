import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MatchMyPlan',
    short_name: 'MMP',
    description: 'A planner with everything you need to plan your day, week, or month.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icons/pwa-icons/favicon-196.png',
        sizes: '196x196',
        type: 'image/png',
      },
      {
        src: '/icons/pwa-icons/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/pwa-icons/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/pwa-icons/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/pwa-icons/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}