import React, { useState, useEffect } from 'react';
import { Search, Loader, TrendingUp } from 'lucide-react';
import { useModernStore } from '../../stores/modernStore';
import { aiSearchService } from '../../services/aiSearchService';
import analyticsService from '../../services/analyticsService';
import './AISearchBar.css';

export const AISearchBar = ({ products = [], onSearch, onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addToSearchHistory, searchHistory } = useModernStore();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      setIsLoading(true);
      
      // Simulate AI search delay
      setTimeout(() => {
        const suggestions = aiSearchService.getSearchSuggestions(products, value);
        setSuggestions(suggestions);
        
        const results = aiSearchService.performAISearch(products, value);
        setResults(results.slice(0, 5));
        
        setIsLoading(false);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim().length === 0) return;

    addToSearchHistory(searchQuery);
    analyticsService.trackSearch(searchQuery, results.length);
    
    if (onSearch) {
      onSearch(searchQuery);
    }

    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleResultClick = (product) => {
    addToSearchHistory(query);
    analyticsService.trackProductView(product.id, { source: 'ai_search' });
    
    if (onSelect) {
      onSelect(product);
    }

    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="ai-search-container">
      <div className="ai-search-bar">
        <Search className="search-icon" size={20} />
        
        <input
          type="text"
          placeholder="Search products, materials, styles..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />

        {isLoading && <Loader className="search-loader" size={18} />}

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setResults([]);
              setShowSuggestions(false);
            }}
            className="clear-search"
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="ai-search-dropdown">
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="search-section">
              <h4 className="section-title">Suggestions</h4>
              <div className="suggestions-list">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-item"
                  >
                    <Search size={16} />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Search Results */}
          {results.length > 0 && (
            <div className="search-section">
              <h4 className="section-title">Top Results</h4>
              <div className="results-list">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product)}
                    className="result-item"
                  >
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="result-image"
                      />
                    )}
                    <div className="result-info">
                      <p className="result-title">{product.title}</p>
                      <p className="result-price">${product.price.toFixed(2)}</p>
                      {product.avg_rating > 0 && (
                        <p className="result-rating">
                          ⭐ {product.avg_rating.toFixed(1)} ({product.review_count})
                        </p>
                      )}
                    </div>
                    {product.searchScore && (
                      <div className="search-score">
                        <TrendingUp size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {query === '' && searchHistory.length > 0 && (
            <div className="search-section">
              <h4 className="section-title">Recent Searches</h4>
              <div className="history-list">
                {searchHistory.slice(0, 5).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    className="history-item"
                  >
                    <Search size={14} />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query && suggestions.length === 0 && results.length === 0 && !isLoading && (
            <div className="no-results">
              <p>No products found for "{query}"</p>
              <p>Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISearchBar;
