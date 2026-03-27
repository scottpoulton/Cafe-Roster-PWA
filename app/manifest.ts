import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cafe Roster',
    short_name: 'Roster',
    description: 'A modern shift management app for cafes.',
    start_url: '/',
    display: 'standalone', // This hides the browser address bar!
    background_color: '#09090b', // Matches our dark mode background
    theme_color: '#09090b',
    icons: [
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}