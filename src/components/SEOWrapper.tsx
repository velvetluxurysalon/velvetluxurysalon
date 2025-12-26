/**
 * SEO Wrapper Component
 * Wraps pages to automatically inject SEO metadata
 */

import React, { ReactNode, useEffect } from 'react';
import { updatePageSEO, addStructuredData } from '../utils/seoUtils';
import { SEO_CONFIG } from '../config/seoConfig';

interface SEOWrapperProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'product' | 'business.business';
  structuredData?: Record<string, any>;
  children: ReactNode;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * SEO Wrapper Component
 * Place this at the top of your page components
 * 
 * @example
 * <SEOWrapper
 *   title="Our Services"
 *   description="Explore our professional salon services"
 *   keywords="services, hair, salon"
 * >
 *   <YourPageContent />
 * </SEOWrapper>
 */
export const SEOWrapper: React.FC<SEOWrapperProps> = ({
  title,
  description,
  keywords,
  image,
  canonical,
  ogType = 'website',
  structuredData,
  children,
  breadcrumbs
}) => {
  useEffect(() => {
    // Update meta tags
    updatePageSEO({
      title,
      description,
      keywords,
      canonical,
      ogImage: image || SEO_CONFIG.site.image,
      ogType
    });

    // Add custom structured data
    if (structuredData) {
      addStructuredData(structuredData);
    }

    // Add breadcrumbs if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
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

    // Scroll to top
    window.scrollTo(0, 0);
  }, [title, description, keywords, image, canonical, ogType, structuredData, breadcrumbs]);

  return <>{children}</>;
};

export default SEOWrapper;
