/**
 * React Hook for SEO Management
 * Use this hook in any component to automatically set page SEO metadata
 */

import { useEffect } from 'react';
import { updatePageSEO, addStructuredData, scrollToTop } from '../utils/seoUtils';
import { generatePageSEO, SEO_CONFIG } from '../config/seoConfig';

interface UseSEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: Record<string, any>;
  scrollToTop?: boolean;
}

/**
 * Hook to manage SEO metadata for a page
 * @param config - SEO configuration object
 * 
 * @example
 * useSEO({
 *   title: 'Our Services',
 *   description: 'Check out our salon services',
 *   keywords: 'services, hair cutting, styling'
 * });
 */
export const useSEO = (config: UseSEOConfig) => {
  useEffect(() => {
    // Update page SEO
    updatePageSEO({
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      canonical: config.canonical,
      ogImage: config.image || SEO_CONFIG.site.image,
      ogType: config.ogType,
      twitterCard: config.twitterCard
    });

    // Add structured data if provided
    if (config.structuredData) {
      addStructuredData(config.structuredData);
    }

    // Scroll to top if requested
    if (config.scrollToTop !== false) {
      scrollToTop();
    }

    // Cleanup - reset to default if needed
    return () => {
      // Optional: reset to home page SEO if component unmounts
    };
  }, [config]);
};

/**
 * Hook to manage SEO for predefined pages
 * @param page - Page name from SEO_CONFIG.pages
 * @param custom - Custom overrides
 * 
 * @example
 * usePageSEO('services', { title: 'Custom Title' });
 */
export const usePageSEO = (
  page: keyof typeof SEO_CONFIG['pages'],
  custom?: Partial<UseSEOConfig>
) => {
  const baseSEO = generatePageSEO(page, custom);
  useSEO({
    ...baseSEO,
    ...custom,
    scrollToTop: custom?.scrollToTop !== false
  });
};

/**
 * Hook to add breadcrumb structured data
 * @param breadcrumbs - Array of breadcrumb items
 */
export const useBreadcrumbs = (
  breadcrumbs: Array<{ name: string; url: string }>
) => {
  useEffect(() => {
    if (breadcrumbs.length > 0) {
      addStructuredData({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": (index + 1).toString(),
          "name": item.name,
          "item": item.url
        }))
      });
    }
  }, [breadcrumbs]);
};

/**
 * Hook to add service schema structured data
 */
export const useServiceSchema = (service: {
  name: string;
  description: string;
  price: number;
  image?: string;
  duration?: string;
}) => {
  useEffect(() => {
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.name,
      "description": service.description,
      "image": service.image || SEO_CONFIG.site.image,
      "priceRange": `₹${service.price}`,
      "areaServed": {
        "@type": "City",
        "name": SEO_CONFIG.business.address.addressLocality
      },
      "duration": service.duration || "PT30M",
      "provider": {
        "@type": "LocalBusiness",
        "name": SEO_CONFIG.site.name
      }
    });
  }, [service]);
};

/**
 * Hook to add review/rating structured data
 */
export const useReviewSchema = (review: {
  name: string;
  rating: number;
  description: string;
  author: string;
  datePublished: string;
}) => {
  useEffect(() => {
    addStructuredData({
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
  }, [review]);
};

/**
 * Hook to add FAQPage structured data
 */
export const useFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  useEffect(() => {
    if (faqs.length > 0) {
      addStructuredData({
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
    }
  }, [faqs]);
};

/**
 * Hook to add product structured data
 */
export const useProductSchema = (product: {
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  reviewCount?: number;
}) => {
  useEffect(() => {
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.image,
      "brand": {
        "@type": "Brand",
        "name": SEO_CONFIG.site.name
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
  }, [product]);
};

/**
 * Hook to add organization structured data
 */
export const useOrganizationSchema = () => {
  useEffect(() => {
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": SEO_CONFIG.site.name,
      "url": SEO_CONFIG.site.url,
      "logo": SEO_CONFIG.site.logo,
      "sameAs": Object.values(SEO_CONFIG.social),
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "telephone": SEO_CONFIG.contact.phone,
        "email": SEO_CONFIG.contact.email
      }
    });
  }, []);
};
