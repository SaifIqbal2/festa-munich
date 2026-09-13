import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/home/HeroBanner';
import EditorialQuoteSection from '../components/home/EditorialQuoteSection';
import IconicCollection from '../components/home/IconicCollection';
import CraftsmanshipStory from '../components/home/CraftsmanshipStory';
import BespokeConcierge from '../components/home/BespokeConcierge';
import SEOHead from '../components/common/SEOHead';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Artisanal Leather & Bespoke Textile Garments"
        description="Festa Munich — where European elegance meets Sialkot craftsmanship. Shop genuine leather jackets, cashmere overcoats, and bespoke tailored garments."
        canonical="https://festamunich.com/"
      />
      <HeroBanner onExploreCatalog={() => navigate('/shop')} />
      <EditorialQuoteSection onExploreCatalog={() => navigate('/shop')} />
      <IconicCollection onExploreCatalog={() => navigate('/shop')} />
      <CraftsmanshipStory />
      <BespokeConcierge />
    </>
  );
}

