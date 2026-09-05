import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/initialProducts';
import ProductCard from './ProductCard';
import { RefreshCcw } from 'lucide-react';

export default function ProductCatalog() {
  const { 
    products, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery 
  } = useShop();

  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = products.filter((item) => {
    const matchesCategory = activeCategory === 'All Garments' || item.category === activeCategory;
    const matchesSearch = 
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  return (
    <section id="catalog" className="catalog-section" style={{ padding: '4rem 0 6rem 0', backgroundColor: '#ffffff' }}>
      <div className="container-zegna catalog-container">
        
        {/* Category Header & Filters */}
        <div className="catalog-header" style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.74rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', marginBottom: '0.4rem', fontWeight: '600' }}>
            AUTUMN / WINTER COLLECTION
          </div>
          <h2 className="catalog-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: '400', color: '#000000', marginBottom: '1.8rem' }}>
            {activeCategory === 'All Garments' ? 'Ready to Wear Collection' : activeCategory}
          </h2>

          {/* Minimalist Underlined Category Tabs */}
          <div 
            className="catalog-tabs"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              borderBottom: '1px solid #e5e5e5',
              paddingBottom: '0.8rem'
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isActive ? '#000000' : '#777777',
                    fontWeight: isActive ? '700' : '400',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    position: 'relative',
                    paddingBottom: '0.8rem',
                    transition: 'color 0.2s ease'
                  }}
                >
                  {cat}
                  {isActive && (
                    <span 
                      style={{
                        position: 'absolute',
                        bottom: '-1px',
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#000000'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar (Count and Sort) */}
        <div 
          className="catalog-toolbar"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#555' }}>
            Showing <strong>{sortedProducts.length}</strong> items
            {searchQuery && (
              <span style={{ marginLeft: '0.8rem', color: '#000' }}>
                matching "{searchQuery}"
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', marginLeft: '0.4rem', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#777' }}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{
                width: 'auto',
                fontSize: '0.82rem',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer',
                borderColor: '#e0e0e0'
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">New In</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#000', marginBottom: '0.5rem' }}>
              No garments found
            </h3>
            <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Please reset your search filters to explore the complete catalog.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All Garments');
                setSearchQuery('');
              }}
              className="btn-zegna-outline"
            >
              <RefreshCcw size={14} style={{ marginRight: '0.4rem' }} />
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem 2rem' }}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
