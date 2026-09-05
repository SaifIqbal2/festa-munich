import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/home/HeroBanner';
import EditorialQuoteSection from '../components/home/EditorialQuoteSection';
import IconicCollection from '../components/home/IconicCollection';
import CraftsmanshipStory from '../components/home/CraftsmanshipStory';
import BespokeConcierge from '../components/home/BespokeConcierge';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <HeroBanner onExploreCatalog={() => navigate('/shop')} />
      <EditorialQuoteSection onExploreCatalog={() => navigate('/shop')} />
      <IconicCollection onExploreCatalog={() => navigate('/shop')} />
      <CraftsmanshipStory />
      <BespokeConcierge />
    </>
  );
}
