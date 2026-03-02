/**
 * useSEO Hook - Simplified SEO management for React components
 * Automatically manages meta tags, structured data, and page optimization
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  updatePageSEO,
  addStructuredData,
  generateMetaTags,
} from "../utils/seoUtils";
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "../utils/schemaMarkup";
import { SEO_CONFIG } from "../config/seoConfig";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: "website" | "article" | "product" | "business.business";
  author?: string;
  canonicalUrl?: string;
  robots?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  schema?: Record<string, any>;
  structuredData?: Record<string, any>[];
  noIndex?: boolean;
  noFollow?: boolean;
}

/**
 * Main SEO Hook - Use in any page component
 * Automatically updates meta tags and structured data
 */
export const useSEO = (config: SEOConfig) => {
  const location = useLocation();

  useEffect(() => {
    // Get canonical URL
    const canonicalUrl =
      config.canonicalUrl || `${SEO_CONFIG.site.url}${location.pathname}`;

    // Prepare robots meta tag
    const robotsContent = `${config.noIndex ? "noindex" : "index"}, ${config.noFollow ? "nofollow" : "follow"}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`;

    // Update page SEO
    updatePageSEO({
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      canonical: canonicalUrl,
      ogImage: config.image || SEO_CONFIG.site.image,
      ogType: config.type || "website",
      ogUrl: canonicalUrl,
      author: config.author || SEO_CONFIG.site.name,
      robots: config.robots || robotsContent,
      twitterCard: "summary_large_image",
    });

    // Add breadcrumb schema if provided
    if (config.breadcrumbs && config.breadcrumbs.length > 0) {
      const breadcrumbSchema = generateBreadcrumbSchema(config.breadcrumbs);
      addStructuredData(breadcrumbSchema);
    }

    // Add custom structured data
    if (config.schema) {
      addStructuredData(config.schema);
    }

    // Add multiple structured data items
    if (config.structuredData && Array.isArray(config.structuredData)) {
      config.structuredData.forEach((schema) => {
        if (schema) {
          addStructuredData(schema);
        }
      });
    }

    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [config, location]);
};

/**
 * Hook for setting SEO from page key
 * Automatically uses config from seoConfig.ts
 */
export const usePageSEO = (
  pageKey: keyof (typeof SEO_CONFIG)["pages"],
  customConfig?: Partial<SEOConfig>,
) => {
  const pageConfig = generateMetaTags(pageKey);

  const fullConfig: SEOConfig = {
    ...pageConfig,
    ...customConfig,
  } as SEOConfig;

  useSEO(fullConfig);
};

/**
 * Hook for home page SEO with organization schema
 */
export const useHomeSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const homeConfig = SEO_CONFIG.pages.home;
    const canonicalUrl = `${SEO_CONFIG.site.url}${location.pathname}`;

    updatePageSEO({
      title: homeConfig.title,
      description: homeConfig.description,
      keywords: homeConfig.keywords,
      canonical: canonicalUrl,
      ogImage: SEO_CONFIG.site.image,
      ogType: "business.business",
      ogUrl: canonicalUrl,
      author: SEO_CONFIG.site.name,
    });

    // Add organization and local business schemas
    addStructuredData(generateOrganizationSchema());
    addStructuredData(generateLocalBusinessSchema());

    window.scrollTo(0, 0);
  }, [location]);
};

/**
 * Hook for FAQ page SEO
 */
export const useFAQSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const faqConfig = SEO_CONFIG.pages.faq;
    const canonicalUrl = `${SEO_CONFIG.site.url}/faq`;

    updatePageSEO({
      title: faqConfig.title,
      description: faqConfig.description,
      keywords: faqConfig.keywords,
      canonical: canonicalUrl,
      ogImage: SEO_CONFIG.site.image,
      author: SEO_CONFIG.site.name,
    });

    // Add FAQ schema
    addStructuredData(generateFAQSchema());

    // Add breadcrumb
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: "FAQ", url: "/faq" },
    ];
    addStructuredData(generateBreadcrumbSchema(breadcrumbs));

    window.scrollTo(0, 0);
  }, [location]);
};

/**
 * Hook for service pages SEO
 */
export const useServiceSEO = (serviceConfig: {
  name: string;
  description: string;
  image?: string;
}) => {
  const location = useLocation();

  useEffect(() => {
    const title = `${serviceConfig.name} | Velvet Luxury Salon`;
    const canonicalUrl = `${SEO_CONFIG.site.url}${location.pathname}`;

    updatePageSEO({
      title,
      description: serviceConfig.description,
      canonical: canonicalUrl,
      ogImage: serviceConfig.image || SEO_CONFIG.site.image,
      author: SEO_CONFIG.site.name,
    });

    // Add breadcrumb
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: serviceConfig.name, url: location.pathname },
    ];
    addStructuredData(generateBreadcrumbSchema(breadcrumbs));

    window.scrollTo(0, 0);
  }, [serviceConfig, location]);
};

/**
 * Hook for blog article SEO
 */
export const useArticleSEO = (articleConfig: {
  title: string;
  description: string;
  image?: string;
  author?: string;
  publishedDate: string;
  modifiedDate?: string;
  content?: string;
}) => {
  const location = useLocation();

  useEffect(() => {
    const canonicalUrl = `${SEO_CONFIG.site.url}${location.pathname}`;

    updatePageSEO({
      title: `${articleConfig.title} | Blog`,
      description: articleConfig.description,
      canonical: canonicalUrl,
      ogImage: articleConfig.image || SEO_CONFIG.site.image,
      ogType: "article",
      author: articleConfig.author || SEO_CONFIG.site.name,
    });

    // Add article schema
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: articleConfig.title,
      description: articleConfig.description,
      image: articleConfig.image || SEO_CONFIG.site.image,
      datePublished: articleConfig.publishedDate,
      dateModified: articleConfig.modifiedDate || articleConfig.publishedDate,
      author: {
        "@type": "Person",
        name: articleConfig.author || SEO_CONFIG.site.name,
      },
      publisher: {
        "@type": "Organization",
        name: SEO_CONFIG.site.name,
        logo: {
          "@type": "ImageObject",
          url: SEO_CONFIG.site.logo,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    };

    addStructuredData(articleSchema);

    // Add breadcrumb
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: articleConfig.title, url: location.pathname },
    ];
    addStructuredData(generateBreadcrumbSchema(breadcrumbs));

    window.scrollTo(0, 0);
  }, [articleConfig, location]);
};

/**
 * Hook for contact page SEO
 */
export const useContactSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const contactConfig = SEO_CONFIG.pages.contact;
    const canonicalUrl = `${SEO_CONFIG.site.url}/contact`;

    updatePageSEO({
      title: contactConfig.title,
      description: contactConfig.description,
      keywords: contactConfig.keywords,
      canonical: canonicalUrl,
      ogImage: SEO_CONFIG.site.image,
      author: SEO_CONFIG.site.name,
    });

    // Add contact page schema
    const contactSchema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      mainEntity: {
        "@type": ["LocalBusiness", "BeautySalon"],
        name: SEO_CONFIG.site.name,
        telephone: SEO_CONFIG.contact.phone,
        email: SEO_CONFIG.contact.email,
        url: SEO_CONFIG.site.url,
        address: {
          "@type": "PostalAddress",
          streetAddress: SEO_CONFIG.business.address.streetAddress,
          addressLocality: SEO_CONFIG.business.address.addressLocality,
          addressRegion: SEO_CONFIG.business.address.addressRegion,
          postalCode: SEO_CONFIG.business.address.postalCode,
          addressCountry: SEO_CONFIG.business.address.addressCountry,
        },
      },
    };

    addStructuredData(contactSchema);

    // Add breadcrumb
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: "Contact", url: "/contact" },
    ];
    addStructuredData(generateBreadcrumbSchema(breadcrumbs));

    window.scrollTo(0, 0);
  }, [location]);
};

/**
 * Hook for product/offer pages SEO
 */
export const useProductSEO = (productConfig: {
  name: string;
  description: string;
  price: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
}) => {
  const location = useLocation();

  useEffect(() => {
    const canonicalUrl = `${SEO_CONFIG.site.url}${location.pathname}`;

    updatePageSEO({
      title: `${productConfig.name} | Velvet Luxury Salon`,
      description: productConfig.description,
      canonical: canonicalUrl,
      ogImage: productConfig.image || SEO_CONFIG.site.image,
      ogType: "product",
    });

    // Add product schema
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productConfig.name,
      description: productConfig.description,
      image: productConfig.image || SEO_CONFIG.site.image,
      brand: {
        "@type": "Brand",
        name: SEO_CONFIG.site.name,
      },
      offers: {
        "@type": "Offer",
        price: productConfig.price.toString(),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: SEO_CONFIG.site.name,
          url: SEO_CONFIG.site.url,
        },
      },
      ...(productConfig.rating && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: productConfig.rating.toString(),
          bestRating: "5",
          worstRating: "1",
          ratingCount: productConfig.reviewCount || 1,
        },
      }),
    };

    addStructuredData(productSchema);

    window.scrollTo(0, 0);
  }, [productConfig, location]);
};

/**
 * Hook to add image alt text SEO improvements
 */
export const useImageSEO = (selector: string = "img") => {
  useEffect(() => {
    const images = document.querySelectorAll(selector);
    images.forEach((img) => {
      if (!img.getAttribute("alt")) {
        console.warn("Image missing alt text:", img);
      }
    });
  }, [selector]);
};

/**
 * Hook to validate internal links
 */
export const useInternalLinksSEO = (selector: string = 'a[href^="/"]') => {
  useEffect(() => {
    const links = document.querySelectorAll(selector);
    const brokenLinks: string[] = [];

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") {
        brokenLinks.push(href || "empty");
      }
    });

    if (brokenLinks.length > 0) {
      console.warn("Potential broken internal links:", brokenLinks);
    }
  }, [selector]);
};

/**
 * Hook to monitor Core Web Vitals
 */
export const useCoreWebVitals = () => {
  useEffect(() => {
    // Implement Core Web Vitals monitoring
    if ("PerformanceObserver" in window) {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          console.log("LCP:", lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
              console.log("CLS:", clsValue);
            }
          }
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            const firstInputEntry = entry as any;
            console.log("FID:", firstInputEntry.processingDuration);
          });
        });
        fidObserver.observe({ entryTypes: ["first-input"] });

        return () => {
          lcpObserver.disconnect();
          clsObserver.disconnect();
          fidObserver.disconnect();
        };
      } catch (error) {
        console.error("Core Web Vitals monitoring error:", error);
      }
    }
  }, []);
};

export default useSEO;
