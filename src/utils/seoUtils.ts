/**
 * SEO Utilities for Dynamic Meta Tags and Structured Data
 * Use these functions in React components to set page-specific SEO metadata
 */

// Update document title and meta tags
export const updatePageSEO = (config: {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}) => {
  // Update title
  document.title = config.title;

  // Update or create meta tags
  updateMetaTag('meta', 'name', 'description', config.description);
  
  if (config.keywords) {
    updateMetaTag('meta', 'name', 'keywords', config.keywords);
  }

  if (config.ogImage) {
    updateMetaTag('meta', 'property', 'og:image', config.ogImage);
    updateMetaTag('meta', 'name', 'twitter:image', config.ogImage);
  }

  if (config.ogType) {
    updateMetaTag('meta', 'property', 'og:type', config.ogType);
  }

  if (config.twitterCard) {
    updateMetaTag('meta', 'name', 'twitter:card', config.twitterCard);
  }

  // Update canonical URL
  if (config.canonical) {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', config.canonical);
  }

  // Update og:title and og:description
  updateMetaTag('meta', 'property', 'og:title', config.title);
  updateMetaTag('meta', 'property', 'og:description', config.description);
  updateMetaTag('meta', 'name', 'twitter:title', config.title);
  updateMetaTag('meta', 'name', 'twitter:description', config.description);
};

// Helper function to update or create meta tags
const updateMetaTag = (
  tagName: string,
  attributeName: string,
  attributeValue: string,
  content: string
) => {
  let element = document.querySelector(
    `${tagName}[${attributeName}="${attributeValue}"]`
  );

  if (!element) {
    element = document.createElement(tagName);
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

// Add JSON-LD structured data
export const addStructuredData = (data: Record<string, any>) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Service structured data
export const createServiceSchema = (service: {
  name: string;
  description: string;
  price: number;
  image?: string;
  duration?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "image": service.image || "https://velvetluxurysalon.com/default-service.png",
  "priceRange": `₹${service.price}`,
  "areaServed": {
    "@type": "City",
    "name": "Your City"
  },
  "duration": service.duration || "PT30M",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Velvet Luxury Salon"
  }
});

// Review/Rating structured data
export const createReviewSchema = (review: {
  name: string;
  rating: number;
  description: string;
  author: string;
  datePublished: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": review.rating.toString(),
    "bestRating": "5"
  },
  "name": review.name,
  "description": review.description,
  "author": {
    "@type": "Person",
    "name": review.author
  },
  "datePublished": review.datePublished
});

// Product structured data (for product showcase)
export const createProductSchema = (product: {
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  reviewCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "brand": {
    "@type": "Brand",
    "name": "Velvet Luxury Salon"
  },
  "offers": {
    "@type": "Offer",
    "price": product.price.toString(),
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  },
  ...(product.rating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "ratingCount": (product.reviewCount || 0).toString()
    }
  })
});

// Event structured data (for special offers/events)
export const createEventSchema = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "image": event.image || "https://velvetluxurysalon.com/event.png",
  "startDate": event.startDate,
  "endDate": event.endDate,
  "location": {
    "@type": "Place",
    "name": "Velvet Luxury Salon",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": event.location
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Velvet Luxury Salon",
    "url": "https://velvetluxurysalon.com"
  }
});

// Breadcrumb schema
export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": (index + 1).toString(),
    "name": item.name,
    "item": item.url
  }))
});

// FAQPage schema
export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Organization schema
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Velvet Luxury Salon",
  "url": "https://velvetluxurysalon.com",
  "logo": "https://velvetluxurysalon.com/logo.png",
  "sameAs": [
    "https://www.facebook.com/velvetluxurysalon",
    "https://www.instagram.com/velvetluxurysalon",
    "https://www.twitter.com/velvetluxurysalon"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "telephone": "+91-9345678646",
    "email": "velvetluxurysalon@gmail.com"
  }
});

// Scroll to top utility (helps with page transitions)
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Open Graph meta tags generator
export const generateOpenGraphTags = (config: {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
}) => ({
  'og:title': config.title,
  'og:description': config.description,
  'og:image': config.image,
  'og:url': config.url,
  'og:type': config.type || 'website',
  'og:site_name': 'Velvet Luxury Salon'
});
