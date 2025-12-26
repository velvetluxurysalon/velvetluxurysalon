/**
 * Meta Tags Generator and Manager
 * Handles dynamic OG tags, Twitter cards, and other meta tags
 */

export interface MetaTagsConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageType?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  articleTag?: string[];
  locale?: string;
  siteName?: string;
}

/**
 * Generate all meta tags HTML
 */
export const generateMetaTags = (config: MetaTagsConfig): string => {
  const {
    title,
    description,
    url,
    image = 'https://velvetluxurysalon.com/og-image.jpg',
    imageWidth = 1200,
    imageHeight = 630,
    imageType = 'image/jpeg',
    author = 'Velvet Luxury Salon',
    publishedDate,
    modifiedDate,
    articleTag = [],
    locale = 'en_IN',
    siteName = 'Velvet Luxury Salon'
  } = config;

  let metaTags = `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="${author}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#667eea" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="${imageWidth}" />
    <meta property="og:image:height" content="${imageHeight}" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:locale" content="${locale}" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:creator" content="@velvetluxurysalon" />
    <meta name="twitter:site" content="@velvetluxurysalon" />
    
    <!-- Additional Meta Tags -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="apple-mobile-web-app-title" content="Velvet Salon" />
  `;

  if (publishedDate) {
    metaTags += `\n    <meta property="article:published_time" content="${publishedDate}" />`;
  }

  if (modifiedDate) {
    metaTags += `\n    <meta property="article:modified_time" content="${modifiedDate}" />`;
  }

  if (articleTag.length > 0) {
    articleTag.forEach(tag => {
      metaTags += `\n    <meta property="article:tag" content="${tag}" />`;
    });
  }

  return metaTags;
};

/**
 * Escape HTML special characters
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate JSON-LD schema for different content types
 */
export const generateSchema = {
  /**
   * Business schema
   */
  business: (config: {
    name?: string;
    url?: string;
    phone?: string;
    email?: string;
    address?: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    image?: string;
    priceRange?: string;
    rating?: number;
    reviewCount?: number;
    hours?: string;
  } = {}) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": config.name || "Velvet Luxury Salon",
    "url": config.url || "https://velvetluxurysalon.com",
    "telephone": config.phone || "+91-9345678646",
    "email": config.email || "info@velvetluxurysalon.com",
    "address": {
      "@type": "PostalAddress",
      ...config.address
    },
    "image": config.image || "https://velvetluxurysalon.com/logo.png",
    "priceRange": config.priceRange || "₹500 - ₹5000",
    ...(config.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": config.rating.toString(),
        "reviewCount": (config.reviewCount || 0).toString()
      }
    })
  }),

  /**
   * Service schema
   */
  service: (service: {
    name: string;
    description: string;
    price?: number;
    duration?: string;
    image?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "image": service.image || "https://velvetluxurysalon.com/service-default.jpg",
    ...(service.price && {
      "offers": {
        "@type": "Offer",
        "price": service.price.toString(),
        "priceCurrency": "INR"
      }
    }),
    ...(service.duration && {
      "duration": service.duration
    }),
    "provider": {
      "@type": "LocalBusiness",
      "name": "Velvet Luxury Salon"
    }
  }),

  /**
   * Product schema
   */
  product: (product: {
    name: string;
    description: string;
    price: number;
    image: string;
    rating?: number;
    reviewCount?: number;
    availability?: string;
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
      "availability": product.availability || "https://schema.org/InStock"
    },
    ...(product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating.toString(),
        "ratingCount": (product.reviewCount || 0).toString()
      }
    })
  }),

  /**
   * Article schema
   */
  article: (article: {
    title: string;
    description: string;
    image: string;
    url: string;
    datePublished: string;
    dateModified: string;
    author?: {
      name: string;
      url?: string;
    };
  }) => ({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "url": article.url,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified,
    "author": {
      "@type": "Organization",
      "name": article.author?.name || "Velvet Luxury Salon",
      ...(article.author?.url && { "url": article.author.url })
    },
    "publisher": {
      "@type": "Organization",
      "name": "Velvet Luxury Salon",
      "logo": {
        "@type": "ImageObject",
        "url": "https://velvetluxurysalon.com/logo.png"
      }
    }
  }),

  /**
   * FAQ schema
   */
  faq: (faqs: Array<{ question: string; answer: string }>) => ({
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
  }),

  /**
   * Breadcrumb schema
   */
  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": (index + 1).toString(),
      "name": item.name,
      "item": item.url
    }))
  }),

  /**
   * Event schema
   */
  event: (event: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    image: string;
    url: string;
    location?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "image": event.image,
    "url": event.url,
    "startDate": event.startDate,
    "endDate": event.endDate,
    ...(event.location && {
      "location": {
        "@type": "Place",
        "name": event.location
      }
    }),
    "organizer": {
      "@type": "Organization",
      "name": "Velvet Luxury Salon"
    }
  })
};

/**
 * Generate social sharing URLs
 */
export const generateSocialLinks = (config: {
  title: string;
  url: string;
  description?: string;
  image?: string;
}) => ({
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(config.url)}`,
  twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(config.url)}&text=${encodeURIComponent(config.title)}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${config.title}\n${config.url}`)}`,
  email: `mailto:?subject=${encodeURIComponent(config.title)}&body=${encodeURIComponent(config.description || config.title)} ${config.url}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(config.url)}`,
  pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(config.url)}&media=${encodeURIComponent(config.image || '')}&description=${encodeURIComponent(config.title)}`
});
