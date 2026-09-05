import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

const CategoryManagementView = () => {
  const { categories, addCategory, updateCategory, deleteCategory, addSubcategory, deleteSubcategory } = useShop();
  
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  
  const [newSubcatName, setNewSubcatName] = useState('');
  const [addingSubcatToId, setAddingSubcatToId] = useState(null);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      addCategory(newCatName);
      setNewCatName('');
    }
  };

  const handleUpdateCategory = (id) => {
    if (editCatName.trim()) {
      updateCategory(id, editCatName);
    }
    setEditingCatId(null);
  };

  const handleAddSubcategory = (e, catId) => {
    e.preventDefault();
    if (newSubcatName.trim()) {
      addSubcategory(catId, newSubcatName);
      setNewSubcatName('');
      setAddingSubcatToId(null);
    }
  };

  return (
    <div className="admin-categories-view" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '400', fontFamily: 'var(--font-serif)', margin: '0 0 0.5rem 0' }}>Collection Hierarchy</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>Manage top-level categories and their sub-collections.</p>
        </div>
      </div>

      <div className="add-category-card" style={{ background: '#fff', padding: '1.5rem', border: '1px solid #eaeaea', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Create New Category</h3>
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="e.g., Bespoke Footwear" 
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #ddd', outline: 'none', fontSize: '0.95rem' }}
          />
          <button 
            type="submit" 
            disabled={!newCatName.trim()}
            style={{ 
              background: '#000', color: '#fff', border: 'none', padding: '0 1.5rem', 
              cursor: newCatName.trim() ? 'pointer' : 'not-allowed', 
              opacity: newCatName.trim() ? 1 : 0.5,
              textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem'
            }}>
            Add Category
          </button>
        </form>
      </div>

      <div className="categories-grid" style={{ display: 'grid', gap: '1.5rem' }}>
        {categories.map((cat) => (
          <div key={cat.id} className="category-card" style={{ background: '#fff', border: '1px solid #eaeaea' }}>
            <div className="cat-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc' }}>
              {editingCatId === cat.id ? (
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1, marginRight: '1rem' }}>
                  <input 
                    type="text" 
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    autoFocus
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd' }}
                  />
                  <button onClick={() => handleUpdateCategory(cat.id)} style={{ background: '#000', color: '#fff', border: 'none', padding: '0 0.75rem', cursor: 'pointer' }}><Check size={16} /></button>
                  <button onClick={() => setEditingCatId(null)} style={{ background: '#f5f5f5', color: '#000', border: '1px solid #ddd', padding: '0 0.75rem', cursor: 'pointer' }}><X size={16} /></button>
                </div>
              ) : (
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{cat.name}</h3>
              )}
              
              {editingCatId !== cat.id && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => { setEditingCatId(cat.id); setEditCatName(cat.name); }}
                    style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '0.25rem' }}
                    title="Edit Category Name"
                  ><Edit2 size={16} /></button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${cat.name}" and all its subcategories?`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.25rem' }}
                    title="Delete Category"
                  ><Trash2 size={16} /></button>
                </div>
              )}
            </div>
            
            <div className="cat-body" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {(cat.subcategories || []).map((subcat, idx) => {
                  // Handle both string and object formats
                  const subcatName = typeof subcat === 'string' ? subcat : subcat.name;
                  const subcatKey = typeof subcat === 'string' ? subcat : subcat.id || idx;
                  
                  return (
                  <div key={subcatKey} style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    background: '#f5f5f5', padding: '0.4rem 0.75rem', 
                    fontSize: '0.9rem', color: '#333' 
                  }}>
                    <span>{subcatName}</span>
                    <button 
                      onClick={() => {
                        if (window.confirm(`Delete sub-category "${subcatName}"?`)) {
                          deleteSubcategory(cat.id, subcatName);
                        }
                      }}
                      style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: 0, display: 'flex' }}
                    ><X size={14} /></button>
                  </div>
                  );
                })}
                {(!cat.subcategories || cat.subcategories.length === 0) && (
                  <span style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>No sub-categories added yet.</span>
                )}
              </div>

              {addingSubcatToId === cat.id ? (
                <form onSubmit={(e) => handleAddSubcategory(e, cat.id)} style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px' }}>
                  <input 
                    type="text" 
                    placeholder="Sub-category name..." 
                    value={newSubcatName}
                    onChange={(e) => setNewSubcatName(e.target.value)}
                    autoFocus
                    style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '0 1rem', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'uppercase' }}>Add</button>
                  <button type="button" onClick={() => setAddingSubcatToId(null)} style={{ background: '#f5f5f5', color: '#000', border: '1px solid #ddd', padding: '0 0.75rem', cursor: 'pointer' }}>Cancel</button>
                </form>
              ) : (
                <button 
                  onClick={() => setAddingSubcatToId(cat.id)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.4rem', 
                    background: 'none', border: 'none', color: '#000', 
                    cursor: 'pointer', fontSize: '0.9rem', padding: 0,
                    fontWeight: 500
                  }}>
                  <Plus size={16} /> Add Sub-category
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagementView;
