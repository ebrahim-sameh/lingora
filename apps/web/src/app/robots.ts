import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/listen/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://lingora.vercel.app'}/sitemap.xml`,
  };
}
