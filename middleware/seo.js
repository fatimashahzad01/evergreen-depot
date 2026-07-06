const he = require('he');

// Generate JSON-LD structured data for product
const generateProductJsonLD = (product, req) => {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  
  const jsonLD = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": he.encode(product.name),
    "description": he.encode(product.shortDescription || product.description.substring(0, 160)),
    "image": product.images && product.images.length > 0 
      ? product.images.map(img => img.url)
      : [],
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.structuredData?.brand || "Evergreen Depot Market"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/products/${product.slug}`,
      "priceCurrency": product.currency || "PKR",
      "price": product.discountPrice || product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": process.env.SITE_NAME || "Evergreen Depot Market",
        "url": baseUrl
      }
    }
  };

  // Add aggregate rating if exists
  if (product.rating && product.rating.count > 0) {
    jsonLD.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating.average,
      "reviewCount": product.rating.count,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  // Add additional properties if available
  if (product.category) {
    jsonLD.category = product.category.replace(/-/g, ' ');
  }

  return jsonLD;
};

// Generate breadcrumb JSON-LD
const generateBreadcrumbJsonLD = (product) => {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  
  return {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        "item": `${baseUrl}/products?category=${product.category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `${baseUrl}/products/${product.slug}`
      }
    ]
  };
};

// Generate organization JSON-LD
const generateOrganizationJsonLD = () => {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": process.env.SITE_NAME || "Evergreen Depot Market",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": process.env.SITE_DESCRIPTION || "Pakistan's premier online plant marketplace",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK"
    },
    "sameAs": [
      "https://www.facebook.com/yourpage",
      "https://www.instagram.com/yourpage",
      "https://twitter.com/yourpage"
    ]
  };
};

// Middleware to attach SEO data to response
const attachSEOData = (req, res, next) => {
  res.seo = {
    generateProductJsonLD,
    generateBreadcrumbJsonLD,
    generateOrganizationJsonLD
  };
  next();
};

module.exports = {
  generateProductJsonLD,
  generateBreadcrumbJsonLD,
  generateOrganizationJsonLD,
  attachSEOData
};