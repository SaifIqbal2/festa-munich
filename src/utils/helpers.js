// Currency Exchange rates (approx relative to base USD)
export const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
  PKR: { symbol: 'Rs.', rate: 278.0, label: 'PKR (Rs.)' }
};

export const formatPrice = (amountInUSD, currency = 'USD') => {
  const current = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = Math.round(Number(amountInUSD || 0) * current.rate);
  return `${current.symbol} ${converted.toLocaleString()}`;
};

export const generateOrderId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FM-${rand}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ============ VALIDATION FUNCTIONS ============

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

export const validatePostalCode = (postalCode, country = 'Pakistan') => {
  const patterns = {
    'Pakistan': /^\d{5}$/,
    'United States': /^\d{5}(-\d{4})?$/,
    'United Kingdom': /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    'Canada': /^[A-Z]\d[A-Z]?\s?\d[A-Z]\d$/i
  };
  const pattern = patterns[country] || patterns['Pakistan'];
  return pattern.test(postalCode);
};

export const validateFormData = (formData) => {
  const errors = {};

  if (!formData.fullName || formData.fullName.trim().length < 2) {
    errors.fullName = 'Please enter a valid name (minimum 2 characters)';
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.phone || !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!formData.address || formData.address.trim().length < 5) {
    errors.address = 'Please enter a complete address';
  }

  if (!formData.city || formData.city.trim().length < 2) {
    errors.city = 'Please enter a valid city';
  }

  if (!formData.postalCode || formData.postalCode.trim().length < 3) {
    errors.postalCode = 'Please enter a valid postal code';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============ REVIEW & RATING FUNCTIONS ============

export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

export const getRatingDistribution = (reviews) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews?.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });
  return distribution;
};

export const formatReviewDate = (dateString) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// ============ DISCOUNT & COUPON FUNCTIONS ============

export const validateCouponCode = (code) => {
  return code && code.length >= 3 && code.length <= 20 && /^[A-Z0-9-]+$/.test(code);
};

export const applyCouponDiscount = (subtotal, coupon) => {
  if (!coupon || !coupon.is_active) return { discount: 0, finalTotal: subtotal };

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = (subtotal * coupon.discount_value) / 100;
  } else if (coupon.discount_type === 'fixed') {
    discount = coupon.discount_value;
  }

  discount = Math.min(discount, subtotal); // Ensure discount doesn't exceed subtotal
  return {
    discount: Math.round(discount),
    finalTotal: Math.round(subtotal - discount)
  };
};

export const calculateOrderTotals = (subtotal, shippingCost = 0, tax = 0, discountAmount = 0) => {
  const total = subtotal + shippingCost + tax - discountAmount;
  return {
    subtotal: Math.round(subtotal),
    shippingCost: Math.round(shippingCost),
    tax: Math.round(tax),
    discountAmount: Math.round(discountAmount),
    total: Math.max(0, Math.round(total))
  };
};

// ============ INVENTORY MANAGEMENT ============

export const getLowStockWarning = (stock, threshold = 5) => {
  if (stock <= 0) return { level: 'out-of-stock', message: 'Out of Stock', color: '#dc2626' };
  if (stock <= threshold) return { level: 'low', message: `Only ${stock} left in stock`, color: '#f97316' };
  return { level: 'available', message: 'In Stock', color: '#059669' };
};

export const estimateDeliveryDate = (shippingCountry = 'Pakistan') => {
  const baseDate = new Date();
  const daysToAdd = shippingCountry === 'Pakistan' ? 5 : (shippingCountry === 'United States' ? 7 : 14);
  baseDate.setDate(baseDate.getDate() + daysToAdd);
  return baseDate;
};

// ============ SEARCH & FILTER FUNCTIONS ============

export const fuzzySearch = (query, items, searchableFields) => {
  if (!query) return items;
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item => {
    return searchableFields.some(field => {
      const value = item[field]?.toString().toLowerCase() || '';
      return value.includes(lowerQuery);
    });
  });
};

export const filterByPriceRange = (products, minPrice, maxPrice) => {
  return products.filter(p => p.price >= minPrice && p.price <= maxPrice);
};

export const filterByCategory = (products, category) => {
  if (category === 'All Garments') return products;
  return products.filter(p => p.category === category);
};

// ============ IMAGE & MEDIA FUNCTIONS ============

export const getImageUrl = (image, size = 'medium') => {
  if (!image) return '/placeholder-image.jpg';
  
  if (typeof image === 'string') {
    if (image.startsWith('http')) {
      // Add Unsplash query params for optimization
      if (image.includes('unsplash.com')) {
        const url = new URL(image);
        if (!url.searchParams.has('w')) {
          url.searchParams.set('w', size === 'large' ? 1200 : size === 'medium' ? 600 : 300);
          url.searchParams.set('q', '80');
        }
        return url.toString();
      }
      return image;
    }
  }
  
  return '/placeholder-image.jpg';
};

export const compressImage = async (file, maxWidth = 1200, maxHeight = 1200) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  });
};
