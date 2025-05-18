'use client';

// Import necessary dependencies
import { useState, useEffect, memo } from 'react'; // React hooks for state, lifecycle, and memoization
import Link from 'next/link'; // Next.js Link for client-side navigation
import { motion } from 'framer-motion'; // Framer Motion for animations
import { Calendar, List, Filter, Plus, ArrowRight } from 'lucide-react'; // Lucide icons for UI elements
import { Button } from '@/components/ui/button'; // Custom Button component from UI library
import TaskCard from './TaskCard'; // Custom TaskCard component for task display

// Hero component for the main landing section
function Hero() {
  // State to handle client-side rendering and prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Effect to set mounted state after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a loading placeholder during server-side rendering
  if (!mounted) return <div className="h-[600px] bg-gray-100 dark:bg-gray-800 animate-pulse" />;

  // Sample task data for dashboard preview
  const tasks = [
    { title: 'Design System Updates', priority: 'High', progress: 75 },
    { title: 'Client Presentation', priority: 'Medium', progress: 40 },
    { title: 'Research Competitors', priority: 'Low', progress: 90 },
  ];

  return (
    // Hero section with background effects and responsive padding
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      {/* Background blur effects for visual depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Flex layout for text and dashboard preview */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          {/* Left side: Promotional text and CTAs */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }} // Initial animation state
            animate={{ opacity: 1, y: 0 }} // Final animation state
            transition={{ duration: 0.6 }} // Animation duration
          >
            {/* Badge with animation */}
            <motion.div
              className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Reimagine Productivity
            </motion.div>
            {/* Main heading with gradient text */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Orchestrate Your Tasks <br className="hidden md:block" />
              <span className="text-blue-600 dark:text-blue-400">Master Your Time</span>
            </motion.h1>
            {/* Description text */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Transform how you work with our intuitive platform. Organize tasks, schedule with precision, and achieve your goals with powerful tools designed for modern productivity.
            </motion.p>
            {/* Call-to-action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* Primary button linking to calendar */}
              <Button variant="gradient" size="lg" className="group shadow-lg" asChild>
                <Link href="/calendar">
                  Try Calendar{' '}
                  <Calendar
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </Link>
              </Button>
              {/* Secondary button linking to task list */}
              <Button variant="outline" size="lg" asChild>
                <Link href="/list">
                  View Tasks <List className="ml-2" size={20} />
                </Link>
              </Button>
            </motion.div>
            {/* User stats with avatar placeholders */}
            <motion.div
              className="mt-8 text-sm text-muted-foreground flex items-center justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex -space-x-2 mr-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
                  />
                ))}
              </div>
              <span>
                Join <span className="font-medium text-foreground">10,000+</span> users already
                managing their tasks
              </span>
            </motion.div>
          </motion.div>

          {/* Right side: Task dashboard preview */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }} // Initial animation state
            animate={{ opacity: 1, scale: 1 }} // Final animation state
            transition={{ delay: 0.3, duration: 0.7 }} // Animation duration
          >
            <div className="relative">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-20 -m-4" />
              {/* Dashboard card */}
              <div className="relative bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
                {/* Dashboard header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Task Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Weekly Overview</p>
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Filter size={16} />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
                {/* Task list */}
                <div className="space-y-3">
                  {tasks.map((task, i) => (
                    <TaskCard key={i} task={task} delay={i * 0.1} />
                  ))}
                </div>
                {/* Progress summary and view all button */}
                <div className="mt-8 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <div className="font-medium text-base">68% Completed</div>
                  </div>
                  <Button variant="default" size="sm" className="gap-1">
                    View All <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Export the component with memoization to prevent unnecessary re-renders
export default memo(Hero);