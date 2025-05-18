'use client';

// Import necessary dependencies
import { useState, useEffect, useCallback, memo } from 'react'; // React hooks for state, lifecycle, memoization, and callback optimization
import Link from 'next/link'; // Next.js Link for client-side navigation
import { Sun, Moon, Menu, X } from 'lucide-react'; // Lucide icons for theme toggle and menu
import { Button } from '@/components/ui/button'; // Custom Button component from UI library
import { useTheme } from '@/components/theme-provider'; // Custom hook for theme management
import { debounce } from 'lodash'; // Lodash debounce for scroll event optimization

// NavBar component for site navigation
function NavBar() {
  // Access theme context for light/dark mode
  const { theme, setTheme } = useTheme();
  // State to track if the navbar is scrolled
  const [scrolled, setScrolled] = useState(false);
  // State to manage mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debounced scroll handler to update scrolled state
  const handleScroll = useCallback(
    debounce(() => {
      setScrolled(window.scrollY > 10); // Set scrolled state if user scrolls past 10px
    }, 100),
    [] // Empty dependency array for stable callback
  );

  // Effect to add and clean up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // Cancel debounce to prevent memory leaks
    };
  }, [handleScroll]);

  // Navigation links data
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/list', label: 'All Tasks' },
    { href: '#features', label: 'Features' },
  ];

  return (
    // Header with sticky positioning and dynamic styling based on scroll
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-background/90 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'
      }`}
    >
      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with responsive text */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent"
          >
            <span className="hidden md:inline">TaskMaster</span>
            <span className="md:hidden">TM</span> {/* Abbreviated logo for mobile */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            {/* Theme toggle button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            {/* CTA button */}
            <Button variant="gradient" className="transition-transform hover:scale-105">
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Theme toggle button for mobile */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            {/* Mobile menu toggle button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-6 bg-background/95 backdrop-blur-md border-b shadow-md">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)} // Close menu on link click
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile CTA button */}
            <Button
              variant="gradient"
              className="w-full"
              onClick={() => setMobileMenuOpen(false)} // Close menu on click
            >
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

// Export the component with memoization to prevent unnecessary re-renders
export default memo(NavBar);