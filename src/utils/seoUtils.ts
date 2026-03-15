/**
 * SEO Utilities for Dynamic Meta Tags and Structured Data
 * Comprehensive SEO management for search engine optimization
 */

import { SEO_CONFIG } from "../config/seoConfig";

/**
 * Update document title and meta tags dynamically
 */
export const updatePageSEO = (config: {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  author?: string;
  robots?: string;
  viewport?: string;
}) => {
  if (typeof document === "undefined") return;

  // Update title
  document.title = config.title;

  // Update meta tags
  updateOrCreateMetaTag("meta", "name", "title", config.title);
  updateOrCreateMetaTag("meta", "name", "description", config.description);

  if (config.keywords) {
    updateOrCreateMetaTag("meta", "name", "keywords", config.keywords);
  }

  if (config.author) {
    updateOrCreateMetaTag("meta", "name", "author", config.author);
  }

  if (config.robots) {
    updateOrCreateMetaTag("meta", "name", "robots", config.robots);
  }

  // Open Graph tags
  updateOrCreateMetaTag("meta", "property", "og:title", config.title);
  updateOrCreateMetaTag(
    "meta",
    "property",
    "og:description",
    config.description,
  );
  updateOrCreateMetaTag(
    "meta",
    "property",
    "og:url",
    config.ogUrl || SEO_CONFIG.site.url,
  );
  updateOrCreateMetaTag(
    "meta",
    "property",
    "og:type",
    config.ogType || "website",
  );

  if (config.ogImage) {
    updateOrCreateMetaTag("meta", "property", "og:image", config.ogImage);
    updateOrCreateMetaTag(
      "meta",
      "property",
      "og:image:secure_url",
      config.ogImage,
    );
    updateOrCreateMetaTag("meta", "property", "og:image:type", "image/jpeg");
  }

  // Twitter Card tags
  updateOrCreateMetaTag("meta", "name", "twitter:title", config.title);
  updateOrCreateMetaTag(
    "meta",
    "name",
    "twitter:description",
    config.description,
  );
  updateOrCreateMetaTag(
    "meta",
    "name",
    "twitter:card",
    config.twitterCard || "summary_large_image",
  );

  if (config.ogImage) {
    updateOrCreateMetaTag("meta", "name", "twitter:image", config.ogImage);
  }

  // Update canonical URL
  if (config.canonical) {
    let canonicalLink = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = config.canonical;
  }
};

/**
 * Helper function to update or create meta tags
 */
const updateOrCreateMetaTag = (
  tagName: string,
  attributeName: string,
  attributeValue: string,
  content: string,
) => {
  if (typeof document === "undefined") return;

  let element = document.querySelector(
    `${tagName}[${attributeName}="${attributeValue}"]`,
  ) as HTMLMetaElement | HTMLLinkElement;

  if (!element) {
    element = document.createElement(tagName);
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

/**
 * Add JSON-LD structured data with duplicate prevention
 */
export const addStructuredData = (data: Record<string, any>) => {
  if (typeof document === "undefined") return;

  // Check if a schema with the same @id already exists
  if (data["@id"]) {
    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    for (const script of existingScripts) {
      try {
        const existingData = JSON.parse(script.textContent || "");
        if (existingData["@id"] === data["@id"]) {
          return;
        }
      } catch {
        // Continue on parsing errors
      }
    }
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Generate meta tags object from SEO config
 */
export const generateMetaTags = (
  pageKey: keyof (typeof SEO_CONFIG)["pages"],
  customUrl?: string,
) => {
  const pageConfig = SEO_CONFIG.pages[pageKey];
  const url =
    customUrl ||
    `${SEO_CONFIG.site.url}${pageKey === "home" ? "/" : `/${pageKey}`}`;

  return {
    title: pageConfig.title,
    description: pageConfig.description,
    keywords: pageConfig.keywords,
    canonical: url,
    ogImage: SEO_CONFIG.site.image,
    ogType: "business.business",
    ogUrl: url,
    author: SEO_CONFIG.site.name,
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  };
};

/**
 * Service structured data
 */
export const createServiceSchema = (service: {
  name: string;
  description: string;
  price: number;
  image?: string;
  duration?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  image: service.image || `${SEO_CONFIG.site.url}/default-service.png`,
  priceRange: `₹${service.price}`,
  areaServed: {
    "@type": "City",
    name: "Bhavani, Erode",
  },
  duration: service.duration || "PT30M",
  provider: {
    "@type": "LocalBusiness",
    name: SEO_CONFIG.site.name,
    url: SEO_CONFIG.site.url,
    telephone: SEO_CONFIG.contact.phone,
  },
});

/**
 * Review/Rating structured data
 */
export const createReviewSchema = (review: {
  name: string;
  rating: number;
  description: string;
  author: string;
  datePublished: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  reviewRating: {
    "@type": "Rating",
    ratingValue: review.rating.toString(),
    bestRating: "5",
    worstRating: "1",
  },
  name: review.name,
  description: review.description,
  reviewBody: review.description,
  author: {
    "@type": "Person",
    name: review.author,
  },
  datePublished: review.datePublished,
  itemReviewed: {
    "@type": "LocalBusiness",
    name: SEO_CONFIG.site.name,
  },
});

/**
 * Product/Service offer structured data
 */
export const createProductSchema = (product: {
  name: string;
  description: string;
  price: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.image,
  brand: {
    "@type": "Brand",
    name: SEO_CONFIG.site.name,
  },
  offers: {
    "@type": "Offer",
    price: product.price.toString(),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: SEO_CONFIG.site.name,
      url: SEO_CONFIG.site.url,
    },
  },
  ...(product.rating && {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      bestRating: "5",
      worstRating: "1",
      ratingCount: product.reviewCount || 1,
    },
  }),
});

/**
 * Person schema for team members
 */
export const createPersonSchema = (person: {
  name: string;
  jobTitle: string;
  image?: string;
  description?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.jobTitle,
  image: person.image,
  description: person.description,
  workLocation: {
    "@type": "Place",
    name: SEO_CONFIG.site.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: SEO_CONFIG.business.address.streetAddress,
      addressLocality: SEO_CONFIG.business.address.addressLocality,
      addressRegion: SEO_CONFIG.business.address.addressRegion,
      postalCode: SEO_CONFIG.business.address.postalCode,
      addressCountry: SEO_CONFIG.business.address.addressCountry,
    },
  },
});

/**
 * Booking/Reservation action schema
 */
export const createReservationSchema = (reservation: {
  reservationId: string;
  underName: string;
  reservationDate: string;
  checkinDate: string;
  checkoutDate: string;
  reservationStatus: "Confirmed" | "Pending" | "Cancelled";
  priceRange: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "ReservationPackage",
  reservationId: reservation.reservationId,
  underName: {
    "@type": "Person",
    name: reservation.underName,
  },
  reservationDate: reservation.reservationDate,
  checkinDate: reservation.checkinDate,
  checkoutDate: reservation.checkoutDate,
  reservationStatus: `https://schema.org/${reservation.reservationStatus}Reservation`,
  provider: {
    "@type": "LocalBusiness",
    name: SEO_CONFIG.site.name,
    url: SEO_CONFIG.site.url,
  },
  totalPrice: {
    "@type": "PriceSpecification",
    priceCurrency: "INR",
    price: reservation.priceRange,
  },
});

/**
 * Get language alternatives for hreflang tags
 */
export const getLanguageAlternatives = () => [
  { lang: "en-IN", url: SEO_CONFIG.site.url },
  { lang: "en", url: SEO_CONFIG.site.url },
  { lang: "x-default", url: SEO_CONFIG.site.url },
];

/**
 * Format telephone number for schema
 */
export const formatPhoneForSchema = (phone: string) => {
  return phone.replace(/[^\d+]/g, "");
};

/**
 * Create breadcrumb schema for navigation
 */
export const createBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http")
      ? item.url
      : `${SEO_CONFIG.site.url}${item.url}`,
  })),
});

/**
 * Validate SEO configuration
 */
export const validateSEOContent = (content: {
  title?: string;
  description?: string;
  content?: string;
  keywords?: string;
}) => {
  const issues: string[] = [];

  if (!content.title || content.title.length < 30) {
    issues.push("Title should be at least 30 characters");
  }
  if (content.title && content.title.length > 60) {
    issues.push("Title should not exceed 60 characters");
  }

  if (!content.description || content.description.length < 120) {
    issues.push("Meta description should be at least 120 characters");
  }
  if (content.description && content.description.length > 160) {
    issues.push("Meta description should not exceed 160 characters");
  }

  if (!content.content || content.content.length < 300) {
    issues.push("Content should be at least 300 characters");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};

/**
 * Get SEO score for a page (0-100)
 */
export const calculateSEOScore = (seoData: {
  title?: string;
  description?: string;
  keywords?: string;
  hasCanonical?: boolean;
  hasStructuredData?: boolean;
  hasImages?: boolean;
  imageAltTexts?: number;
  hasInternalLinks?: boolean;
  hasExternalLinks?: boolean;
  contentLength?: number;
  headingStructure?: boolean;
}) => {
  let score = 0;

  if (seoData.title && seoData.title.length >= 30 && seoData.title.length <= 60)
    score += 10;
  if (
    seoData.description &&
    seoData.description.length >= 120 &&
    seoData.description.length <= 160
  )
    score += 10;
  if (seoData.keywords) score += 5;
  if (seoData.hasCanonical) score += 10;
  if (seoData.hasStructuredData) score += 15;
  if (seoData.hasImages) score += 10;
  if (seoData.imageAltTexts && seoData.imageAltTexts > 0) score += 10;
  if (seoData.hasInternalLinks) score += 10;
  if (seoData.hasExternalLinks) score += 5;
  if (seoData.contentLength && seoData.contentLength >= 300) score += 10;
  if (seoData.headingStructure) score += 5;

  return Math.min(100, score);
};

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
  name: product.name,
  description: product.description,
  image: product.image,
  brand: {
    "@type": "Brand",
    name: "Velvet Premium Unisex Salon",
  },
  offers: {
    "@type": "Offer",
    price: product.price.toString(),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  },
  ...(product.rating && {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      ratingCount: (product.reviewCount || 0).toString(),
    },
  }),
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
  name: event.name,
  description: event.description,
  image: event.image || "https://velvetluxurysalon.in/event.png",
  startDate: event.startDate,
  endDate: event.endDate,
  location: {
    "@type": "Place",
    name: "Velvet Premium Unisex Salon",
    address: {
      "@type": "PostalAddress",
      addressLocality: event.location,
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Velvet Premium Unisex Salon",
    url: "https://velvetluxurysalon.in",
  },
});

// Breadcrumb schema
export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: (index + 1).toString(),
    name: item.name,
    item: item.url,
  })),
});

// FAQPage schema
export const createFAQSchema = (
  faqs: Array<{ question: string; answer: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Organization schema
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Velvet Premium Unisex Salon",
  url: "https://velvetluxurysalon.in",
  logo: "https://velvetluxurysalon.in/logo.png",
  sameAs: [
    "https://www.facebook.com/velvetluxurysalon",
    "https://www.instagram.com/velvetluxurysalon",
    "https://www.twitter.com/velvetluxurysalon",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    telephone: "+91-9345678646",
    email: "velvetluxurysalon@gmail.com",
  },
});

// Scroll to top utility (helps with page transitions)
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
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
  "og:title": config.title,
  "og:description": config.description,
  "og:image": config.image,
  "og:url": config.url,
  "og:type": config.type || "website",
  "og:site_name": "Velvet Premium Unisex Salon",
});
