import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/helpers';
import ProductFormModal from './ProductFormModal';
import { Plus, Edit2, Trash2, Search, Sparkles, AlertCircle } from 'lucide-react';

export default function ProductManagementView() {
  const { products, addProduct, updateProduct, deleteProduct, currency, categories } = useShop();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.material.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSave = (payload) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Top Action Bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '400', fontFamily: 'var(--font-serif)', margin: '0 0 0.5rem 0' }}>
            Garment Inventory Catalog
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
            Manage active luxury garments, pricing, high-res photography, and atelier descriptions.
          </p>
        </div>

        <button onClick={handleOpenAdd} style={{ background: '#000', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} />
          Add New Garment
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div 
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          background: '#fff',
          padding: '1rem',
          border: '1px solid #eaeaea',
          borderRadius: '6px'
        }}
      >
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search products by title or material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem', border: '1px solid #ddd', outline: 'none', fontSize: '0.9rem' }}
          />
          <Search size={16} color="#888" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div style={{ minWidth: '180px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid #ddd', outline: 'none', fontSize: '0.9rem', backgroundColor: '#fff' }}
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table List */}
      <div style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eaeaea', background: '#fbfbfb', color: '#555' }}>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Garment</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Category</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Price</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Stock</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '1rem 1.2rem', fontWeight: '600', textAlign: 'right', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#777' }}>
                  No garments match your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((prod) => (
                <tr 
                  key={prod.id} 
                  style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Thumbnail & Title */}
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                      <div style={{ width: '48px', height: '60px', background: '#f5f5f5', overflow: 'hidden', border: '1px solid #eaeaea' }}>
                        {prod.images?.[0] ? (
                          <img src={prod.images[0]} alt={prod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>FM</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#111' }}>{prod.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>{prod.material}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '1rem 1.2rem', color: '#444' }}>
                    {prod.category}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '1rem 1.2rem', fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#000', fontWeight: '500' }}>
                    {formatPrice(prod.price, currency)}
                  </td>

                  {/* Stock */}
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span style={{ 
                      color: (prod.stock || 0) < 5 ? '#d97706' : '#059669',
                      fontWeight: '500'
                    }}>
                      {prod.stock || 0} units
                    </span>
                  </td>

                  {/* Badge / Featured */}
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {prod.is_featured && (
                        <span style={{ fontSize: '0.65rem', color: '#000', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Sparkles size={12} /> Featured
                        </span>
                      )}
                      {prod.badge && (
                        <span style={{ fontSize: '0.65rem', background: '#f0f0f0', color: '#333', padding: '0.2rem 0.5rem', borderRadius: '12px', display: 'inline-block', width: 'max-content' }}>
                          {prod.badge}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '0.4rem 0.7rem', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#333' }}
                        title="Edit details"
                      >
                        <Edit2 size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => setProductToDelete(prod)}
                        style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '0.4rem 0.7rem', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal (Add / Edit) */}
      {isFormOpen && (
        <ProductFormModal
          isOpen={isFormOpen}
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="modal-overlay" onClick={() => setProductToDelete(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            style={{
              backgroundColor: '#fff',
              border: '1px solid #eaeaea',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '450px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ color: '#000', fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
              Confirm Deletion
            </h4>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
              Are you sure you want to remove <strong>"{productToDelete.title}"</strong> from the store catalog? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setProductToDelete(null)}
                style={{ flex: 1, padding: '0.75rem', background: '#f5f5f5', border: '1px solid #ddd', color: '#333', cursor: 'pointer', borderRadius: '4px' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
              >
                Delete Garment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
