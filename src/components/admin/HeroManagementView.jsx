import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { getSupabaseClient, isSupabaseConfigured } from '../../supabaseClient';
import { Plus, Trash2, Image as ImageIcon, Upload, Save } from 'lucide-react';

export default function HeroManagementView() {
  const { heroSlides, setHeroSlides, saveHeroSlidesToSupabase, deleteHeroSlide } = useShop();
  const [uploadingSlideId, setUploadingSlideId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [draftSlide, setDraftSlide] = useState({
    heading: '',
    subtitle: '',
    buttonText: 'Discover More',
    image: '',
    is_active: true
  });

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (event, slideId) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingSlideId(slideId);

    try {
      let uploadedUrl = '';
      const client = isSupabaseConfigured() ? getSupabaseClient() : null;

      if (client) {
        const bucketName = 'product-images';
        const safeName = file.name.replace(/\s+/g, '-').toLowerCase();
        const path = `hero/${Date.now()}-${safeName}`;

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

      updateSlide(slideId, 'image', uploadedUrl);
    } catch (error) {
      console.error('Hero image upload failed:', error);
      alert('Image upload failed. Please try another file or use a URL instead.');
    } finally {
      setUploadingSlideId(null);
      event.target.value = '';
    }
  };

  const handleDraftImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingSlideId('new-slide');
    try {
      let uploadedUrl = '';
      const client = isSupabaseConfigured() ? getSupabaseClient() : null;

      if (client) {
        const safeName = file.name.replace(/\s+/g, '-').toLowerCase();
        const path = `hero/${Date.now()}-${safeName}`;
        const { error } = await client.storage.from('product-images').upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

        if (!error) {
          const { data } = client.storage.from('product-images').getPublicUrl(path);
          uploadedUrl = data?.publicUrl || '';
        }
      }

      const imageUrl = uploadedUrl || await readFileAsDataUrl(file);
      setDraftSlide((current) => ({ ...current, image: imageUrl }));
    } catch (error) {
      console.error('New hero image upload failed:', error);
      alert('Image upload failed. Please try another file or use a URL instead.');
    } finally {
      setUploadingSlideId(null);
      event.target.value = '';
    }
  };

  const updateSlide = (id, field, value) => {
    setHeroSlides(prev =>
      prev.map(slide =>
        slide.id === id ? { ...slide, [field]: value } : slide
      )
    );
  };

  const addSlide = async () => {
    if (isSaving) return;
    if (!draftSlide.heading.trim() || !draftSlide.image.trim()) {
      setSaveStatus({ type: 'error', message: 'Heading and hero image are required.' });
      return;
    }

    const newSlide = {
      id: `hero-slide-${Date.now()}`,
      ...draftSlide,
      heading: draftSlide.heading.trim(),
      image: draftSlide.image.trim()
    };

    const nextSlides = [...heroSlides, newSlide];
    setHeroSlides(nextSlides);
    setIsSaving(true);
    const result = await saveHeroSlidesToSupabase(nextSlides);
    setIsSaving(false);
    if (!result.success) {
      setHeroSlides(heroSlides);
      setSaveStatus({ type: 'error', message: result.message });
    } else {
      setDraftSlide({ heading: '', subtitle: '', buttonText: 'Discover More', image: '', is_active: true });
      setSaveStatus({ type: 'success', message: 'Slide added and saved to the database.' });
    }
  };

  const saveChanges = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const result = await saveHeroSlidesToSupabase(heroSlides);
    setIsSaving(false);
    setSaveStatus({
      type: result.success ? 'success' : 'error',
      message: result.success ? 'All slide changes are saved.' : result.message
    });
  };

  const removeSlide = async (id) => {
    if (heroSlides.length <= 1 || isSaving) return;
    setIsSaving(true);
    const result = await deleteHeroSlide(id);
    setIsSaving(false);
    setSaveStatus({ type: result.success ? 'success' : 'error', message: result.message });
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400 }}>Hero Slide Manager</h2>
          <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.9rem' }}>
            Manage the front-page slider and upload new images from here.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={saveChanges}
            disabled={isSaving || heroSlides.length === 0}
            style={{ background: '#fff', color: '#000', border: '1px solid #111', padding: '0.7rem 1.1rem', cursor: isSaving ? 'wait' : 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: heroSlides.length === 0 ? 0.5 : 1 }}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={addSlide}
            style={{
              background: '#000',
              color: '#fff',
              border: 'none',
              padding: '0.7rem 1.1rem',
              cursor: 'pointer',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            <Plus size={16} />
            {isSaving ? 'Saving...' : 'Add Slide'}
          </button>
        </div>
      </div>

      {saveStatus && (
        <div role="status" style={{ marginBottom: '1.25rem', padding: '0.8rem 1rem', border: `1px solid ${saveStatus.type === 'success' ? '#b7e4c7' : '#f1b5b5'}`, background: saveStatus.type === 'success' ? '#f0fff4' : '#fff5f5', color: saveStatus.type === 'success' ? '#176b3a' : '#9b2226', borderRadius: '6px', fontSize: '0.86rem' }}>
          {saveStatus.message}
        </div>
      )}

      <div style={{ background: '#f7f7f7', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '1rem' }}>New Slide Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <label><span className="form-label">Heading *</span><input className="form-input" value={draftSlide.heading} onChange={(e) => setDraftSlide({ ...draftSlide, heading: e.target.value })} placeholder="Autumn Collection" /></label>
          <label><span className="form-label">Button Text</span><input className="form-input" value={draftSlide.buttonText} onChange={(e) => setDraftSlide({ ...draftSlide, buttonText: e.target.value })} placeholder="Discover More" /></label>
          <label style={{ gridColumn: '1 / -1' }}><span className="form-label">Subtitle</span><input className="form-input" value={draftSlide.subtitle} onChange={(e) => setDraftSlide({ ...draftSlide, subtitle: e.target.value })} placeholder="A refined edit for the season" /></label>
          <div style={{ gridColumn: '1 / -1' }}>
            <span className="form-label">Hero Image *</span>
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input className="form-input" style={{ flex: 1, minWidth: '220px' }} value={draftSlide.image} onChange={(e) => setDraftSlide({ ...draftSlide, image: e.target.value })} placeholder="Paste image URL or upload a file" />
              <input id="new-hero-upload" type="file" accept="image/*" onChange={handleDraftImageUpload} style={{ display: 'none' }} />
              <label htmlFor="new-hero-upload" style={{ background: '#111', color: '#fff', borderRadius: '6px', height: '42px', padding: '0 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <Upload size={14} /> {uploadingSlideId === 'new-slide' ? 'Uploading...' : 'Upload Image'}
              </label>
            </div>
            {draftSlide.image && <img src={draftSlide.image} alt="New hero preview" style={{ display: 'block', width: '180px', height: '90px', objectFit: 'cover', marginTop: '0.8rem', borderRadius: '6px', border: '1px solid #ddd' }} />}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}><input type="checkbox" checked={draftSlide.is_active} onChange={(e) => setDraftSlide({ ...draftSlide, is_active: e.target.checked })} /> <span>Active on storefront</span></label>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {heroSlides.map((slide, index) => (
          <div key={slide.id} style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', fontWeight: 600 }}>
                Slide {index + 1}
              </div>

              {heroSlides.length > 1 && (
                <button
                  onClick={() => removeSlide(slide.id)}
                  style={{
                    border: '1px solid #e0e0e0',
                    background: '#fff',
                    color: '#333',
                    cursor: 'pointer',
                    padding: '0.45rem 0.7rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: '#444', fontWeight: 600 }}>Heading</label>
                <input
                  type="text"
                  value={slide.heading || ''}
                  onChange={(e) => updateSlide(slide.id, 'heading', e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: '#444', fontWeight: 600 }}>Button Text</label>
                <input
                  type="text"
                  value={slide.buttonText || ''}
                  onChange={(e) => updateSlide(slide.id, 'buttonText', e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: '#444', fontWeight: 600 }}>Subtitle</label>
              <input
                type="text"
                value={slide.subtitle || ''}
                onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: '#444', fontWeight: 600 }}>Image URL</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={slide.image || ''}
                  onChange={(e) => updateSlide(slide.id, 'image', e.target.value)}
                  style={{ flex: 1, minWidth: '220px', padding: '0.7rem 0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />

                <input
                  id={`hero-upload-${slide.id}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, slide.id)}
                  style={{ display: 'none' }}
                />

                <label
                  htmlFor={`hero-upload-${slide.id}`}
                  style={{
                    background: '#f5f5f5',
                    border: '1px solid #eaeaea',
                    borderRadius: '6px',
                    minWidth: '120px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    padding: '0 0.8rem',
                    color: '#222',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}
                >
                  {uploadingSlideId === slide.id ? 'Uploading...' : <><Upload size={14} /> Upload</>}
                </label>

                <div style={{ background: '#f5f5f5', border: '1px solid #eaeaea', borderRadius: '6px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={16} color="#777" />
                </div>
              </div>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginTop: '1rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={slide.is_active !== false} onChange={(e) => updateSlide(slide.id, 'is_active', e.target.checked)} />
                {slide.is_active !== false ? 'Active on storefront' : 'Inactive'}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
