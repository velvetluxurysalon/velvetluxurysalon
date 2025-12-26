/**
 * SEO Configuration for Velvet Luxury Salon
 * Centralized configuration for all SEO metadata
 */

export const SEO_CONFIG = {
  site: {
    name: 'Velvet Luxury Salon',
    url: 'https://velvetluxurysalon.com',
    description: 'Premium luxury salon offering professional hair cutting, coloring, styling, and beauty services',
    image: 'https://velvetluxurysalon.com/og-image.png',
    logo: 'https://velvetluxurysalon.com/logo.png'
  },

  contact: {
    phone: '+91-9345678646',
    email: 'velvetluxurysalon@gmail.com',
    whatsapp: '919345678646'
  },

  social: {
    facebook: 'https://www.facebook.com/velvetluxurysalon',
    instagram: 'https://www.instagram.com/velvetluxurysalon',
    twitter: 'https://www.twitter.com/velvetluxurysalon',
    linkedin: 'https://www.linkedin.com/company/velvetluxurysalon'
  },

  business: {
    type: 'LocalBusiness',
    priceRange: '₹500-₹5000',
    ratingValue: 4.8,
    ratingCount: 150,
    address: {
      streetAddress: 'Your Street Address',
      addressLocality: 'Your City',
      addressRegion: 'Your State',
      postalCode: 'Your Postal Code',
      addressCountry: 'IN'
    },
    hours: {
      monday: { open: '08:00', close: '21:00' },
      tuesday: { open: '08:00', close: '21:00' },
      wednesday: { open: '08:00', close: '21:00' },
      thursday: { open: '08:00', close: '21:00' },
      friday: { open: '08:00', close: '21:00' },
      saturday: { open: '08:00', close: '21:00' },
      sunday: { open: '10:00', close: '20:00' }
    }
  },

  pages: {
    home: {
      title: 'Velvet Luxury Salon | Premium Hair & Beauty Services',
      description: 'Experience luxury hair and beauty services at Velvet Luxury Salon. Expert stylists, premium treatments, and personalized care. Book your appointment today!',
      keywords: 'salon, hair salon, beauty salon, luxury services, hair cutting, hair coloring'
    },

    services: {
      title: 'Our Services | Velvet Luxury Salon',
      description: 'Explore our comprehensive range of professional hair and beauty services including cutting, coloring, styling, treatments, and more.',
      keywords: 'hair services, beauty services, hair cutting, hair coloring, hair treatment, styling, makeup'
    },

    gallery: {
      title: 'Gallery | Velvet Luxury Salon',
      description: 'View our stunning gallery of transformations and salon ambiance at Velvet Luxury Salon.',
      keywords: 'salon gallery, before and after, hair transformation, beauty gallery'
    },

    booking: {
      title: 'Book Appointment | Velvet Luxury Salon',
      description: 'Easy online booking for your salon appointment. Choose your preferred date, time, and service.',
      keywords: 'book appointment, online booking, salon reservation'
    },

    blog: {
      title: 'Blog | Velvet Luxury Salon',
      description: 'Read our latest articles about hair care, beauty tips, and salon trends.',
      keywords: 'blog, hair tips, beauty tips, salon trends'
    },

    contact: {
      title: 'Contact Us | Velvet Luxury Salon',
      description: 'Get in touch with us. Find our location, hours, and contact information.',
      keywords: 'contact, phone, email, location, hours'
    },

    about: {
      title: 'About Us | Velvet Luxury Salon',
      description: 'Learn about Velvet Luxury Salon, our mission, and our team of professional stylists.',
      keywords: 'about, salon, team, stylists'
    },

    faq: {
      title: 'FAQ | Velvet Luxury Salon',
      description: 'Frequently asked questions about our services, pricing, and policies.',
      keywords: 'faq, questions, answers'
    }
  },

  keywords: {
    primary: ['salon', 'hair salon', 'beauty salon', 'luxury salon'],
    secondary: [
      'hair cutting',
      'hair coloring',
      'hair styling',
      'hair treatment',
      'makeup',
      'spa services',
      'professional stylists'
    ],
    location: ['salon near me', 'beauty services in your city']
  },

  robots: {
    maxSnippet: -1,
    maxImagePreview: 'large',
    maxVideoPreview: -1
  },

  // Breadcrumb navigation paths
  breadcrumbs: {
    services: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' }
    ],
    booking: [
      { name: 'Home', url: '/' },
      { name: 'Booking', url: '/booking' }
    ],
    blog: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' }
    ]
  }
};

// Dynamic page SEO helper
export const getPageSEO = (page: keyof typeof SEO_CONFIG['pages']) => {
  return SEO_CONFIG.pages[page] || SEO_CONFIG.pages.home;
};

// Generate full SEO config for a page
export const generatePageSEO = (page: keyof typeof SEO_CONFIG['pages'], custom?: any) => {
  const baseSEO = getPageSEO(page);
  return {
    ...baseSEO,
    canonical: `${SEO_CONFIG.site.url}${page === 'home' ? '/' : `/${page}`}`,
    ogImage: SEO_CONFIG.site.image,
    ...custom
  };
};
