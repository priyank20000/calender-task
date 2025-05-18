'use client';

// Import necessary libraries and hooks
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Sun,
  Moon,
  ArrowUp,
  ArrowDown,
  Table,
  LayoutGrid,
  Trash2,
} from 'lucide-react';

/**
 * ----------- UI COMPONENTS -----------
 * These are lightweight, shadcn/ui-inspired components
 * Button, Input, Select, SelectItem, Badge, Checkbox, Label, Card, CardHeader, CardTitle, CardContent
 */

// Button component with variants and sizes
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  // Define different visual variants and sizes for the Button
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
    ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1.5 text-sm',
    icon: 'p-2',
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input component for forms
const Input = ({ className = '', ...props }) => (
  <input
    className={`border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-colors duration-300 ${className}`}
    {...props}
  />
);

// Select (dropdown) component with keyboard navigation and animation
const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Handle option selection
  const handleSelect = (val) => {
    onValueChange(val);
    setOpen(false);
    setFocusedIndex(-1);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation for dropdown
  const handleKeyDown = (e) => {
    const itemsCount = React.Children.count(children);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setFocusedIndex((prev) => (prev + 1) % itemsCount);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setFocusedIndex((prev) => (prev - 1 + itemsCount) % itemsCount);
    } else if (e.key === 'Enter' && open && focusedIndex >= 0) {
      e.preventDefault();
      const childArray = React.Children.toArray(children);
      const selectedValue = childArray[focusedIndex].props.value;
      handleSelect(selectedValue);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div className="relative" ref={selectRef}>
      {/* Main button to open dropdown */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full text-left bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Select...'}
      </button>
      {/* Dropdown menu with animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {React.Children.map(children, (child, index) =>
              React.cloneElement(child, {
                onSelect: handleSelect,
                isFocused: focusedIndex === index,
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Individual item in Select dropdown
const SelectItem = ({ value, children, onSelect, isFocused }) => (
  <div
    className={`px-3 py-2 cursor-pointer transition-colors duration-200 ${
      isFocused
        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
    onClick={() => onSelect(value)}
    tabIndex={-1}
  >
    {children}
  </div>
);

// Badge component for displaying tags/labels
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Checkbox input component
const Checkbox = ({ checked, onCheckedChange, id }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
  />
);

// Label for form inputs
const Label = ({ children, htmlFor, className = '' }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium text-gray-700 dark:text-gray-200 ${className}`}
  >
    {children}
  </label>
);

// Card UI component for grouping content
const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm ${className}`}
  >
    {children}
  </div>
);

// Card header area
const CardHeader = ({ children, className = '' }) => (
  <div
    className={`p-4 border-b border-gray-200 dark:border-gray-600 ${className}`}
  >
    {children}
  </div>
);

// Card title
const CardTitle = ({ children, className = '' }) => (
  <h2
    className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}
  >
    {children}
  </h2>
);

// Card content area
const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

/**
 * ----------- TASK DATA CONFIGURATION -----------
 * Priority, categories, and status configuration for tasks
 */
const priorityLevels = [
  { label: 'High', value: 'high', color: 'bg-red-500 text-white' },
  { label: 'Medium', value: 'medium', color: 'bg-yellow-500 text-black' },
  { label: 'Low', value: 'low', color: 'bg-blue-500 text-white' },
];

const predefinedCategories = [
  { id: 'work', name: 'Work', color: 'bg-blue-500' },
  { id: 'personal', name: 'Personal', color: 'bg-green-500' },
  { id: 'important', name: 'Important', color: 'bg-red-500' },
  { id: 'meeting', name: 'Meeting', color: 'bg-purple-500' },
  { id: 'deadline', name: 'Deadline', color: 'bg-yellow-500' },
];

const taskStatuses = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
];

/**
 * ----------- MAIN TASKS PAGE -----------
 * This component shows all calendar tasks, allows filtering, sorting, bulk actions, export, and view modes.
 */
export default function TasksPage() {
  // ------------------- STATE HOOKS -------------------
  const [tasks, setTasks] = useState([]); // All tasks loaded from storage
  const [searchQuery, setSearchQuery] = useState(''); // Search box input
  const [filterCategories, setFilterCategories] = useState([]); // Array of selected category IDs for filtering
  const [filterPriority, setFilterPriority] = useState(''); // Selected priority for filtering
  const [filterStatus, setFilterStatus] = useState(''); // Selected status for filtering
  const [sortBy, setSortBy] = useState('title'); // Current sorting key
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order: asc or desc
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  const [tasksPerPage] = useState(10); // Number of tasks per page
  const [viewMode, setViewMode] = useState('table'); // "table" or "card" view
  const [selectedTasks, setSelectedTasks] = useState([]); // Array of selected task IDs for bulk actions
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode toggle
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [feedbackMessage, setFeedbackMessage] = useState(''); // Feedback message for user actions
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false); // Show/hide feedback

  // Debounced search query for performance
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    // Debounce search query updates (300ms)
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Show feedback message for a short time
  const showFeedback = (message) => {
    setFeedbackMessage(message);
    setShowFeedbackMessage(true);
  };

  // --------- LOAD TASKS FROM LOCAL STORAGE ON MOUNT ---------
  useEffect(() => {
    try {
      const savedCalendarTasks = localStorage.getItem('calendarTasks');
      if (savedCalendarTasks) {
        const calendarTasks = JSON.parse(savedCalendarTasks);
        // Flatten all date keys into a single task array and add fallback/default values
        const allTasks = Object.keys(calendarTasks)
          .flatMap((dateKey) =>
            calendarTasks[dateKey].map((task) => ({
              ...task,
              status: task.status || 'todo',
              description: task.description || '',
              notes: task.notes || '',
              attachments: task.attachments || [],
              id: task.id || `task-${Date.now()}-${Math.random()}`, // fallback ID
              title: task.title || 'Untitled Task', // fallback title
            }))
          )
          // Remove duplicates by task ID
          .reduce((unique, task) => {
            return unique.some((t) => t.id === task.id)
              ? unique
              : [...unique, task];
          }, []);
        setTasks(allTasks);
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      setTasks([]);
      showFeedback('Failed to load tasks. Starting fresh.');
    } finally {
      setIsLoading(false);
    }

    // Set dark mode if system prefers dark
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // --------- SAVE TASKS TO LOCAL STORAGE WHENEVER THEY CHANGE ---------
  useEffect(() => {
    try {
      // Re-group tasks by date for storage (assume May 2025)
      const calendarTasks = tasks.reduce((acc, task) => {
        const dateKey = `2025-4-${task.startDay}`; // month index is 0-based, so 4 = May
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(task);
        return acc;
      }, {});
      localStorage.setItem('calendarTasks', JSON.stringify(calendarTasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
      showFeedback('Failed to save tasks.');
    }
  }, [tasks]);

  // --------- TOGGLE DARK MODE CLASS ON ROOT ---------
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // --------- FILTER AND SORT TASKS WITH MEMOIZATION ---------
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search by title or description (debounced)
        if (
          debouncedSearchQuery &&
          !task.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) &&
          !task.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ) {
          return false;
        }
        // Filter by selected categories
        if (
          filterCategories.length > 0 &&
          !task.categories.some((cat) => filterCategories.includes(cat))
        ) {
          return false;
        }
        // Filter by priority
        if (filterPriority && task.priority !== filterPriority) {
          return false;
        }
        // Filter by status
        if (filterStatus && task.status !== filterStatus) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Apply sorting according to sortBy and sortOrder
        const order = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'title') {
          return order * a.title.localeCompare(b.title);
        } else if (sortBy === 'priority') {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return order * (priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else if (sortBy === 'startDay') {
          return order * (a.startDay - b.startDay);
        } else if (sortBy === 'endDay') {
          return order * ((a.endDay || a.startDay) - (b.endDay || b.startDay));
        }
        return 0;
      });
  }, [tasks, debouncedSearchQuery, filterCategories, filterPriority, filterStatus, sortBy, sortOrder]);

  // --------- PAGINATION LOGIC ---------
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // --------- FILTER HANDLERS ---------
  // Toggle a category in the filter
  const toggleCategoryFilter = (categoryId) => {
    setFilterCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Toggle selection of a task for bulk actions
  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // --------- BULK DELETE SELECTED TASKS ---------
  const deleteSelectedTasks = () => {
    setTasks((prev) => prev.filter((task) => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
    showFeedback(`Deleted ${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''}`);
  };

  // --------- EXPORT TASKS TO CSV ---------
  const exportToCSV = () => {
    const headers = [
      'Title',
      'Priority',
      'Categories',
      'Start Day',
      'End Day',
      'Status',
      'Description',
    ];
    const rows = filteredTasks.map((task) => [
      `"${task.title}"`,
      task.priority,
      task.categories.join(', '),
      task.startDay,
      task.endDay || task.startDay,
      task.status,
      `"${task.description}"`,
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tasks-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`;
    link.click();
    showFeedback('Tasks exported to CSV');
  };

  // --------- TASK CARD COMPONENT (for card view) ---------
  const TaskCard = ({ task }) => {
    const priorityInfo =
      priorityLevels.find((p) => p.value === task.priority) || priorityLevels[1];
    return (
      <Card className={`p-4 ${task.color} mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              id={`task-${task.id}`}
              checked={selectedTasks.includes(task.id)}
              onCheckedChange={() => toggleTaskSelection(task.id)}
              className="mr-2"
            />
            <h3 className="font-semibold">{task.title}</h3>
          </div>
          <Badge className={priorityInfo.color}>{priorityInfo.label}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {task.categories.map((catId) => {
            const category = predefinedCategories.find((c) => c.id === catId);
            return (
              category && (
                <Badge key={catId} className={`${category.color} bg-opacity-20`}>
                  {category.name}
                </Badge>
              )
            );
          })}
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <p>Start: May {task.startDay}, 2025</p>
          <p>End: May {task.endDay || task.startDay}, 2025</p>
          <p>Status: {taskStatuses.find((s) => s.value === task.status)?.label}</p>
        </div>
      </Card>
    );
  };

  // --------- LOADING STATE ---------
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">Loading tasks...</div>
      </div>
    );
  }

  // --------- MAIN RENDER ---------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
      <Card className="max-w-7xl mx-auto">
        {/* Header: title, dark mode toggle, export button */}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Tasks</CardTitle>
          <div className="flex items-center space-x-3">
            {/* Dark mode toggle */}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            {/* Export to CSV */}
            <Button onClick={exportToCSV} className="h-10">
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ---- FEEDBACK MESSAGE ---- */}
          <AnimatePresence>
            {showFeedbackMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 right-4 z-50 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-2 rounded-md shadow-md"
                onAnimationComplete={() => setTimeout(() => setShowFeedbackMessage(false), 1500)}
              >
                {feedbackMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---- FILTERS AND SEARCH ---- */}
          <div className="flex flex-col md:flex-row gap-3 items-center">
            {/* Search bar */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="pl-10 h-10 rounded-md shadow-sm"
                />
              </div>
            </div>
            {/* Priority filter */}
            <div className="w-48">
              <Select
                value={filterPriority}
                onValueChange={(val) => setFilterPriority(val === 'all' ? '' : val)}
              >
                <SelectItem value="all">All Priorities</SelectItem>
                {priorityLevels.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 mr-2 rounded ${priority.color}`} />
                      {priority.label}
                    </div>
                  </SelectItem>
                ))}
              </Select>
            </div>
            {/* Status filter */}
            <div className="w-48">
              <Select
                value={filterStatus}
                onValueChange={(val) => setFilterStatus(val === 'all' ? '' : val)}
              >
                <SelectItem value="all">All Statuses</SelectItem>
                {taskStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            {/* Clear filters button */}
            <Button
              variant="outline"
              className="h-10 w-32 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => {
                setSearchQuery('');
                setFilterCategories([]);
                setFilterPriority('');
                setFilterStatus('');
                showFeedback('Filters cleared');
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* ---- CATEGORY FILTER CHECKBOXES ---- */}
          <div className="flex flex-wrap gap-4">
            {predefinedCategories.map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  id={`filter-${category.id}`}
                  checked={filterCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategoryFilter(category.id)}
                />
                <Label
                  htmlFor={`filter-${category.id}`}
                  className="ml-2 flex items-center"
                >
                  <div className={`w-3 h-3 rounded-full ${category.color} mr-1`} />
                  {category.name}
                </Label>
              </div>
            ))}
          </div>

          {/* ---- SORT AND VIEW OPTIONS ---- */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Sort by dropdown */}
              <div className="w-40">
                <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="startDay">Start Date</SelectItem>
                  <SelectItem value="endDay">End Date</SelectItem>
                </Select>
              </div>
              {/* Sort order toggle */}
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? (
                  <ArrowUp size={16} />
                ) : (
                  <ArrowDown size={16} />
                )}
              </Button>
            </div>
            {/* View mode toggle (table or card) */}
            <div className="flex items-center space-x-3">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="icon"
                className="h-10 w-10 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => setViewMode('table')}
              >
                <Table size={16} />
              </Button>
              <Button
                variant={viewMode === 'card' ? 'default' : 'outline'}
                size="icon"
                className="h-10 w-10 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => setViewMode('card')}
              >
                <LayoutGrid size={16} />
              </Button>
            </div>
          </div>

          {/* ---- BULK ACTIONS ---- */}
          <AnimatePresence>
            {selectedTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="destructive" onClick={deleteSelectedTasks}>
                  <Trash2 size={16} className="mr-2" />
                  Delete {selectedTasks.length} Task
                  {selectedTasks.length > 1 ? 's' : ''}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---- TASK LIST (TABLE OR CARD VIEW) ---- */}
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-600">
                    <th className="p-2">
                      {/* Select all checkbox */}
                      <Checkbox
                        checked={
                          selectedTasks.length === currentTasks.length &&
                          currentTasks.length > 0
                        }
                        onCheckedChange={(checked) => {
                          setSelectedTasks(
                            checked ? currentTasks.map((t) => t.id) : []
                          );
                        }}
                      />
                    </th>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Priority</th>
                    <th className="p-2 text-left">Categories</th>
                    <th className="p-2 text-left">Start</th>
                    <th className="p-2 text-left">End</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.map((task) => {
                    const priorityInfo =
                      priorityLevels.find((p) => p.value === task.priority) ||
                      priorityLevels[1];
                    return (
                      <tr
                        key={task.id}
                        className={`border-b dark:border-gray-600 ${task.color}`}
                      >
                        <td className="p-2">
                          <Checkbox
                            id={`task-${task.id}`}
                            checked={selectedTasks.includes(task.id)}
                            onCheckedChange={() => toggleTaskSelection(task.id)}
                          />
                        </td>
                        <td className="p-2">{task.title}</td>
                        <td className="p-2">
                          <Badge className={priorityInfo.color}>
                            {priorityInfo.label}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-1">
                            {task.categories.map((catId) => {
                              const category = predefinedCategories.find(
                                (c) => c.id === catId
                              );
                              return (
                                category && (
                                  <Badge
                                    key={catId}
                                    className={`${category.color} bg-opacity-20`}
                                  >
                                    {category.name}
                                  </Badge>
                                )
                              );
                            })}
                          </div>
                        </td>
                        <td className="p-2">May {task.startDay}, 2025</td>
                        <td className="p-2">
                          May {task.endDay || task.startDay}, 2025
                        </td>
                        <td className="p-2">
                          {taskStatuses.find((s) => s.value === task.status)?.label}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // Card view: grid of TaskCard components
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}

          {/* ---- EMPTY STATE ---- */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No tasks available. Add tasks to the calendar to see them here.
            </div>
          )}

          {/* ---- PAGINATION ---- */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                className="h-10 w-24 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-200">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                className="h-10 w-24 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}