'use client';

// Import necessary dependencies
import { memo, useRef, useState } from 'react'; // React hooks for memoization, ref, and state management
import { motion, useInView, AnimatePresence } from 'framer-motion'; // Framer Motion for animations and visibility detection
import { Star, ArrowLeft, ArrowRight } from 'lucide-react'; // Lucide icons for ratings and navigation
import { Button } from '@/components/ui/button'; // Custom Button component from UI library
import { Card, CardContent } from '@/components/ui/card'; // UI components for card layout

// Define testimonial data
const testimonials = [
  {
    quote: 'TaskMaster transformed how I manage my projects. The calendar is a game-changer!',
    author: 'Sarah Johnson',
    role: 'Project Manager',
    rating: 5,
  },
  {
    quote: 'The task list’s filters and export features save me hours every week.',
    author: 'Michael Taylor',
    role: 'Freelance Designer',
    rating: 5,
  },
  {
    quote: 'Beautiful design and super easy to use. I love the dark mode!',
    author: 'Emily Rodriguez',
    role: 'Marketing Specialist',
    rating: 5,
  },
  {
    quote: 'As a student, TaskMaster perfectly organizes my assignments and exams.',
    author: 'David Chen',
    role: 'CS Student',
    rating: 5,
  },
];

// Number of testimonials to display per page
const ITEMS_PER_PAGE = 4;

// Testimonials component for showcasing user feedback
function Testimonials() {
  // Ref to track section visibility
  const ref = useRef(null);
  // Use Framer Motion's useInView to detect when the section is in view
  const isInView = useInView(ref, { once: true, amount: 0.2 }); // Trigger once when 20% of the section is visible
  // State to manage the current page of testimonials
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate total pages and slice visible testimonials
  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const visibleTestimonials = testimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handler for navigating to the previous page
  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1)); // Loop to last page if at start
  };

  // Handler for navigating to the next page
  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1)); // Loop to first page if at end
  };

  return (
    // Section with light/dark mode background
    <section className="py-20 bg-white dark:bg-gray-800/40">
      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by Thousands
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from the people who use TaskMaster every day
          </p>
        </div>

        {/* Testimonial carousel with animation */}
        <motion.div
          ref={ref} // Attach ref for visibility detection
          className="relative"
          role="region" // ARIA role for accessibility
          aria-label="Testimonials carousel"
          initial={{ opacity: 0 }} // Initial animation state
          animate={isInView ? { opacity: 1 } : {}} // Animate when in view
          transition={{ duration: 0.6 }} // Animation duration
        >
          {/* Previous page button (hidden on mobile) */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-[-2rem] top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full shadow-sm h-12 w-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            onClick={handlePrev}
            aria-label="Previous testimonial page"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </Button>
          {/* Next page button (hidden on mobile) */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-[-2rem] top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full shadow-sm h-12 w-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            onClick={handleNext}
            aria-label="Next testimonial page"
          >
            <ArrowRight size={24} className="text-gray-700 dark:text-gray-300" />
          </Button>

          {/* Animated testimonial grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage} // Unique key to trigger animation on page change
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" // Responsive grid layout
              initial={{ opacity: 0, x: 50 }} // Initial animation state
              animate={{ opacity: 1, x: 0 }} // Final animation state
              exit={{ opacity: 0, x: -50 }} // Exit animation state
              transition={{ duration: 0.3 }} // Animation duration
            >
              {visibleTestimonials.map((testimonial) => (
                // Individual testimonial card
                <Card
                  key={testimonial.author} // Unique key for React rendering
                  className="border-0 shadow-lg min-h-[300px] flex flex-col" // Fixed height for consistency
                >
                  <CardContent className="p-6 flex flex-col flex-grow">
                    {/* Star rating */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    {/* Testimonial quote */}
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic flex-grow">
                      "{testimonial.quote}"
                    </p>
                    {/* Author details with avatar */}
                    <div className="flex items-center mt-auto">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                          {testimonial.author.charAt(0)} {/* Initial letter avatar */}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentPage ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`} // Highlight current page
                onClick={() => setCurrentPage(i)}
                aria-label={`Go to testimonial page ${i + 1}`}
                aria-current={i === currentPage} // Accessibility for screen readers
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Export the component with memoization to prevent unnecessary re-renders
export default memo(Testimonials);