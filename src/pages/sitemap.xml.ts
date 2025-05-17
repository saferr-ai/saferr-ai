import { getCollection } from 'astro:content';
import { type APIRoute } from 'astro';

const SITE_URL = 'https://saferrai.com';

export const GET: APIRoute = async () => {
  const blogPosts = await getCollection('blog');

  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'weekly', lastmod: undefined },
    { loc: `${SITE_URL}/publications`, priority: '0.8', changefreq: 'monthly', lastmod: undefined },
    { loc: `${SITE_URL}/people`, priority: '0.8', changefreq: 'monthly', lastmod: undefined },
    { loc: `${SITE_URL}/news`, priority: '0.8', changefreq: 'weekly', lastmod: undefined },
    { loc: `${SITE_URL}/blog`, priority: '0.8', changefreq: 'weekly', lastmod: undefined },
    ...blogPosts.map(post => ({
      loc: `${SITE_URL}/blog/${post.slug}`,
      lastmod: post.data.date instanceof Date ? post.data.date.toISOString() : new Date(post.data.date).toISOString(),
      priority: '0.6',
      changefreq: 'yearly',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}; 