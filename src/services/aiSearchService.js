// AI Search & Recommendations Service - Intelligent product discovery
export const aiSearchService = {
  // AI-powered search with semantic understanding
  performAISearch: (products, query) => {
    if (!query.trim()) return products;

    const lowerQuery = query.toLowerCase();
    const keywords = query.split(' ').filter(k => k.length > 2);

    // Scoring algorithm
    const scored = products.map((product) => {
      let score = 0;

      // Title match (highest weight)
      if (product.title.toLowerCase().includes(lowerQuery)) {
        score += 100;
      }
      keywords.forEach((keyword) => {
        if (product.title.toLowerCase().includes(keyword)) score += 50;
      });

      // Description match
      if (product.description.toLowerCase().includes(lowerQuery)) {
        score += 30;
      }
      keywords.forEach((keyword) => {
        if (product.description.toLowerCase().includes(keyword)) score += 15;
      });

      // Category match
      if (product.category.toLowerCase().includes(lowerQuery)) {
        score += 25;
      }

      // Material match
      if (product.material.toLowerCase().includes(lowerQuery)) {
        score += 20;
      }

      // AI tags (from ML model)
      if (product.ai_tags) {
        product.ai_tags.forEach((tag) => {
          if (tag.toLowerCase().includes(lowerQuery)) score += 40;
          keywords.forEach((keyword) => {
            if (tag.toLowerCase().includes(keyword)) score += 20;
          });
        });
      }

      // Trending & new products get slight boost
      if (product.is_trending) score += 10;
      if (product.is_new) score += 5;

      // High-rated products boost
      if (product.avg_rating >= 4.5) score += 8;
      if (product.avg_rating >= 4.0) score += 4;

      return { ...product, searchScore: score };
    });

    return scored.filter((p) => p.searchScore > 0).sort((a, b) => b.searchScore - a.searchScore);
  },

  // Get personalized recommendations based on user behavior
  getPersonalizedRecommendations: (currentProduct, allProducts, userViewedProducts = []) => {
    const recommendations = [];

    allProducts.forEach((product) => {
      if (product.id === currentProduct.id) return;
      if (userViewedProducts.includes(product.id)) return;

      let score = 0;

      // Same category
      if (product.category === currentProduct.category) score += 40;

      // Same material
      if (product.material === currentProduct.material) score += 30;

      // Similar price range (within 20%)
      const priceDiff = Math.abs(product.price - currentProduct.price);
      const priceThreshold = currentProduct.price * 0.2;
      if (priceDiff <= priceThreshold) score += 25;

      // High rating
      if (product.avg_rating >= 4.5) score += 20;
      if (product.avg_rating >= 4.0) score += 10;

      // Trending products
      if (product.is_trending) score += 15;

      // Featured products
      if (product.is_featured) score += 10;

      if (score > 0) {
        recommendations.push({ ...product, recommendationScore: score });
      }
    });

    return recommendations
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 8);
  },

  // Get trending/popular products
  getTrendingProducts: (products) => {
    return products
      .filter((p) => p.is_trending || p.avg_rating >= 4.0)
      .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
      .slice(0, 12);
  },

  // Smart filters based on user preference
  applySmartFilters: (products, filters) => {
    return products.filter((product) => {
      // Price filter
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;

      // Category filter
      if (filters.category && product.category !== filters.category) return false;

      // Material filter
      if (filters.material && product.material !== filters.material) return false;

      // Rating filter
      if (filters.minRating && (product.avg_rating || 0) < filters.minRating) return false;

      // Availability filter
      if (filters.inStockOnly && product.stock < 1) return false;

      // Color filter
      if (filters.colors && filters.colors.length > 0) {
        const hasColor = product.colors.some((c) => filters.colors.includes(c));
        if (!hasColor) return false;
      }

      // Size filter
      if (filters.sizes && filters.sizes.length > 0) {
        const hasSize = product.available_sizes.some((s) => filters.sizes.includes(s));
        if (!hasSize) return false;
      }

      return true;
    });
  },

  // Get search suggestions
  getSearchSuggestions: (products, query) => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const suggestions = new Set();

    // Suggest product titles
    products.forEach((product) => {
      if (product.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.title);
      }
    });

    // Suggest categories
    const categories = [...new Set(products.map((p) => p.category))];
    categories.forEach((category) => {
      if (category.toLowerCase().includes(lowerQuery)) {
        suggestions.add(category);
      }
    });

    // Suggest materials
    const materials = [...new Set(products.map((p) => p.material))];
    materials.forEach((material) => {
      if (material.toLowerCase().includes(lowerQuery)) {
        suggestions.add(material);
      }
    });

    return Array.from(suggestions).slice(0, 10);
  },

  // Sort options
  sortProducts: (products, sortBy) => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'rating':
        return sorted.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
      case 'popularity':
        return sorted.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
      case 'trending':
        return sorted.sort((a, b) => {
          if (b.is_trending && !a.is_trending) return 1;
          if (a.is_trending && !b.is_trending) return -1;
          return (b.review_count || 0) - (a.review_count || 0);
        });
      default:
        return sorted;
    }
  },
};

export default aiSearchService;
