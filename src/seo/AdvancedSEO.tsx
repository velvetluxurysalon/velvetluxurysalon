/**
 * Advanced SEO Component
 * Comprehensive SEO management for Google ranking optimization
 * Includes all structured data, meta tags, and SEO best practices
 */

import { useEffect } from "react";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product" | "business.business" | "place";
  twitterHandle?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  alternateLanguages?: { lang: string; url: string }[];
}

export interface LocalBusinessData {
  name: string;
  description: string;
  url: string;
  phone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  priceRange: string;
  openingHours: OpeningHoursSpecification[];
  images: string[];
  logo: string;
  sameAs: string[];
  rating?: {
    value: number;
    count: number;
  };
  paymentAccepted?: string[];
  currenciesAccepted?: string;
}

export interface OpeningHoursSpecification {
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

export interface ServiceData {
  name: string;
  description: string;
  price: number;
  priceCurrency?: string;
  duration?: string;
  image?: string;
  category?: string;
}

export interface FAQData {
  question: string;
  answer: string;
}

export interface ReviewData {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleData {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url?: string;
  };
  publisher?: {
    name: string;
    logo: string;
  };
}

// ============================================
// SEO CONFIGURATION
// ============================================

export const SALON_SEO_CONFIG = {
  site: {
    name: "Velvet Luxury Salon",
    url: "https://velvetluxurysalon.in",
    defaultTitle:
      "Velvet Luxury Salon | Best Luxury Hair & Beauty Salon in Bhavani, Erode",
    titleTemplate: "%s | Velvet Luxury Salon",
    description:
      "Experience the finest luxury hair and beauty services at Velvet Luxury Salon Bhavani, Erode. Expert stylists, premium treatments, hair cutting, coloring, styling, bridal makeup, spa services. Book your appointment today!",
    image: "https://velvetluxurysalon.in/og-image.png",
    logo: "https://velvetluxurysalon.in/logo.png",
    language: "en-IN",
    locale: "en_IN",
  },

  contact: {
    phone: "+91-9345678646",
    phoneFormatted: "+91 93456 78646",
    email: "velvetluxurysalon@gmail.com",
    whatsapp: "919345678646",
  },

  address: {
    streetAddress:
      "Opposite to ICICI Bank, Bharathi Nagar, Kalingarayanpalayam",
    addressLocality: "Bhavani",
    addressRegion: "Tamil Nadu",
    postalCode: "638301",
    addressCountry: "IN",
    fullAddress:
      "Opposite to ICICI Bank, Bharathi Nagar, Kalingarayanpalayam, Bhavani, Erode Dt, Tamil Nadu 638301, India",
  },

  geo: {
    latitude: 11.45,
    longitude: 77.6833,
  },

  social: {
    facebook: "https://www.facebook.com/velvetluxurysalon",
    instagram: "https://www.instagram.com/velvetluxurysalon",
    twitter: "https://www.twitter.com/velvetluxurysalon",
    youtube: "https://www.youtube.com/@velvetluxurysalon",
    pinterest: "https://www.pinterest.com/velvetluxurysalon",
    linkedin: "https://www.linkedin.com/company/velvetluxurysalon",
  },

  business: {
    type: "BeautySalon",
    priceRange: "₹₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: [
      "Cash",
      "Credit Card",
      "Debit Card",
      "UPI",
      "Paytm",
      "Google Pay",
      "PhonePe",
    ],
    areaServed: ["Bhavani", "Erode", "Tamil Nadu", "India"],
    foundingDate: "2020",
    numberOfEmployees: "10-20",
  },

  openingHours: [
    {
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "21:00",
    },
    { dayOfWeek: "Sunday", opens: "10:00", closes: "20:00" },
  ],

  rating: {
    value: 4.9,
    count: 250,
    bestRating: 5,
    worstRating: 1,
  },

  keywords: {
    primary: [
      "luxury salon",
      "best salon",
      "hair salon",
      "beauty salon",
      "premium salon",
      "salon near me",
    ],
    services: [
      "hair cutting",
      "hair coloring",
      "hair styling",
      "hair treatment",
      "keratin treatment",
      "hair spa",
      "bridal makeup",
      "party makeup",
      "facial",
      "manicure",
      "pedicure",
      "nail art",
      "waxing",
      "threading",
      "skin treatment",
    ],
    location: [
      "salon in Bhavani",
      "best salon Erode",
      "luxury salon Bhavani",
      "beauty parlour near me",
      "hair salon Erode",
      "salon in Erode district",
      "best beauty salon Bhavani Erode",
    ],
    brand: ["Velvet Luxury Salon", "Velvet Salon", "velvetluxurysalon"],
  },
};

// ============================================
// SCHEMA GENERATORS
// ============================================

/**
 * Generate LocalBusiness/BeautySalon Schema
 */
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "BeautySalon", "HairSalon"],
  "@id": `${SALON_SEO_CONFIG.site.url}/#organization`,
  name: SALON_SEO_CONFIG.site.name,
  alternateName: "Velvet Salon",
  description: SALON_SEO_CONFIG.site.description,
  url: SALON_SEO_CONFIG.site.url,
  telephone: SALON_SEO_CONFIG.contact.phone,
  email: SALON_SEO_CONFIG.contact.email,
  logo: {
    "@type": "ImageObject",
    url: SALON_SEO_CONFIG.site.logo,
    width: 512,
    height: 512,
  },
  image: [
    SALON_SEO_CONFIG.site.image,
    `${SALON_SEO_CONFIG.site.url}/gallery-1.jpg`,
    `${SALON_SEO_CONFIG.site.url}/gallery-2.jpg`,
    `${SALON_SEO_CONFIG.site.url}/gallery-3.jpg`,
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: SALON_SEO_CONFIG.address.streetAddress,
    addressLocality: SALON_SEO_CONFIG.address.addressLocality,
    addressRegion: SALON_SEO_CONFIG.address.addressRegion,
    postalCode: SALON_SEO_CONFIG.address.postalCode,
    addressCountry: SALON_SEO_CONFIG.address.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SALON_SEO_CONFIG.geo.latitude,
    longitude: SALON_SEO_CONFIG.geo.longitude,
  },
  hasMap: `https://www.google.com/maps?q=${SALON_SEO_CONFIG.geo.latitude},${SALON_SEO_CONFIG.geo.longitude}`,
  priceRange: SALON_SEO_CONFIG.business.priceRange,
  currenciesAccepted: SALON_SEO_CONFIG.business.currenciesAccepted,
  paymentAccepted: SALON_SEO_CONFIG.business.paymentAccepted.join(", "),
  openingHoursSpecification: SALON_SEO_CONFIG.openingHours.map((hours) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: hours.dayOfWeek,
    opens: hours.opens,
    closes: hours.closes,
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: SALON_SEO_CONFIG.rating.value.toString(),
    ratingCount: SALON_SEO_CONFIG.rating.count.toString(),
    bestRating: SALON_SEO_CONFIG.rating.bestRating.toString(),
    worstRating: SALON_SEO_CONFIG.rating.worstRating.toString(),
  },
  sameAs: Object.values(SALON_SEO_CONFIG.social),
  areaServed: [
    { "@type": "City", name: "Bhavani" },
    { "@type": "City", name: "Erode" },
    { "@type": "State", name: "Tamil Nadu" },
    { "@type": "Country", name: "India" },
  ],
  foundingDate: SALON_SEO_CONFIG.business.foundingDate,
  slogan: "Where Beauty Meets Elegance",
  knowsAbout: [
    "Hair Styling",
    "Hair Coloring",
    "Beauty Treatments",
    "Bridal Makeup",
    "Skin Care",
    "Nail Art",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Salon Services",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Hair Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Hair Cutting" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Hair Coloring" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Hair Treatment" },
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Beauty Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Facial" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Makeup" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Manicure & Pedicure" },
          },
        ],
      },
    ],
  },
});

/**
 * Generate Website Schema
 */
export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SALON_SEO_CONFIG.site.url}/#website`,
  url: SALON_SEO_CONFIG.site.url,
  name: SALON_SEO_CONFIG.site.name,
  description: SALON_SEO_CONFIG.site.description,
  publisher: {
    "@id": `${SALON_SEO_CONFIG.site.url}/#organization`,
  },
  inLanguage: SALON_SEO_CONFIG.site.language,
  potentialAction: [
    {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SALON_SEO_CONFIG.site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SALON_SEO_CONFIG.site.url}/booking`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Book Appointment",
      },
    },
  ],
});

/**
 * Generate Organization Schema
 */
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SALON_SEO_CONFIG.site.url}/#organization`,
  name: SALON_SEO_CONFIG.site.name,
  url: SALON_SEO_CONFIG.site.url,
  logo: SALON_SEO_CONFIG.site.logo,
  image: SALON_SEO_CONFIG.site.image,
  email: SALON_SEO_CONFIG.contact.email,
  telephone: SALON_SEO_CONFIG.contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SALON_SEO_CONFIG.address.streetAddress,
    addressLocality: SALON_SEO_CONFIG.address.addressLocality,
    addressRegion: SALON_SEO_CONFIG.address.addressRegion,
    postalCode: SALON_SEO_CONFIG.address.postalCode,
    addressCountry: SALON_SEO_CONFIG.address.addressCountry,
  },
  sameAs: Object.values(SALON_SEO_CONFIG.social),
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: SALON_SEO_CONFIG.contact.phone,
      contactType: "customer service",
      email: SALON_SEO_CONFIG.contact.email,
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Tamil"],
    },
    {
      "@type": "ContactPoint",
      telephone: SALON_SEO_CONFIG.contact.phone,
      contactType: "reservations",
      email: SALON_SEO_CONFIG.contact.email,
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Tamil"],
    },
  ],
});

/**
 * Generate Service Schema
 */
export const generateServiceSchema = (service: ServiceData) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  image: service.image || SALON_SEO_CONFIG.site.image,
  serviceType: service.category || "Beauty Service",
  provider: {
    "@type": "LocalBusiness",
    name: SALON_SEO_CONFIG.site.name,
    "@id": `${SALON_SEO_CONFIG.site.url}/#organization`,
  },
  areaServed: {
    "@type": "City",
    name: SALON_SEO_CONFIG.address.addressLocality,
  },
  offers: {
    "@type": "Offer",
    price: service.price.toString(),
    priceCurrency: service.priceCurrency || "INR",
    availability: "https://schema.org/InStock",
    validFrom: new Date().toISOString().split("T")[0],
  },
  ...(service.duration && { duration: service.duration }),
});

/**
 * Generate Service List Schema (ItemList)
 */
export const generateServiceListSchema = (services: ServiceData[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Salon Services",
  description:
    "Complete list of premium salon services offered at Velvet Luxury Salon",
  numberOfItems: services.length,
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: generateServiceSchema(service),
  })),
});

/**
 * Generate FAQ Schema
 */
export const generateFAQSchema = (faqs: FAQData[]) => ({
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

/**
 * Generate Review Schema
 */
export const generateReviewSchema = (review: ReviewData) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  author: {
    "@type": "Person",
    name: review.author,
  },
  reviewRating: {
    "@type": "Rating",
    ratingValue: review.rating.toString(),
    bestRating: "5",
    worstRating: "1",
  },
  reviewBody: review.reviewBody,
  datePublished: review.datePublished,
  itemReviewed: {
    "@type": "LocalBusiness",
    name: SALON_SEO_CONFIG.site.name,
    "@id": `${SALON_SEO_CONFIG.site.url}/#organization`,
  },
});

/**
 * Generate Breadcrumb Schema
 */
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http")
      ? item.url
      : `${SALON_SEO_CONFIG.site.url}${item.url}`,
  })),
});

/**
 * Generate Article/Blog Schema
 */
export const generateArticleSchema = (article: ArticleData) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.headline,
  description: article.description,
  image: article.image,
  datePublished: article.datePublished,
  dateModified: article.dateModified,
  author: {
    "@type": "Person",
    name: article.author.name,
    url: article.author.url,
  },
  publisher: {
    "@type": "Organization",
    name: article.publisher?.name || SALON_SEO_CONFIG.site.name,
    logo: {
      "@type": "ImageObject",
      url: article.publisher?.logo || SALON_SEO_CONFIG.site.logo,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": SALON_SEO_CONFIG.site.url,
  },
});

/**
 * Generate Event/Offer Schema
 */
export const generateOfferSchema = (offer: {
  name: string;
  description: string;
  discount: string;
  validFrom: string;
  validThrough: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Offer",
  name: offer.name,
  description: offer.description,
  discount: offer.discount,
  validFrom: offer.validFrom,
  validThrough: offer.validThrough,
  image: offer.image || SALON_SEO_CONFIG.site.image,
  offeredBy: {
    "@type": "LocalBusiness",
    name: SALON_SEO_CONFIG.site.name,
    "@id": `${SALON_SEO_CONFIG.site.url}/#organization`,
  },
  areaServed: {
    "@type": "City",
    name: SALON_SEO_CONFIG.address.addressLocality,
  },
});

/**
 * Generate Image Gallery Schema
 */
export const generateImageGallerySchema = (
  images: { url: string; caption: string; alt: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Velvet Luxury Salon Gallery",
  description:
    "Gallery showcasing our salon work, transformations, and ambiance",
  image: images.map((img) => ({
    "@type": "ImageObject",
    contentUrl: img.url,
    caption: img.caption,
    description: img.alt,
    creator: {
      "@type": "Organization",
      name: SALON_SEO_CONFIG.site.name,
    },
  })),
});

/**
 * Generate Person (Team Member) Schema
 */
export const generatePersonSchema = (person: {
  name: string;
  jobTitle: string;
  image?: string;
  description?: string;
  specialties?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.jobTitle,
  image: person.image,
  description: person.description,
  worksFor: {
    "@type": "LocalBusiness",
    name: SALON_SEO_CONFIG.site.name,
    "@id": `${SALON_SEO_CONFIG.site.url}/#organization`,
  },
  knowsAbout: person.specialties,
});

/**
 * Generate Video Schema (for video content)
 */
export const generateVideoSchema = (video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl?: string;
  embedUrl?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: video.name,
  description: video.description,
  thumbnailUrl: video.thumbnailUrl,
  uploadDate: video.uploadDate,
  duration: video.duration,
  contentUrl: video.contentUrl,
  embedUrl: video.embedUrl,
  publisher: {
    "@type": "Organization",
    name: SALON_SEO_CONFIG.site.name,
    logo: {
      "@type": "ImageObject",
      url: SALON_SEO_CONFIG.site.logo,
    },
  },
});

// ============================================
// META TAG UTILITIES
// ============================================

/**
 * Update or create a meta tag
 */
const updateMetaTag = (attribute: string, value: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

/**
 * Update canonical URL
 */
const updateCanonical = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);
};

/**
 * Add alternate language links
 */
const updateAlternateLanguages = (
  alternates: { lang: string; url: string }[],
) => {
  // Remove existing alternates
  document
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((el) => el.remove());

  // Add new alternates
  alternates.forEach((alt) => {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", alt.lang);
    link.setAttribute("href", alt.url);
    document.head.appendChild(link);
  });
};

/**
 * Add JSON-LD structured data script
 * Checks for existing static schemas to prevent duplicates
 */
export const addStructuredData = (data: object, id?: string) => {
  // Check if a static schema with the same @id already exists in the document
  const schemaData = data as { "@id"?: string; "@type"?: string | string[] };
  if (schemaData["@id"]) {
    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    for (const script of existingScripts) {
      try {
        const existingData = JSON.parse(script.textContent || "");
        if (
          existingData["@id"] === schemaData["@id"] &&
          !script.hasAttribute("data-schema-id")
        ) {
          // Static schema with same @id exists, skip adding dynamic one
          return;
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }

  // Remove existing dynamic script with same id if present
  if (id) {
    const existing = document.querySelector(`script[data-schema-id="${id}"]`);
    if (existing) existing.remove();
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  if (id) script.setAttribute("data-schema-id", id);
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Set comprehensive SEO meta tags
 */
export const setSEOMetaTags = (seo: SEOData) => {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = SALON_SEO_CONFIG.site.image,
    ogType = "website",
    twitterHandle = "@velvetluxurysalon",
    author = SALON_SEO_CONFIG.site.name,
    publishedDate,
    modifiedDate,
    noIndex = false,
    noFollow = false,
    alternateLanguages = [],
  } = seo;

  // Update document title
  document.title = title;

  // Primary meta tags
  updateMetaTag("name", "title", title);
  updateMetaTag("name", "description", description);
  updateMetaTag("name", "author", author);

  // Keywords
  const allKeywords = [
    ...keywords,
    ...SALON_SEO_CONFIG.keywords.primary,
    ...SALON_SEO_CONFIG.keywords.services.slice(0, 5),
    ...SALON_SEO_CONFIG.keywords.location.slice(0, 3),
  ].slice(0, 20);
  updateMetaTag("name", "keywords", allKeywords.join(", "));

  // Robots
  const robotsContent = [
    noIndex ? "noindex" : "index",
    noFollow ? "nofollow" : "follow",
    "max-image-preview:large",
    "max-snippet:-1",
    "max-video-preview:-1",
  ].join(", ");
  updateMetaTag("name", "robots", robotsContent);
  updateMetaTag("name", "googlebot", robotsContent);
  updateMetaTag("name", "bingbot", robotsContent);

  // Open Graph
  updateMetaTag("property", "og:title", title);
  updateMetaTag("property", "og:description", description);
  updateMetaTag("property", "og:type", ogType);
  updateMetaTag("property", "og:image", ogImage);
  updateMetaTag("property", "og:image:width", "1200");
  updateMetaTag("property", "og:image:height", "630");
  updateMetaTag("property", "og:image:alt", title);
  updateMetaTag("property", "og:url", canonical || SALON_SEO_CONFIG.site.url);
  updateMetaTag("property", "og:site_name", SALON_SEO_CONFIG.site.name);
  updateMetaTag("property", "og:locale", SALON_SEO_CONFIG.site.locale);

  // Twitter Card
  updateMetaTag("name", "twitter:card", "summary_large_image");
  updateMetaTag("name", "twitter:site", twitterHandle);
  updateMetaTag("name", "twitter:creator", twitterHandle);
  updateMetaTag("name", "twitter:title", title);
  updateMetaTag("name", "twitter:description", description);
  updateMetaTag("name", "twitter:image", ogImage);
  updateMetaTag("name", "twitter:image:alt", title);

  // Article dates (for blog posts)
  if (publishedDate) {
    updateMetaTag("property", "article:published_time", publishedDate);
  }
  if (modifiedDate) {
    updateMetaTag("property", "article:modified_time", modifiedDate);
  }

  // Canonical URL
  if (canonical) {
    updateCanonical(canonical);
  }

  // Alternate languages
  if (alternateLanguages.length > 0) {
    updateAlternateLanguages(alternateLanguages);
  }

  // Additional SEO meta tags
  updateMetaTag("name", "geo.region", "IN-TN");
  updateMetaTag(
    "name",
    "geo.placename",
    SALON_SEO_CONFIG.address.addressLocality,
  );
  updateMetaTag(
    "name",
    "geo.position",
    `${SALON_SEO_CONFIG.geo.latitude};${SALON_SEO_CONFIG.geo.longitude}`,
  );
  updateMetaTag(
    "name",
    "ICBM",
    `${SALON_SEO_CONFIG.geo.latitude}, ${SALON_SEO_CONFIG.geo.longitude}`,
  );

  // Mobile & PWA
  updateMetaTag("name", "mobile-web-app-capable", "yes");
  updateMetaTag("name", "apple-mobile-web-app-capable", "yes");
  updateMetaTag(
    "name",
    "apple-mobile-web-app-status-bar-style",
    "black-translucent",
  );
  updateMetaTag("name", "apple-mobile-web-app-title", "Velvet Salon");

  // Verification (add your actual verification codes)
  // updateMetaTag('name', 'google-site-verification', 'YOUR_GOOGLE_VERIFICATION_CODE');
  // updateMetaTag('name', 'msvalidate.01', 'YOUR_BING_VERIFICATION_CODE');
};

// ============================================
// REACT HOOKS
// ============================================

/**
 * Main SEO Hook - Use this in your page components
 */
export const useAdvancedSEO = (config: {
  page:
    | "home"
    | "services"
    | "gallery"
    | "team"
    | "contact"
    | "booking"
    | "blog"
    | "faq"
    | "about";
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string[];
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: object[];
}) => {
  useEffect(() => {
    const pageConfigs: Record<string, SEOData> = {
      home: {
        title:
          "Velvet Luxury Salon | Best Premium Hair & Beauty Salon in Bhavani, Erode",
        description:
          "Experience the finest luxury hair and beauty services at Velvet Luxury Salon Bhavani, Erode. Expert stylists, premium hair cutting, coloring, bridal makeup, spa services. ⭐ 4.9 Rating. Book Now!",
        keywords: [
          "best salon Bhavani",
          "luxury salon Erode",
          "hair salon near me",
          "bridal makeup Bhavani",
        ],
        canonical: SALON_SEO_CONFIG.site.url,
        ogType: "business.business",
      },
      services: {
        title:
          "Premium Salon Services - Hair, Beauty & Spa | Velvet Luxury Salon",
        description:
          "Explore our comprehensive range of luxury salon services: Hair cutting & styling, coloring, keratin treatment, facial, makeup, manicure, pedicure, spa services & more. Book online!",
        keywords: [
          "salon services",
          "hair cutting",
          "hair coloring",
          "facial services",
          "spa services",
        ],
        canonical: `${SALON_SEO_CONFIG.site.url}/services`,
      },
      gallery: {
        title:
          "Our Work Gallery - Hair Transformations & Salon Ambiance | Velvet Luxury Salon",
        description:
          "View stunning hair transformations, before & after photos, and our elegant salon ambiance at Velvet Luxury Salon. Get inspired for your next look!",
        keywords: [
          "salon gallery",
          "hair transformation",
          "before after hair",
          "salon photos",
        ],
        canonical: `${SALON_SEO_CONFIG.site.url}/gallery`,
      },
      team: {
        title: "My Account - Profile & Settings | Velvet Luxury Salon",
        description:
          "Manage your Velvet Luxury Salon account. View your profile, loyalty points, memberships, and preferences all in one place.",
        keywords: [
          "customer profile",
          "account settings",
          "loyalty points",
          "user profile",
        ],
        canonical: `${SALON_SEO_CONFIG.site.url}/profile`,
      },
      contact: {
        title:
          "Contact Us - Location, Hours & Booking | Velvet Luxury Salon Bhavani",
        description:
          "Get in touch with Velvet Luxury Salon. Visit us at Bharathi Nagar, Bhavani, Erode. Open Mon-Sat 8AM-9PM, Sun 10AM-8PM. Call +91-9345678646 or book online!",
        keywords: [
          "salon contact",
          "salon location Bhavani",
          "salon hours",
          "book appointment",
        ],
        canonical: `${SALON_SEO_CONFIG.site.url}/contact`,
      },
      booking: {
        title: "Book Your Appointment Online | Velvet Luxury Salon",
        description:
          "Easy online appointment booking at Velvet Luxury Salon. Choose your service, stylist, and preferred time. Instant confirmation. No waiting!",
        keywords: [
          "book salon appointment",
          "online booking",
          "salon reservation",
        ],
        canonical: `${SALON_SEO_CONFIG.site.url}/booking`,
      },
      blog: {
        title: "Hair & Beauty Tips, Trends & Guides | Velvet Luxury Salon Blog",
        description:
          "Expert hair care tips, latest beauty trends, styling guides, and professional advice from our salon experts. Stay updated with the latest in beauty!",
        keywords: ["hair tips", "beauty blog", "hair care", "styling tips"],
        canonical: `${SALON_SEO_CONFIG.site.url}/blog`,
      },
      faq: {
        title: "Frequently Asked Questions | Velvet Luxury Salon",
        description:
          "Find answers to common questions about our services, pricing, booking, cancellation policy, and more. Everything you need to know about Velvet Luxury Salon.",
        keywords: ["salon FAQ", "salon questions", "booking policy"],
        canonical: `${SALON_SEO_CONFIG.site.url}/faq`,
      },
      about: {
        title: "About Velvet Luxury Salon - Our Story & Mission",
        description:
          "Discover the story behind Velvet Luxury Salon. Our mission is to provide exceptional beauty services with personalized care. Serving Bhavani, Erode since 2020.",
        keywords: ["about salon", "salon story", "salon mission"],
        canonical: `${SALON_SEO_CONFIG.site.url}/about`,
      },
    };

    const seoConfig = pageConfigs[config.page] || pageConfigs.home;

    // Apply custom overrides
    if (config.customTitle) seoConfig.title = config.customTitle;
    if (config.customDescription)
      seoConfig.description = config.customDescription;
    if (config.customKeywords)
      seoConfig.keywords = [
        ...(seoConfig.keywords || []),
        ...config.customKeywords,
      ];

    // Set meta tags
    setSEOMetaTags(seoConfig);

    // Add breadcrumbs if provided
    if (config.breadcrumbs && config.breadcrumbs.length > 0) {
      addStructuredData(
        generateBreadcrumbSchema(config.breadcrumbs),
        "breadcrumb",
      );
    }

    // Add custom structured data
    if (config.structuredData) {
      config.structuredData.forEach((data, index) => {
        addStructuredData(data, `custom-${index}`);
      });
    }

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Cleanup function
    return () => {
      // Optional: cleanup dynamic scripts on unmount
    };
  }, [config]);
};

/**
 * Hook for Service pages with service-specific SEO
 */
export const useServiceSEO = (service: ServiceData) => {
  useEffect(() => {
    setSEOMetaTags({
      title: `${service.name} - Professional Service | Velvet Luxury Salon`,
      description: `${service.description} Starting from ₹${service.price}. Book your ${service.name} appointment at Velvet Luxury Salon today!`,
      keywords: [
        service.name.toLowerCase(),
        service.category?.toLowerCase() || "salon service",
      ],
      canonical: `${SALON_SEO_CONFIG.site.url}/services/${service.name.toLowerCase().replace(/\s+/g, "-")}`,
    });

    addStructuredData(generateServiceSchema(service), "service");
  }, [service]);
};

/**
 * Hook for Blog/Article pages
 */
export const useArticleSEO = (article: ArticleData) => {
  useEffect(() => {
    setSEOMetaTags({
      title: article.headline,
      description: article.description,
      ogType: "article",
      ogImage: article.image,
      publishedDate: article.datePublished,
      modifiedDate: article.dateModified,
    });

    addStructuredData(generateArticleSchema(article), "article");
  }, [article]);
};

/**
 * Hook for FAQ page
 */
export const useFAQSEO = (faqs: FAQData[]) => {
  useEffect(() => {
    addStructuredData(generateFAQSchema(faqs), "faq");
  }, [faqs]);
};

// ============================================
// ADVANCED SEO COMPONENT
// ============================================

interface AdvancedSEOProps {
  page?:
    | "home"
    | "services"
    | "gallery"
    | "team"
    | "contact"
    | "booking"
    | "blog"
    | "faq"
    | "about";
  title?: string;
  description?: string;
  keywords?: string[];
  breadcrumbs?: BreadcrumbItem[];
  services?: ServiceData[];
  faqs?: FAQData[];
  reviews?: ReviewData[];
  article?: ArticleData;
}

/**
 * Advanced SEO Component - Add to any page for complete SEO
 */
export const AdvancedSEO: React.FC<AdvancedSEOProps> = ({
  page = "home",
  title,
  description,
  keywords,
  breadcrumbs,
  services,
  faqs,
  reviews,
  article,
}) => {
  useAdvancedSEO({
    page,
    customTitle: title,
    customDescription: description,
    customKeywords: keywords,
    breadcrumbs,
  });

  useEffect(() => {
    // Add services schema if provided
    if (services && services.length > 0) {
      addStructuredData(generateServiceListSchema(services), "services-list");
    }

    // Add FAQ schema if provided
    if (faqs && faqs.length > 0) {
      addStructuredData(generateFAQSchema(faqs), "faqs");
    }

    // Add reviews schema if provided
    if (reviews && reviews.length > 0) {
      reviews.forEach((review, index) => {
        addStructuredData(generateReviewSchema(review), `review-${index}`);
      });
    }

    // Add article schema if provided
    if (article) {
      addStructuredData(generateArticleSchema(article), "article");
    }
  }, [services, faqs, reviews, article]);

  return null; // This component doesn't render anything
};

export default AdvancedSEO;
