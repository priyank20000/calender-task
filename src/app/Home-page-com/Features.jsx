'use client';

// Import necessary dependencies
import { memo, useRef } from 'react'; // React hooks for memoization and ref management
import { motion, useInView } from 'framer-motion'; // Framer Motion for animations and view detection
import { Calendar, List, Search, BarChart4, Repeat, CheckCircle } from 'lucide-react'; // Lucide icons for feature visuals
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // UI components for card layout

// Define feature data with icons, titles, descriptions, and benefits
const features = [
  {
    icon: <Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400" />, // Calendar icon for visual
    title: 'Interactive Calendar',
    description:
      'Drag and drop tasks onto a dynamic calendar. Extend tasks across days, edit details, and visualize your schedule effortlessly.',
    benefits: ['Drag-and-drop scheduling', 'Multi-day task extension', 'Color-coded priorities'],
  },
  {
    icon: <List className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />, // List icon for visual
    title: 'Comprehensive Task List',
    description:
      'View all tasks in table or card format with advanced filtering, sorting, and bulk actions. Export tasks to CSV for easy sharing.',
    benefits: ['Table and card views', 'Search and filter options', 'Bulk delete and export'],
  },
  {
    icon: <Search className="h-12 w-12 text-purple-600 dark:text-purple-400" />, // Search icon for visual
    title: 'Smart Search & Filters',
    description:
      'Find tasks instantly with full-text search and filter by categories, priorities, or status to focus on what matters most.',
    benefits: ['Full-text search', 'Multi-category filtering', 'Status and priority filters'],
  },
  {
    icon: <BarChart4 className="h-12 w-12 text-teal-600 dark:text-teal-400" />, // Chart icon for visual
    title: 'Productivity Analytics',
    description:
      'Track your progress with visual charts and insights. Understand your productivity patterns and optimize your workflow.',
    benefits: ['Progress visualization', 'Completion rate tracking', 'Weekly performance reports'],
  },
  {
    icon: <Repeat className="h-12 w-12 text-amber-600 dark:text-amber-400" />, // Repeat icon for visual
    title: 'Recurring Tasks',
    description:
      'Set up repeating tasks on daily, weekly, or custom schedules. Never forget regular responsibilities again.',
    benefits: ['Flexible recurrence patterns', 'Auto-rescheduling', 'Rule-based exceptions'],
  },
  {
    icon: <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />, // CheckCircle icon for visual
    title: 'Task Templates',
    description:
      'Create reusable templates for common tasks and projects. Save time and ensure consistency across similar tasks.',
    benefits: ['Custom template library', 'Template sharing', 'Quick task generation'],
  },
];

// Features component to showcase product capabilities
function Features() {
  // Create a ref to track the section's visibility
  const ref = useRef(null);
  // Use Framer Motion's useInView to detect when the section is in view
  const isInView = useInView(ref, { once: true, amount: 0.2 }); // Trigger once when 20% of the section is visible

  return (
    // Section with gradient background and ID for navigation
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-background to-blue-50/50 dark:to-blue-950/10"
    >
      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with title and description */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Streamline Your Workflow
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover tools designed to enhance productivity and help you accomplish more
          </p>
        </div>

        {/* Grid of feature cards with animation */}
        <motion.div
          ref={ref} // Attach ref for visibility detection
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" // Responsive grid layout
          initial={{ opacity: 0, y: 20 }} // Initial animation state
          animate={isInView ? { opacity: 1, y: 0 } : {}} // Animate when in view
          transition={{ duration: 0.6 }} // Animation duration
          role="list" // ARIA role for accessibility
        >
          {features.map((feature, index) => (
            // Individual feature card with hover effect
            <Card
              key={feature.title} // Unique key for React rendering
              className="border-t-4 border-t-blue-500 dark:border-t-blue-400 hover:-translate-y-1 transition-all duration-300" // Styling and hover animation
              role="listitem" // ARIA role for accessibility
            >
              {/* Card header with icon and title */}
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              {/* Card content with description and benefits */}
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                {/* List of benefits with checkmark icons */}
                <ul className="space-y-2 text-sm">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Export the component with memoization to prevent unnecessary re-renders
export default memo(Features);