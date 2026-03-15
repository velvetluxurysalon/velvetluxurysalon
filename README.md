# Velvet Premium Unisex Salon - Frontend

This is the customer-facing frontend for Velvet Premium Unisex Salon website.

## Quick Start

### Prerequisites

- Node.js 16.0 or higher
- npm or pnpm package manager

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The website will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

Built files will be in the `dist/` directory.

## Features

### User-Facing Pages

- **Home Page** - Hero section, featured services, recent work
- **Services** - Detailed service catalog with descriptions and pricing
- **Booking** - Appointment scheduling system
- **Gallery** - Portfolio of work and salon images
- **Team** - Staff profiles and expertise
- **Blog** - Beauty tips and salon news
- **Testimonials** - Customer reviews and feedback
- **FAQ** - Common questions and answers
- **Contact** - Location, phone, email, contact form
- **Products** - Premium products available for purchase
- **Special Offers** - Current promotions and discounts
- **Newsletter** - Email subscription for updates

### Features

- **Responsive Design** - Works on all devices
- **SEO Optimized** - Meta tags and structured data
- **Fast Loading** - Optimized images and assets
- **Accessibility** - WCAG compliant
- **Social Integration** - Share buttons and links
- **Contact Forms** - Customer inquiries
- **Booking System** - Real-time appointment scheduling

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── frontend/
│   │   │   ├── components/      # Frontend UI components
│   │   │   ├── services/        # API calls
│   │   │   └── context/         # React context
│   │   └── styles/              # Global styles
│   ├── components/              # Shared components
│   ├── config/                  # Configuration
│   ├── seo/                     # SEO utilities
│   ├── hooks/                   # Custom hooks
│   ├── utils/                   # Utilities
│   ├── firebaseConfig.ts        # Firebase configuration
│   └── main.tsx                 # Entry point
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── icons/                   # App icons
│   └── robots.txt               # SEO robots file
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
└── README.md                   # This file
```

## Key Components

### Pages

- **HeroSection.tsx** - Landing page hero
- **BookingForm.tsx** - Appointment booking
- **GallerySection.tsx** - Photo gallery
- **TeamSection.tsx** - Staff profiles
- **BlogSection.tsx** - Blog posts
- **TestimonialsSection.tsx** - Customer reviews
- **FAQSection.tsx** - Frequently asked questions
- **LocationContact.tsx** - Contact information
- **ProductShowcase.tsx** - Product listings
- **SpecialOffers.tsx** - Promotions
- **Newsletter.tsx** - Email subscription

### Components

- **Navigation.tsx** - Header navigation
- **Footer.tsx** - Footer with links
- **AuthPage.tsx** - Customer authentication
- **CTASection.tsx** - Call-to-action sections

## Technologies

- **React 18.3.1** - UI framework
- **Vite 6.3.5** - Build tool
- **TypeScript 5.0** - Type safety
- **Tailwind CSS 4.1.12** - Styling
- **Firebase 12.7.0** - Backend & database
- **Recharts** - Data visualization
- **React Router** - Routing
- **Lucide React** - Icons
- **Embla Carousel** - Image carousel

## SEO Optimization

The frontend includes comprehensive SEO features:

- Meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Structured data (JSON-LD)
- Sitemap integration
- Mobile optimization
- Fast page load speed
- Social media integration

### SEO Configuration

Edit `src/config/seoConfig.ts` to customize:

- Site title and description
- Social media handles
- Contact information
- Keywords and tags

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Content Management

Content can be managed through:

1. **Firebase Firestore** - Database
2. **Admin Dashboard** - Content management interface
3. **Direct editing** - Update component props

### Collections Used

- `appointments` - Booking data
- `content` - Page content
- `services` - Service catalog
- `products` - Product information
- `newsletter` - Email subscriptions
- `reviews` - Customer testimonials
- `blog` - Blog posts

## Booking System

The booking system integrates with Firebase:

1. Customer selects service and date
2. Chooses available time slot
3. Enters contact information
4. Receives confirmation email
5. Admin gets notification with sound alert

## Performance

- Optimized images with modern formats
- Code splitting and lazy loading
- Minified CSS and JavaScript
- Efficient component re-rendering
- Service worker for offline capability

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Deployment

### Step 1: Build

```bash
npm run build
```

### Step 2: Deploy

Deploy the `dist/` folder to your hosting provider:

- Vercel
- Netlify
- GitHub Pages
- Custom server

### Step 3: Configure Environment

Set environment variables on your hosting platform.

## Customization

### Colors & Branding

Edit Tailwind configuration in `tailwind.config.js` and `src/styles/theme.css`

### Fonts

Update font imports in `src/styles/fonts.css`

### Navigation Links

Update `Navigation.tsx` component

### Social Links

Update links in `Footer.tsx` and `seoConfig.ts`

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Screen reader friendly

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Page not loading

- Clear browser cache
- Check console for errors
- Verify Firebase configuration

### Images not showing

- Check image paths
- Verify Firebase Storage permissions
- Check image formats

### Booking not working

- Verify Firebase Firestore rules
- Check email configuration
- Test with different dates

## Analytics Integration

The site supports:

- Google Analytics
- Firebase Analytics
- Custom event tracking

## Social Media Integration

Share buttons for:

- Facebook
- Twitter
- LinkedIn
- WhatsApp
- Email

## Newsletter Integration

- Email collection
- Subscriber management
- Email campaign sending
- Unsubscribe handling

## Contact & Support

For questions or issues, contact the development team or refer to the main project documentation.

## License

© 2025 Velvet Luxury Salon. All rights reserved.
