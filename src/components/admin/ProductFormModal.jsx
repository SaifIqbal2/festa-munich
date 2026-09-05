import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { getSupabaseClient, isSupabaseConfigured } from '../../supabaseClient';
import { X, Plus, Trash2, Image, Sparkles } from 'lucide-react';

export default function ProductFormModal({ product, isOpen, onClose, onSave }) {
  const { categories } = useShop();
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: categories[0]?.name || 'Leather Jackets',
    price: '',
    compare_at_price: '',
    material: '',
    description: '',
    images: [''],
    craftsmanship_details: [''],
    available_sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Cognac'],
    stock: 10,
    is_featured: false,
    badge: 'Iconic'
  });
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImageIndex(index);

    try {
      let uploadedUrl = '';
      const client = isSupabaseConfigured() ? getSupabaseClient() : null;

      if (client) {
        const bucketName = 'product-images';
        const safeName = file.name.replace(/\s+/g, '-').toLowerCase();
        const path = `${Date.now()}-${safeName}`;

        const { error } = await client.storage.from(bucketName).upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

        if (!error) {
          const { data } = client.storage.from(bucketName).getPublicUrl(path);
          uploadedUrl = data?.publicUrl || '';
        }
      }

      if (!uploadedUrl) {
        uploadedUrl = await readFileAsDataUrl(file);
      }

      const updated = [...formData.images];
      updated[index] = uploadedUrl;
      setFormData({ ...formData, images: updated });
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed. Please use an image URL instead or try another file.');
    } finally {
      setUploadingImageIndex(null);
      event.target.value = '';
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const fallbackCategory = categories[0]?.name || 'Leather Jackets';

    if (product) {
      setFormData({
        title: product.title || '',
        subtitle: product.subtitle || '',
        category: product.category || fallbackCategory,
        price: product.price || '',
        compare_at_price: product.compare_at_price || '',
        material: product.material || '',
        description: product.description || '',
        images: product.images?.length ? product.images : [''],
        craftsmanship_details: product.craftsmanship_details?.length ? product.craftsmanship_details : [''],
        available_sizes: product.available_sizes || ['S', 'M', 'L', 'XL'],
        colors: product.colors || ['Black'],
        stock: product.stock !== undefined ? product.stock : 10,
        is_featured: Boolean(product.is_featured),
        badge: product.badge || ''
      });
      return;
    }

    setFormData({
      title: '',
      subtitle: '',
      category: fallbackCategory,
      price: '',
      compare_at_price: '',
      material: '100% Full-Grain Calfskin Leather',
      description: '',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop'],
      craftsmanship_details: ['Hand-waxed vegetable-tanned leather', 'Breathable cupro lining', 'Swiss gunmetal zippers'],
      available_sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black Onyx', 'Cognac Brown'],
      stock: 12,
      is_featured: true,
      badge: 'New Season'
    });
  }, [isOpen, product?.id]);

  if (!isOpen) return null;

  const handleImageChange = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.images];
      updated[index] = value;
      return { ...prev, images: updated };
    });
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDetailChange = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.craftsmanship_details];
      updated[index] = value;
      return { ...prev, craftsmanship_details: updated };
    });
  };

  const addDetailField = () => {
    setFormData(prev => ({ ...prev, craftsmanship_details: [...prev.craftsmanship_details, ''] }));
  };

  const removeDetailField = (index) => {
    setFormData(prev => ({
      ...prev,
      craftsmanship_details: prev.craftsmanship_details.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) {
      alert('Please fill out Title, Category, and Price.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : null,
      stock: Number(formData.stock || 0),
      images: formData.images.filter(img => img.trim().length > 0),
      craftsmanship_details: formData.craftsmanship_details.filter(d => d.trim().length > 0)
    };

    onSave(payload);
    onClose();
  };

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      style={{ 
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', 
        zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem' 
      }}
    >
      <div 
        className="animate-slide-up"
        style={{
          backgroundColor: '#fff',
          border: '1px solid #eaeaea',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          position: 'relative',
          borderRadius: '8px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #eaeaea',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fbfbfb',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>Product Catalog Manager</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#000', marginTop: '0.2rem', fontWeight: 400 }}>
              {product ? 'Edit Garment Details' : 'Add New Garment'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Title & Subtitle */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Garment Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Heritage Full-Grain Calfskin Biker Jacket"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Subtitle / Sub-headline</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Hand-Waxed Italian Patina"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Category & Material */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#fff' }}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Fabric / Material Composition *</label>
                <input
                  type="text"
                  required
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g. 100% Full-Grain Calfskin Leather"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Price, Compare Price, Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Price (USD $) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="890"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Compare-At Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compare_at_price}
                  onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                  placeholder="1150"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Inventory Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="15"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Badge</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Iconic"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Editorial Description *</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Narrative describing the cut, lining, hardware, and provenance..."
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* Image URLs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', margin: 0 }}>High-Resolution Image URLs</label>
                <button 
                  type="button" 
                  onClick={addImageField}
                  style={{ background: 'none', border: 'none', color: '#000', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}
                >
                  <Plus size={14} /> Add Image
                </button>
              </div>
              {formData.images.map((img, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <label
                    style={{
                      background: '#f5f5f5',
                      border: '1px solid #ddd',
                      color: '#333',
                      padding: '0.7rem 0.9rem',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {uploadingImageIndex === idx ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, idx)}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(idx)}
                      style={{ background: '#f5f5f5', border: '1px solid #ddd', color: '#666', padding: '0 0.8rem', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Craftsmanship Specs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', margin: 0 }}>Craftsmanship Highlights</label>
                <button 
                  type="button" 
                  onClick={addDetailField}
                  style={{ background: 'none', border: 'none', color: '#000', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}
                >
                  <Plus size={14} /> Add Highlight
                </button>
              </div>
              {formData.craftsmanship_details.map((detail, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => handleDetailChange(idx, e.target.value)}
                    placeholder="e.g. 100% Vegetable-tanned Italian calfskin"
                    style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', outline: 'none' }}
                  />
                  {formData.craftsmanship_details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDetailField(idx)}
                      style={{ background: '#f5f5f5', border: '1px solid #ddd', color: '#666', padding: '0 0.8rem', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Featured toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: '#f9f9f9', border: '1px solid #eaeaea', borderRadius: '6px' }}>
              <input
                type="checkbox"
                id="featuredCheck"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                style={{ accentColor: '#000', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="featuredCheck" style={{ fontSize: '0.9rem', color: '#333', cursor: 'pointer', fontWeight: 500 }}>
                Feature this product on homepage signature showcase
              </label>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.85rem', background: '#fff', border: '1px solid #ddd', color: '#333', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, borderRadius: '4px' }}>
                Cancel
              </button>
              <button type="submit" style={{ flex: 2, padding: '0.85rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {product ? 'Save Changes' : 'Publish to Store'}
              </button>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
