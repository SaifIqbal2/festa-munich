// SEO Optimization Service - Meta tags, structured data, and SEO helpers
export const seoService = {
  setMetaTags: (config) => {
    const {
      title = 'Festa Munich - Luxury Fashion Brand',
      description = 'Discover exquisite handcrafted luxury fashion at Festa Munich. Premium leather goods, bespoke tailoring, and sustainable design.',
      keywords = 'luxury fashion, leather goods, bespoke tailoring, handcrafted',
      image = '/og-image.jpg',
      url = window.location.href,
      type = 'website',
    } = config;

    // Title
    document.title = title;
    seoService.setTag('meta', 'name', 'description', description);
    seoService.setTag('meta', 'name', 'keywords', keywords);

    // OpenGraph
    seoService.setTag('meta', 'property', 'og:title', title);
    seoService.setTag('meta', 'property', 'og:description', description);
    seoService.setTag('meta', 'property', 'og:image', image);
    seoService.setTag('meta', 'property', 'og:url', url);
    seoService.setTag('meta', 'property', 'og:type', type);

    // Twitter
    seoService.setTag('meta', 'name', 'twitter:title', title);
    seoService.setTag('meta', 'name', 'twitter:description', description);
    seoService.setTag('meta', 'name', 'twitter:image', image);
    seoService.setTag('meta', 'name', 'twitter:card', 'summary_large_image');

    // Canonical
    seoService.setCanonical(url);
  },

  setTag: (tag, attrName, attrValue, content) => {
    let element = document.querySelector(`${tag}[${attrName}="${attrValue}"]`);

    if (!element) {
      element = document.createElement(tag);
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  },

  setCanonical: (url) => {
    let canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    canonical.href = url;
  },

  createStructuredData: (type, data) => {
    const schemaTypes = {
      product: {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: data.title,
        image: data.images,
        description: data.description,
        brand: {
          '@type': 'Brand',
          name: 'Festa Munich',
        },
        offers: {
          '@type': 'Offer',
          url: data.url,
          priceCurrency: 'USD',
          price: data.price,
          availability: data.stock > 0 ? 'InStock' : 'OutOfStock',
        },
        aggregateRating: data.avg_rating
          ? {
              '@type': 'AggregateRating',
              ratingValue: data.avg_rating,
              reviewCount: data.review_count,
            }
          : undefined,
      },

      organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Festa Munich',
        url: 'https://festamunich.com',
        logo: '/logo.png',
        description: 'Luxury handcrafted fashion brand',
        sameAs: [
          'https://www.instagram.com/festamunich',
          'https://www.facebook.com/festamunich',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+49-XXX-XXXX',
          contactType: 'Customer Service',
        },
      },

      breadcrumb: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },

      review: {
        '@context': 'https://schema.org/',
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: data.rating,
        },
        author: {
          '@type': 'Person',
          name: data.authorName,
        },
        reviewBody: data.comment,
      },
    };

    return schemaTypes[type];
  },

  injectStructuredData: (type, data) => {
    const schema = seoService.createStructuredData(type, data);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  },

  generateSitemap: (pages) => {
    const baseUrl = 'https://festamunich.com';
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
          (page) => `
      <url>
        <loc>${baseUrl}${page.path}</loc>
        <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${page.changefreq || 'weekly'}</changefreq>
        <priority>${page.priority || 0.5}</priority>
      </url>
    `
        )
        .join('')}
    </urlset>`;

    return sitemap;
  },

  generateRobotsTxt: () => {
    return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /private

Sitemap: https://festamunich.com/sitemap.xml
`;
  },

  optimizeImages: (imageUrl, options = {}) => {
    const {
      width = 800,
      height = 600,
      quality = 80,
      format = 'webp',
    } = options;

    // Using a CDN-like approach (stub)
    return `${imageUrl}?w=${width}&h=${height}&q=${quality}&fmt=${format}`;
  },

  generateImageSrcset: (imageUrl, sizes = [320, 640, 1024, 1920]) => {
    return sizes.map((size) => `${seoService.optimizeImages(imageUrl, { width: size })} ${size}w`).join(', ');
  },
};

export default seoService;
