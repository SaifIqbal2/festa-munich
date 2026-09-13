import { useEffect } from 'react';

/**
 * SEOHead — Dynamic per-page SEO meta tag manager.
 * Updates document.title and meta description on each page render.
 */
export default function SEOHead({ 
  title, 
  description, 
  canonical,
  ogImage = 'https://festamunich.com/og-image.jpg'
}) {
  const fullTitle = title 
    ? `${title} | Festa Munich`
    : 'Festa Munich | Artisanal Leather & Bespoke Textile Garments';
  
  const metaDesc = description ||
    'Festa Munich — supreme craftsmanship in genuine leather jackets, bespoke textile overcoats, and luxury tailored garments. Handcrafted in Sialkot.';

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', metaDesc);

    // Update OG title
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) ogTitleTag.setAttribute('content', fullTitle);

    // Update OG description
    let ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) ogDescTag.setAttribute('content', metaDesc);

    // Update OG url
    if (canonical) {
      let ogUrlTag = document.querySelector('meta[property="og:url"]');
      if (ogUrlTag) ogUrlTag.setAttribute('content', canonical);
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (canonicalTag) canonicalTag.setAttribute('href', canonical);
    }

    // Update OG image
    if (ogImage) {
      let ogImgTag = document.querySelector('meta[property="og:image"]');
      if (ogImgTag) ogImgTag.setAttribute('content', ogImage);
      let twImgTag = document.querySelector('meta[name="twitter:image"]');
      if (twImgTag) twImgTag.setAttribute('content', ogImage);
    }

    // Update twitter title/desc
    let twTitleTag = document.querySelector('meta[name="twitter:title"]');
    if (twTitleTag) twTitleTag.setAttribute('content', fullTitle);
    let twDescTag = document.querySelector('meta[name="twitter:description"]');
    if (twDescTag) twDescTag.setAttribute('content', metaDesc);

    // Restore defaults on unmount
    return () => {
      document.title = 'Festa Munich | Artisanal Leather & Bespoke Textile Garments';
    };
  }, [fullTitle, metaDesc, canonical, ogImage]);

  return null;
}
