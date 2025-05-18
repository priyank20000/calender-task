'use client';

import { Suspense, lazy } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import NavBar from './Home-page-com/NavBar';
import Hero from './Home-page-com/Hero';
import Features from './Home-page-com/Features';
import WhyChooseUs from './Home-page-com/WhyChooseUs';
import { Toaster } from 'sonner';

// Lazy-load non-critical sections
const Testimonials = lazy(() => import('./Home-page-com/Testimonials'));
const CallToAction = lazy(() => import('./Home-page-com/CallToAction'));
const Footer = lazy(() => import('./Home-page-com/Footer'));

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 transition-colors duration-500">
        <NavBar />
        <main>
          <Hero />
          <Features />
          <WhyChooseUs />
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
            <Testimonials />
            <CallToAction />
            <Footer />
          </Suspense>
        </main>
        <Toaster position="top-right" />
      </div>
    </ThemeProvider>
  );
}