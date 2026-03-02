/**
 * SEO Index - Export all SEO utilities and components
 */

// Main SEO Component and Hooks
export {
  AdvancedSEO,
  useAdvancedSEO,
  useServiceSEO,
  useArticleSEO,
  useFAQSEO,
  SALON_SEO_CONFIG,
  // Schema Generators
  generateLocalBusinessSchema,
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateServiceSchema,
  generateServiceListSchema,
  generateFAQSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateOfferSchema,
  generateImageGallerySchema,
  generatePersonSchema,
  generateVideoSchema,
  // Meta Tag Utilities
  setSEOMetaTags,
  addStructuredData,
} from './AdvancedSEO';

// Performance Utilities
export {
  getOptimizedImageProps,
  generateSrcSet,
  preloadResource,
  prefetchResource,
  dnsPrefetch,
  reportWebVitals,
  trackPerformance,
  generateSlug,
  getAbsoluteUrl,
  parseUtmParams,
  getAriaLabel,
  prefersReducedMotion,
  getSocialShareUrls,
  openShareDialog,
  formatSchemaPrice,
  formatSchemaDate,
  formatSchemaDuration,
  initializeSEO,
} from './seoPerformance';

// Types
export type {
  SEOData,
  LocalBusinessData,
  OpeningHoursSpecification,
  ServiceData,
  FAQData,
  ReviewData,
  BreadcrumbItem,
  ArticleData,
} from './AdvancedSEO';
