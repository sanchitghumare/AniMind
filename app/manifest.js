// app/manifest.js
export default function manifest() {
  return {
    name: 'Animind App',
    short_name: 'Animind',
    description: 'An awesome anime profile application',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b', // Matches a sleek dark theme
    theme_color: '#09090b',
    icons: [
      {
        src: '/icon.png', // Points to public/icon.png or your root app icon
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}