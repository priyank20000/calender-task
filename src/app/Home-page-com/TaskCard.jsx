'use client';

// Import necessary dependencies
import { motion } from 'framer-motion'; // Framer Motion for animations
import PropTypes from 'prop-types'; // PropTypes for type checking

// TaskCard component to display individual task details
function TaskCard({ task, delay = 0 }) {
  // Define color classes for different priority levels
  const priorityColors = {
    High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', // Red for high priority
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', // Amber for medium priority
    Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', // Green for low priority
  };

  // Return null if task prop is missing to prevent rendering
  if (!task) return null;

  return (
    // Animated card container with motion effects
    <motion.div
      className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 10 }} // Initial animation state
      animate={{ opacity: 1, y: 0 }} // Final animation state
      transition={{ delay: 0.5 + delay, duration: 0.3 }} // Animation delay and duration
      role="listitem" // ARIA role for accessibility
    >
      {/* Task title and priority badge */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{task.title}</h4>
        {/* Priority badge with dynamic color based on priority */}
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            priorityColors[task.priority] || priorityColors.Low // Fallback to Low priority color
          }`}
        >
          {task.priority}
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${Math.min(task.progress, 100)}%` }} // Cap progress at 100%
        />
      </div>
    </motion.div>
  );
}

// Define prop types for type checking
TaskCard.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string.isRequired, // Task title is required
    priority: PropTypes.oneOf(['High', 'Medium', 'Low']).isRequired, // Priority must be one of the specified values
    progress: PropTypes.number.isRequired, // Progress is required
  }),
  delay: PropTypes.number, // Optional delay for animation
};

// Export the component (memo not used as it's already a simple component)
export default TaskCard;