import ReactGA from 'react-ga4';

const isDevelopment = process.env.NODE_ENV === 'development';

export const initGA = () => {
  const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
  
  if (measurementId) {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        siteSpeedSampleRate: 100
      }
    });
    console.log('Google Analytics initialized with ID:', measurementId);
  } else {
    console.log('Google Analytics Measurement ID not found');
  }
};

// Track page views
export const trackPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Track custom events
export const trackEvent = (category, action, label = '') => {
  ReactGA.event({
    category,
    action,
    label
  });
};

// E-commerce tracking
export const trackPurchase = (transaction) => {
  ReactGA.event('purchase', {
    transaction_id: transaction.orderId,
    value: transaction.total,
    currency: 'PKR',
    items: transaction.items
  });
};

export const trackAddToCart = (product) => {
  ReactGA.event('add_to_cart', {
    currency: 'PKR',
    value: product.price,
    items: [{
      item_id: product._id,
      item_name: product.name,
      price: product.price,
      quantity: 1
    }]
  });
};

export const trackProductView = (product) => {
  ReactGA.event('view_item', {
    currency: 'PKR',
    value: product.price,
    items: [{
      item_id: product._id,
      item_name: product.name,
      item_category: product.category,
      price: product.price
    }]
  });
};