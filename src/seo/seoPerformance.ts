/**
 * SEO Performance & Core Web Vitals Optimization
 * Utilities for improving page speed and SEO performance
 */

// ============================================
// LAZY LOADING & IMAGE OPTIMIZATION
// ============================================

/**
 * Create optimized image attributes for SEO
 */
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  options?: {
    width?: number;
    height?: number;
    priority?: boolean;
    sizes?: string;
  }
) => {
  const { width, height, priority = false, sizes } = options || {};
  
  return {
    src,
    alt,
    loading: priority ? 'eager' as const : 'lazy' as const,
    decoding: 'async' as const,
    ...(width && { width }),
    ...(height && { height }),
    ...(sizes && { sizes }),
    // Add srcset for responsive images if needed
    style: {
      maxWidth: '100%',
      height: 'auto',
    },
  };
};

/**
 * Generate WebP srcset for responsive images
 */
export const generateSrcSet = (basePath: string, sizes: number[]): string => {
  return sizes
    .map(size => `${basePath}?w=${size} ${size}w`)
    .join(', ');
};

// ============================================
// PRELOADING & PREFETCHING
// ============================================

/**
 * Preload critical resources
 */
export const preloadResource = (
  href: string,
  as: 'image' | 'script' | 'style' | 'font' | 'fetch',
  type?: string
) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  if (as === 'font') link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/**
 * Prefetch resources for future navigation
 */
export const prefetchResource = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

/**
 * DNS prefetch for external domains
 */
export const dnsPrefetch = (domain: string) => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
};

// ============================================
// PERFORMANCE MONITORING
// ============================================

/**
 * Report Core Web Vitals
 */
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    }).catch(() => {
      // web-vitals not available
    });
  }
};

/**
 * Track performance metrics
 */
export const trackPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.timing;
        const metrics = {
          pageLoadTime: timing.loadEventEnd - timing.navigationStart,
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          firstPaint: 0,
          firstContentfulPaint: 0,
        };

        // Get paint metrics
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry) => {
          if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime;
          }
          if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          }
        });

        console.log('Performance Metrics:', metrics);
        
        // Send to analytics if needed
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'performance', {
            event_category: 'Web Vitals',
            page_load_time: metrics.pageLoadTime,
            dom_content_loaded: metrics.domContentLoaded,
            first_paint: metrics.firstPaint,
            first_contentful_paint: metrics.firstContentfulPaint,
          });
        }
      }, 0);
    });
  }
};

// ============================================
// SEO URL UTILITIES
// ============================================

/**
 * Generate SEO-friendly URL slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Get absolute URL
 */
export const getAbsoluteUrl = (path: string): string => {
  const baseUrl = 'https://velvetluxurysalon.in';
  return path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

/**
 * Parse URL parameters for tracking
 */
export const parseUtmParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
    const value = params.get(param);
    if (value) utmParams[param] = value;
  });
  
  return utmParams;
};

// ============================================
// ACCESSIBILITY HELPERS
// ============================================

/**
 * Generate accessible aria labels
 */
export const getAriaLabel = (action: string, target: string): string => {
  return `${action} ${target}`;
};

/**
 * Check if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// ============================================
// SOCIAL SHARING
// ============================================

interface ShareConfig {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

/**
 * Generate social sharing URLs
 */
export const getSocialShareUrls = (config: ShareConfig) => {
  const { url, title, description = '', image = '' } = config;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(image)}&description=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };
};

/**
 * Open share dialog
 */
export const openShareDialog = (platform: keyof ReturnType<typeof getSocialShareUrls>, config: ShareConfig) => {
  const urls = getSocialShareUrls(config);
  const url = urls[platform];
  
  if (platform === 'email') {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'width=600,height=400,scrollbars=yes');
  }
};

// ============================================
// SCHEMA.ORG HELPERS
// ============================================

/**
 * Format price for schema
 */
export const formatSchemaPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Format date for schema (ISO 8601)
 */
export const formatSchemaDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
};

/**
 * Format duration for schema (ISO 8601 duration)
 */
export const formatSchemaDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `PT${hours}H${mins}M`;
  } else if (hours > 0) {
    return `PT${hours}H`;
  } else {
    return `PT${mins}M`;
  }
};

// ============================================
// INITIALIZE SEO OPTIMIZATIONS
// ============================================

/**
 * Initialize all SEO optimizations on page load
 */
export const initializeSEO = () => {
  // Track performance
  trackPerformance();

  // DNS prefetch common external resources
  dnsPrefetch('//fonts.googleapis.com');
  dnsPrefetch('//fonts.gstatic.com');
  dnsPrefetch('//www.google-analytics.com');
  dnsPrefetch('//www.googletagmanager.com');

  // Add structured data for breadcrumbs on current page
  const path = window.location.pathname;
  if (path !== '/') {
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://velvetluxurysalon.in"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": path.replace('/', '').charAt(0).toUpperCase() + path.slice(2),
          "item": `https://velvetluxurysalon.in${path}`
        }
      ]
    });
    document.head.appendChild(breadcrumbScript);
  }

  console.log('SEO optimizations initialized');
};

export default {
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
};
