/**
 * Schema Markup Generator for SEO
 * Generates comprehensive JSON-LD structured data for search engines
 * Helps with Google Rich Snippets, Featured Snippets, and Knowledge Graph
 */

import { SEO_CONFIG } from "../config/seoConfig";

/**
 * Generate Organization Schema - Main business information
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "BeautySalon", "HairSalon"],
    "@id": `${SEO_CONFIG.site.url}/#organization`,
    name: SEO_CONFIG.site.name,
    alternateName: "Velvet Salon",
    description: SEO_CONFIG.site.longDescription,
    url: SEO_CONFIG.site.url,
    logo: {
      "@type": "ImageObject",
      url: SEO_CONFIG.site.logo,
      width: "250",
      height: "250",
    },
    image: {
      "@type": "ImageObject",
      url: SEO_CONFIG.site.mainImage,
      width: "1200",
      height: "630",
    },
    telephone: SEO_CONFIG.contact.phone,
    email: SEO_CONFIG.contact.email,
    foundingDate: "2010",
    numberOfEmployees: 25,
    priceRange: SEO_CONFIG.business.priceRange,
    areaServed: [
      {
        "@type": "City",
        name: "Bhavani",
      },
      {
        "@type": "City",
        name: "Erode",
      },
      {
        "@type": "State",
        name: "Tamil Nadu",
      },
    ],
    sameAs: Object.values(SEO_CONFIG.social).filter(
      (url) => typeof url === "string",
    ),
    address: {
      "@type": "PostalAddress",
      streetAddress: SEO_CONFIG.business.address.streetAddress,
      addressLocality: SEO_CONFIG.business.address.addressLocality,
      addressRegion: SEO_CONFIG.business.address.addressRegion,
      postalCode: SEO_CONFIG.business.address.postalCode,
      addressCountry: SEO_CONFIG.business.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SEO_CONFIG.business.coordinates.latitude,
      longitude: SEO_CONFIG.business.coordinates.longitude,
    },
    openingHoursSpecification: Object.values(SEO_CONFIG.openingHoursSchema),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SEO_CONFIG.business.ratingValue.toString(),
      bestRating: "5",
      worstRating: "1",
      ratingCount: SEO_CONFIG.business.ratingCount,
      reviewCount: SEO_CONFIG.business.reviewCount,
      name: `${SEO_CONFIG.business.ratingValue}/5 Based on ${SEO_CONFIG.business.reviewCount} reviews`,
    },
    brand: {
      "@type": "Brand",
      name: SEO_CONFIG.site.name,
      logo: SEO_CONFIG.site.logo,
    },
    slogan: "Where Luxury Meets Beauty",
    disambiguatingDescription: "Premium luxury salon and beauty services",
    founder: {
      "@type": "Person",
      name: "Velvet Luxury Team",
    },
    knowsAbout: [
      "Hair Cutting",
      "Hair Coloring",
      "Hair Styling",
      "Hair Treatment",
      "Bridal Makeup",
      "Facial Treatment",
      "Spa Services",
      "Nail Art",
      "Keratin Treatment",
      "Hair Spa",
    ],
    jobTitle: "Beauty & Hair Salon",
    review: [],
  };
};

/**
 * Generate Local Business Schema - Detailed business listing
 */
export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "BeautySalon", "HairSalon"],
    "@id": `${SEO_CONFIG.site.url}/#business`,
    name: SEO_CONFIG.site.name,
    url: SEO_CONFIG.site.url,
    telephone: SEO_CONFIG.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SEO_CONFIG.business.address.streetAddress,
      addressLocality: SEO_CONFIG.business.address.addressLocality,
      addressRegion: SEO_CONFIG.business.address.addressRegion,
      postalCode: SEO_CONFIG.business.address.postalCode,
      addressCountry: SEO_CONFIG.business.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SEO_CONFIG.business.coordinates.latitude,
      longitude: SEO_CONFIG.business.coordinates.longitude,
    },
    openingHours: Object.entries(SEO_CONFIG.business.hours)
      .map(
        ([day, hours]) =>
          `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.open}-${hours.close}`,
      )
      .join("; "),
    openingHoursSpecification: Object.values(SEO_CONFIG.openingHoursSchema),
    image: {
      "@type": "ImageObject",
      url: SEO_CONFIG.site.mainImage,
      width: "1200",
      height: "630",
    },
    logo: {
      "@type": "ImageObject",
      url: SEO_CONFIG.site.logo,
      width: "250",
      height: "250",
    },
    priceRange: SEO_CONFIG.business.priceRange,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SEO_CONFIG.business.ratingValue.toString(),
      bestRating: "5",
      worstRating: "1",
      ratingCount: SEO_CONFIG.business.ratingCount,
    },
    paymentAccepted: SEO_CONFIG.business.paymentMethods.join(", "),
    currenciesAccepted: SEO_CONFIG.business.currenciesAccepted,
    hasMap: `https://www.google.com/maps/place/${encodeURIComponent(SEO_CONFIG.business.address.streetAddress)}/@${SEO_CONFIG.business.coordinates.latitude},${SEO_CONFIG.business.coordinates.longitude},15z`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: SEO_CONFIG.contact.phone,
      email: SEO_CONFIG.contact.email,
      availableLanguage: ["en", "ta"],
    },
  };
};

/**
 * Generate Service Schema - For specific services
 */
export const generateServiceSchema = (service: {
  name: string;
  description: string;
  price?: number;
  image?: string;
  duration?: string;
  category?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    image: service.image,
    provider: {
      "@type": "LocalBusiness",
      name: SEO_CONFIG.site.name,
      url: SEO_CONFIG.site.url,
      telephone: SEO_CONFIG.contact.phone,
    },
    areaServed: {
      "@type": "City",
      name: "Bhavani, Erode",
    },
    ...(service.price && { priceRange: `₹${service.price}` }),
    ...(service.duration && { duration: service.duration }),
    ...(service.category && { category: service.category }),
  };
};

/**
 * Generate FAQ Schema - For FAQ pages
 */
export const generateFAQSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SEO_CONFIG.faqSchema.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generate Breadcrumb Schema - For navigation hierarchy
 */
export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${SEO_CONFIG.site.url}${item.url}`,
    })),
  };
};

/**
 * Generate Review Schema - For customer reviews
 */
export const generateReviewSchema = (review: {
  name: string;
  rating: number;
  description: string;
  author: string;
  datePublished: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    headline: review.name,
    description: review.description,
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Person",
      name: review.author,
    },
    datePublished: review.datePublished,
    reviewBody: review.description,
    mentions: {
      "@type": "Organization",
      name: SEO_CONFIG.site.name,
    },
  };
};

/**
 * Generate Product/Service Offer Schema
 */
export const generateOfferSchema = (offer: {
  name: string;
  description: string;
  price: number;
  image?: string;
  availability?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: offer.name,
    description: offer.description,
    price: offer.price.toString(),
    priceCurrency: "INR",
    image: offer.image,
    availability: offer.availability || "https://schema.org/InStock",
    url: SEO_CONFIG.site.url,
    seller: {
      "@type": "LocalBusiness",
      name: SEO_CONFIG.site.name,
      url: SEO_CONFIG.site.url,
    },
  };
};

/**
 * Generate Event Schema - For salon events/workshops
 */
export const generateEventSchema = (event: {
  name: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  image?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    image: event.image,
    startDate: event.date,
    url: SEO_CONFIG.site.url,
    location: {
      "@type": "Place",
      name: event.location || SEO_CONFIG.site.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: SEO_CONFIG.business.address.streetAddress,
        addressLocality: SEO_CONFIG.business.address.addressLocality,
        addressRegion: SEO_CONFIG.business.address.addressRegion,
        postalCode: SEO_CONFIG.business.address.postalCode,
        addressCountry: SEO_CONFIG.business.address.addressCountry,
      },
    },
    organizer: {
      "@type": "Organization",
      name: SEO_CONFIG.site.name,
      url: SEO_CONFIG.site.url,
    },
    offers: {
      "@type": "Offer",
      url: SEO_CONFIG.site.url,
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/PreOrder",
      validFrom: new Date().toISOString(),
    },
  };
};

/**
 * Generate Article Schema - For blog posts
 */
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  content: string;
  image?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Organization",
      name: article.author || SEO_CONFIG.site.name,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.site.name,
      logo: {
        "@type": "ImageObject",
        url: SEO_CONFIG.site.logo,
        width: "250",
        height: "250",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": SEO_CONFIG.site.url,
    },
    articleBody: article.content,
  };
};

/**
 * Generate WebSite Schema - Global website information
 */
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SEO_CONFIG.site.url,
    name: SEO_CONFIG.site.name,
    description: SEO_CONFIG.site.description,
    image: {
      "@type": "ImageObject",
      url: SEO_CONFIG.site.logo,
      width: "250",
      height: "250",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO_CONFIG.site.url}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    sameAs: Object.values(SEO_CONFIG.social).filter(
      (url) => typeof url === "string",
    ),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: SEO_CONFIG.contact.phone,
      email: SEO_CONFIG.contact.email,
    },
  };
};

/**
 * Generate Contact Page Schema
 */
export const generateContactSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": ["LocalBusiness", "BeautySalon"],
      name: SEO_CONFIG.site.name,
      telephone: SEO_CONFIG.contact.phone,
      email: SEO_CONFIG.contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: SEO_CONFIG.business.address.streetAddress,
        addressLocality: SEO_CONFIG.business.address.addressLocality,
        addressRegion: SEO_CONFIG.business.address.addressRegion,
        postalCode: SEO_CONFIG.business.address.postalCode,
        addressCountry: SEO_CONFIG.business.address.addressCountry,
      },
      url: SEO_CONFIG.site.url,
    },
  };
};

/**
 * Add structured data to document head
 * Prevents duplicates by checking for existing @id
 */
export const addStructuredDataToHead = (schema: any) => {
  if (!schema || typeof document === "undefined") return;

  // Check if script with same @id already exists
  if (schema["@id"]) {
    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    for (const script of existingScripts) {
      try {
        const existingData = JSON.parse(script.textContent || "");
        if (existingData["@id"] === schema["@id"]) {
          return; // Schema already exists
        }
      } catch {
        // Continue if parsing fails
      }
    }
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Generate comprehensive schema markup for the website
 */
export const generateComprehensiveSchema = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      generateWebsiteSchema(),
      generateOrganizationSchema(),
      generateLocalBusinessSchema(),
      generateFAQSchema(),
    ],
  };
};
