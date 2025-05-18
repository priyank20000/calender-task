'use client';

// Import necessary dependencies
import { memo, useRef } from 'react'; // React hooks for memoization and ref management
import { motion, useInView } from 'framer-motion'; // Framer Motion for animations and visibility detection
import { CheckCircle, Filter, Download } from 'lucide-react'; // Lucide icons for feature visuals

// Define reasons data with icons, titles, and descriptions
const reasons = [
  {
    icon: <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />, // CheckCircle icon for visual
    title: 'Boost Productivity',
    description: 'Streamline your workflow with intuitive tools designed to keep you focused and efficient.',
  },
  {
    icon: <Filter className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />, // Filter icon for visual
    title: 'Customizable',
    description: 'Personalize tasks with colors, categories, and priorities to match your unique needs.',
  },
  {
    icon: <Download className="h-8 w-8 text-purple-600 dark:text-purple-400" />, // Download icon for visual
    title: 'Seamless Integration',
    description: 'Export tasks and integrate with your existing tools for a cohesive experience.',
  },
];

// WhyChooseUs component to highlight key benefits of the product
function WhyChooseUs() {
  // Ref to track section visibility
  const ref = useRef(null);
  // Use Framer Motion's useInView to detect when the section is in view
  const isInView = useInView(ref, { once: true, amount: 0.2 }); // Trigger once when 20% of the section is visible

  return (
    // Section with gradient background
    <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/10">
      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout for text and mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side: App mockup with animation */}
          <motion.div
            ref={ref} // Attach ref for visibility detection
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }} // Initial animation state
            animate={isInView ? { opacity: 1, x: 0 } : {}} // Animate when in view
            transition={{ duration: 0.6 }} // Animation duration
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-20 scale-105" />
            {/* Mockup container */}
            <div className="relative shadow-2xl rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800 p-1">
                {/* Window bar with traffic lights */}
                <div className="rounded-t-lg bg-gray-100 dark:bg-gray-900 p-2 flex items-center">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" /> {/* Red traffic light */}
                    <div className="w-3 h-3 rounded-full bg-yellow-500" /> {/* Yellow traffic light */}
                    <div className="w-3 h-3 rounded-full bg-green-500" /> {/* Green traffic light */}
                  </div>
                  <div className="mx-auto bg-white dark:bg-gray-700 rounded-full text-xs px-4 py-0.5 text-gray-500 dark:text-gray-300">
                    taskmaster.app {/* Mockup URL */}
                  </div>
                </div>
                {/* Mockup content with sidebar and task cards */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-900">
                  {/* Sidebar mockup */}
                  <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <div className="w-full h-6 bg-blue-100 dark:bg-blue-900/30 rounded-md mb-3" /> {/* Header placeholder */}
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-md mb-2"
                        style={{ opacity: 1 - i * 0.15 }} // Fading effect for items
                      />
                    ))}
                  </div>
                  {/* Task card mockup */}
                  <div className="col-span-9 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between">
                        <div className="w-1/3 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-md" /> {/* Title placeholder */}
                        <div className="w-1/4 h-6 bg-gray-100 dark:bg-gray-700 rounded-md" /> {/* Filter placeholder */}
                      </div>
                    </div>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="w-2/3 h-5 bg-gray-100 dark:bg-gray-700 rounded-md" /> {/* Task title placeholder */}
                          <div className="w-1/6 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-md" /> {/* Priority placeholder */}
                        </div>
                        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${85 - i * 25}%` }} // Dynamic progress bar width
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side: Text content */}
          <div className="order-1 lg:order-2">
            <div className="max-w-xl">
              {/* Section header */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Why Choose TaskMaster?
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                A complete productivity ecosystem designed around how you work.
              </p>
              {/* Reasons list with animations */}
              <div className="space-y-8">
                {reasons.map((reason, index) => (
                  <motion.div
                    key={reason.title} // Unique key for React rendering
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }} // Initial animation state
                    animate={isInView ? { opacity: 1, x: 0 } : {}} // Animate when in view
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }} // Staggered animation
                  >
                    {/* Icon container */}
                    <div className="bg-blue-100/80 dark:bg-blue-900/30 rounded-xl p-3 flex-shrink-0">
                      {reason.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{reason.title}</h3>
                      <p className="text-muted-foreground">{reason.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Trusted companies section */}
              <motion.div
                className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0 }} // Initial animation state
                animate={isInView ? { opacity: 1 } : {}} // Animate when in view
                transition={{ duration: 0.6, delay: 0.7 }} // Delayed animation
              >
                <div className="flex items-center">
                  <p className="text-lg font-medium text-foreground mr-2">Trusted by</p>
                  <div className="flex space-x-4">
                    {['Acme Co.', 'Globex', 'Stark Inc.'].map((company) => (
                      <span
                        key={company}
                        className="text-lg font-semibold text-gray-400 dark:text-gray-500"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Export the component with memoization to prevent unnecessary re-renders
export default memo(WhyChooseUs);