#!/usr/bin/env node

/**
 * Firebase Integration Verification Script
 * Verifies that all files are in place and properly configured
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  info: (msg) => console.log(`${COLORS.cyan}ℹ${COLORS.reset} ${msg}`),
  header: (msg) => console.log(`\n${COLORS.blue}═══ ${msg} ═══${COLORS.reset}\n`)
};

// Files that should exist
const requiredFiles = [
  // Frontend components
  'src/app/components/HeroSection.tsx',
  'src/app/components/FeaturedServices.tsx',
  'src/app/components/TeamSection.tsx',
  'src/app/components/GallerySection.tsx',
  'src/app/components/BlogSection.tsx',
  'src/app/components/SpecialOffers.tsx',
  'src/app/components/FAQSection.tsx',
  'src/app/components/LocationContact.tsx',
  
  // Admin pages and services
  'src/admin/src/services/contentService.ts',
  'src/admin/src/pages/ContentManagement.jsx',
  'src/admin/src/pages/ContentManagement.css',
  
  // Configuration files
  'src/admin/src/firebaseConfig.js',
  'vite.config.ts',
  'package.json'
];

// Strings that should be present in files
const requiredContent = {
  'src/app/components/HeroSection.tsx': ['getHeroContent', 'getServices', 'useEffect'],
  'src/app/components/FeaturedServices.tsx': ['getFeaturedServices', 'useEffect'],
  'src/app/components/TeamSection.tsx': ['getTeamMembers', 'useEffect'],
  'src/app/components/GallerySection.tsx': ['getGalleryImages', 'useEffect'],
  'src/app/components/BlogSection.tsx': ['getBlogPosts', 'published'],
  'src/app/components/SpecialOffers.tsx': ['getSpecialOffers', 'active'],
  'src/app/components/FAQSection.tsx': ['getFAQs', 'useEffect'],
  'src/app/components/LocationContact.tsx': ['getContactInfo', 'useEffect'],
  'src/admin/src/services/contentService.ts': ['getServices', 'addService', 'uploadImage'],
  'src/admin/src/pages/ContentManagement.jsx': ['ContentManagement', 'useState', 'useEffect']
};

// Firebase dependencies that should be in package.json
const requiredDependencies = [
  'firebase',
  'react',
  'react-dom'
];

let totalChecks = 0;
let passedChecks = 0;

function checkFile(filePath) {
  totalChecks++;
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    log.success(`Found: ${filePath}`);
    passedChecks++;
    return true;
  } else {
    log.error(`Missing: ${filePath}`);
    return false;
  }
}

function checkFileContent(filePath, requiredStrings) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    log.error(`File doesn't exist: ${filePath}`);
    totalChecks++;
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  let allFound = true;
  
  requiredStrings.forEach(str => {
    totalChecks++;
    if (content.includes(str)) {
      log.success(`Found "${str}" in ${filePath}`);
      passedChecks++;
    } else {
      log.error(`Missing "${str}" in ${filePath}`);
      allFound = false;
    }
  });
  
  return allFound;
}

function checkDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    log.error('package.json not found');
    totalChecks++;
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  let allFound = true;
  requiredDependencies.forEach(dep => {
    totalChecks++;
    if (allDeps[dep]) {
      log.success(`Dependency installed: ${dep} (${allDeps[dep]})`);
      passedChecks++;
    } else {
      log.error(`Missing dependency: ${dep}`);
      allFound = false;
    }
  });
  
  return allFound;
}

function checkFirebaseConfig() {
  const configPath = path.join(process.cwd(), 'src/admin/src/firebaseConfig.js');
  totalChecks++;
  
  if (!fs.existsSync(configPath)) {
    log.error('firebaseConfig.js not found');
    return false;
  }
  
  const config = fs.readFileSync(configPath, 'utf8');
  const requiredConfig = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  let isConfigured = true;
  requiredConfig.forEach(field => {
    if (!config.includes(field)) {
      log.warn(`Firebase config missing field: ${field}`);
      isConfigured = false;
    }
  });
  
  if (isConfigured) {
    log.success('Firebase configuration appears complete');
    passedChecks++;
  } else {
    log.warn('Firebase configuration may be incomplete - verify in firebaseConfig.js');
  }
  
  return isConfigured;
}

// Main execution
console.clear();
console.log(`\n${COLORS.cyan}╔════════════════════════════════════════╗${COLORS.reset}`);
console.log(`${COLORS.cyan}║   Firebase Integration Verification    ║${COLORS.reset}`);
console.log(`${COLORS.cyan}╚════════════════════════════════════════╝${COLORS.reset}\n`);

log.header('Checking Required Files');
requiredFiles.forEach(file => checkFile(file));

log.header('Checking File Content');
Object.entries(requiredContent).forEach(([filePath, strings]) => {
  checkFileContent(filePath, strings);
});

log.header('Checking Dependencies');
checkDependencies();

log.header('Checking Firebase Configuration');
checkFirebaseConfig();

// Summary
log.header('Verification Summary');

const percentage = Math.round((passedChecks / totalChecks) * 100);
const bar = '█'.repeat(percentage / 5) + '░'.repeat(20 - percentage / 5);

console.log(`Progress: [${bar}] ${percentage}%\n`);
console.log(`${COLORS.cyan}Passed:${COLORS.reset} ${passedChecks}/${totalChecks} checks\n`);

if (passedChecks === totalChecks) {
  log.success('All checks passed! System is ready.');
  console.log('\nNext steps:');
  console.log('1. Start the admin panel: npm run dev (in src/admin)');
  console.log('2. Start the frontend: npm run dev (in root)');
  console.log('3. Log in to admin at http://localhost:5173/admin');
  console.log('4. Go to /admin/content to manage content');
  console.log('5. Follow TESTING_GUIDE.md to verify functionality\n');
  process.exit(0);
} else {
  const failedCount = totalChecks - passedChecks;
  log.warn(`${failedCount} check(s) failed. Please address the issues above.\n`);
  process.exit(1);
}
