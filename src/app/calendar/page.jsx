'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, ChevronsRight, Tag, Filter, Search, Moon, Sun, Edit, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ItemTypes = {
  TASK: 'task',
  EXTEND: 'extend',
};

const taskColors = [
  { label: 'Blue', value: 'bg-blue-100 hover:bg-blue-200 border-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 dark:border-blue-700' },
  { label: 'Green', value: 'bg-green-100 hover:bg-green-200 border-green-300 dark:bg-green-900 dark:hover:bg-green-800 dark:border-green-700' },
  { label: 'Red', value: 'bg-red-100 hover:bg-red-200 border-red-300 dark:bg-red-900 dark:hover:bg-red-800 dark:border-red-700' },
  { label: 'Purple', value: 'bg-purple-100 hover:bg-purple-200 border-purple-300 dark:bg-purple-900 dark:hover:bg-purple-800 dark:border-blue-700' },
  { label: 'Yellow', value: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300 dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:border-yellow-700' },
  { label: 'Pink', value: 'bg-pink-100 hover:bg-pink-200 border-pink-300 dark:bg-pink-900 dark:hover:bg-pink-800 dark:border-pink-700' },
];

const priorityLevels = [
  { label: 'High', value: 'high', color: 'bg-red-500 text-white' },
  { label: 'Medium', value: 'medium', color: 'bg-yellow-500 text-black' },
  { label: 'Low', value: 'low', color: 'bg-blue-500 text-white' },
];

const taskStatuses = [
  { label: 'To Do', value: 'todo', color: 'bg-gray-500 text-white' },
  { label: 'In Progress', value: 'in_progress', color: 'bg-orange-500 text-white' },
  { label: 'Done', value: 'done', color: 'bg-green-500 text-white' },
];

const predefinedCategories = [
  { id: 'work', name: 'Work', color: 'bg-blue-500' },
  { id: 'personal', name: 'Personal', color: 'bg-green-500' },
  { id: 'important', name: 'Important', color: 'bg-red-500' },
  { id: 'meeting', name: 'RouseMeeting', color: 'bg-purple-500' },
  { id: 'deadline', name: 'Deadline', color: 'bg-yellow-500' },
];

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Memoized Task Component
const Task = memo(({ id, title, color, onDelete, categories = [], priority, status }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id, title, color, categories, priority, status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const priorityInfo = priorityLevels.find(p => p.value === priority) || priorityLevels[1];
  const statusInfo = taskStatuses.find(s => s.value === status) || taskStatuses[0];

  return (
    <div
      ref={drag}
      className={cn(
        `relative group p-3 mb-3 rounded-md border cursor-move transition-all`,
        color || 'bg-blue-100 hover:bg-blue-200 border-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 dark:border-blue-700',
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      )}
    >
      <div className="flex items-center justify-between pr-6">
        <div className="truncate">{title}</div>
        <div className="flex items-center gap-1">
          <Badge className={`text-xs ${priorityInfo.color}`}>
            {priorityInfo.label}
          </Badge>
          <Badge className={`text-xs ${statusInfo.color}`}>
            {statusInfo.label}
          </Badge>
        </div>
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {categories.map((catId) => {
            const category = predefinedCategories.find(c => c.id === catId);
            return category && (
              <Badge key={catId} variant="secondary" className={`text-xs ${category.color} bg-opacity-20 dark:bg-opacity-30 text-gray-800 dark:text-gray-200`}>
                {category.name}
              </Badge>
            );
          })}
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 h-6 w-6 transition-opacity"
        onClick={() => onDelete(id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
});

// Memoized ExtendIcon Component
const ExtendIcon = memo(({ task, day, onExtendTask, currentDate, startingDay, isEndDay }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EXTEND,
    item: { task, startDay: task.startDay, isModifying: isEndDay },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={drag}
            className={cn(
              `absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center`,
              `bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-600 shadow-sm`,
              `cursor-grab transition-all`,
              isDragging ? 'scale-110 opacity-75 cursor-grabbing' : 'scale-100',
              `group-hover:opacity-100 opacity-0 hover:bg-white dark:hover:bg-gray-700`
            )}
          >
            <ChevronsRight className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={5}>
          <p className="text-xs">{isEndDay ? "Drag to change end date" : "Drag to extend task"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

// Memoized TaskDetailModal Component
const TaskDetailModal = memo(({ task, isOpen, onClose, onSave, onDelete, currentDate }) => {
  const [editedTask, setEditedTask] = useState({
    ...task,
    description: task.description || '',
    notes: task.notes || '',
    attachments: task.attachments || [],
    categories: task.categories || [],
    color: task.color || taskColors[0].value,
    priority: task.priority || 'medium',
    status: task.status || 'todo',
  });

  const handleInputChange = (field, value) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (categoryId) => {
    setEditedTask((prev) => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories };
    });
  };

  const handleAttachmentAdd = (e) => {
    const files = Array.from(e.target.files).map((file) => file.name);
    setEditedTask((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const handleAttachmentRemove = (attachment) => {
    setEditedTask((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att !== attachment),
    }));
  };

  const handleSave = () => {
    if (!editedTask.title.trim()) {
      alert('Task title cannot be empty');
      return;
    }
    onSave(editedTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">Edit Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right dark:text-gray-200">Title</Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="col-span-3 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right dark:text-gray-200">Priority</Label>
            <Select
              value={editedTask.priority}
              onValueChange={(value) => handleInputChange('priority', value)}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityLevels.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 mr-2 rounded ${priority.color}`}></div>
                      {priority.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right dark:text-gray-200">Status</Label>
            <Select
              value={editedTask.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {taskStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 mr-2 rounded ${status.color}`}></div>
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right dark:text-gray-200">Description</Label>
            <Textarea
              id="description"
              value={editedTask.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="col-span-3 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              placeholder="Add a description..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right dark:text-gray-200">Notes</Label>
            <Textarea
              id="notes"
              value={editedTask.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="col-span-3 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              placeholder="Add notes..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right dark:text-gray-200">Color</Label>
            <Select
              value={editedTask.color}
              onValueChange={(value) => handleInputChange('color', value)}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {taskColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 mr-2 rounded ${color.value.split(' ')[0]}`}></div>
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right dark:text-gray-200">Categories</Label>
            <div className="col-span-3 space-y-2">
              {predefinedCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={editedTask.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex items-center cursor-pointer dark:text-gray-200"
                  >
                    <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right dark:text-gray-200">Attachments</Label>
            <div className="col-span-3 space-y-2">
              <Input
                type="file"
                multiple
                onChange={handleAttachmentAdd}
                className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
              {editedTask.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {editedTask.attachments.map((attachment, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {attachment}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => handleAttachmentRemove(attachment)}
                      >
                        <span className="sr-only">Remove</span>
                        <span>×</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(task.id, task.startDay);
              onClose();
            }}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

// Memoized TaskModal Component
const TaskModal = memo(({ isOpen, onClose, onAddTask, onExtendTask, day, currentDate, tasks }) => {
  const [taskInput, setTaskInput] = useState('');
  const [selectedColor, setSelectedColor] = useState(taskColors[0].value);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedStatus, setSelectedStatus] = useState('todo');
  const [extendTaskId, setExtendTaskId] = useState('');
  const [extendEndDay, setExtendEndDay] = useState(day);

  const dayTasks = useMemo(() => tasks.filter((task) => {
    const taskEndDay = task.endDay || task.startDay;
    return day >= task.startDay && day <= taskEndDay;
  }), [tasks, day]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) {
      alert('Task title cannot be empty');
      return;
    }
    if (taskInput.length > 100) {
      alert('Task title cannot exceed 100 characters');
      return;
    }
    const newTask = {
      id: uuidv4(),
      title: taskInput,
      color: selectedColor,
      categories: selectedCategories,
      description: '',
      notes: '',
      attachments: [],
      priority: selectedPriority,
      status: selectedStatus,
      startDay: day,
    };
    onAddTask(newTask);
    setTaskInput('');
    setSelectedColor(taskColors[0].value);
    setSelectedCategories([]);
    setSelectedPriority('medium');
    setSelectedStatus('todo');
    onClose();
  };

  const handleExtendTask = (e) => {
    e.preventDefault();
    if (!extendTaskId) {
      alert('Please select a task to extend');
      return;
    }
    if (extendEndDay < day) {
      alert('End day cannot be before the start day');
      return;
    }
    const task = dayTasks.find(t => t.id === extendTaskId);
    if (task) {
      onExtendTask(task, task.startDay, new Date(currentDate.getFullYear(), currentDate.getMonth(), extendEndDay), true);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">Manage Task for Day {day}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <h3 className="font-medium dark:text-gray-200">Add New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-3">
              <Input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Task title"
                className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {taskColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded ${color.value.split(' ')[0]}`}></div>
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded ${priority.color}`}></div>
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {taskStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded ${status.color}`}></div>
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      {selectedCategories.length === 0 ? 'Add categories' : `${selectedCategories.length} categories`}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 dark:bg-gray-800 dark:border-gray-700">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm dark:text-gray-200">Select Categories</h4>
                    <Separator />
                    <div className="space-y-2">
                      {predefinedCategories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => {
                              setSelectedCategories(prev =>
                                prev.includes(category.id)
                                  ? prev.filter(id => id !== category.id)
                                  : [...prev, category.id]
                              );
                            }}
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="flex items-center cursor-pointer dark:text-gray-200"
                          >
                            <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button type="submit" className="w-full dark:bg-blue-600 dark:hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </form>
          </div>
          {dayTasks.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Extend Existing Task</h3>
              <form onSubmit={handleExtendTask} className="space-y-3">
                <Select value={extendTaskId} onValueChange={setExtendTaskId}>
                  <SelectTrigger className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Select task to extend" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={day}
                  max={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}
                  value={extendEndDay}
                  onChange={(e) => setExtendEndDay(Number(e.target.value))}
                  placeholder="End day"
                  className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
                <Button type="submit" className="w-full dark:bg-blue-600 dark:hover:bg-blue-700">
                  Extend Task
                </Button>
              </form>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

// Memoized CalendarDay Component
const CalendarDay = memo(({ day, isToday, tasks, onDropTask, onExtendTask, currentDate, startingDay, onEditTask, onDeleteTask, onClick, isMobile }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.TASK, ItemTypes.EXTEND],
    drop: (item, monitor) => {
      if (monitor.getItemType() === ItemTypes.TASK) {
        onDropTask(item, day);
      } else if (monitor.getItemType() === ItemTypes.EXTEND) {
        const { task, startDay, isModifying } = item;
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        onExtendTask(task, startDay, endDate, isModifying);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [hoveredTask, setHoveredTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const dayTasks = useMemo(() => tasks.filter((task) => {
    const taskEndDay = task.endDay || task.startDay;
    return day >= task.startDay && day <= taskEndDay;
  }), [tasks, day]);

  const dayIndex = startingDay + day - 1;
  const row = Math.floor(dayIndex / 7);

  return (
    <div
      ref={isMobile ? null : drop}
      onClick={() => isMobile && onClick(day)}
      className={cn(
        "relative flex flex-col items-center h-full min-h-24 p-1 border transition-colors duration-300",
        isToday ? "bg-blue-50 border-blue-300 dark:bg-blue-900 dark:border-blue-700" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
        isOver && !isMobile && "bg-blue-100 dark:bg-blue-900",
        day === 1 && `col-start-${startingDay + 1}`,
        isMobile && "cursor-pointer"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 mb-1 rounded-full text-sm font-medium transition-colors duration-300",
          isToday && "bg-blue-500 text-white dark:bg-blue-600"
        )}
      >
        {day}
      </div>
      <ScrollArea className="w-full h-[calc(100%-2.5rem)] scrollarea-shadow">
        <div className="space-y-0.5 p-0.5">
          {dayTasks.map((task, index) => {
            const taskEndDay = task.endDay || task.startDay;
            const rowStartDay = row * 7 - startingDay + 1;
            const rowEndDay = Math.min(rowStartDay + 6, currentDate.getDate());
            const displayStartDay = Math.max(task.startDay, rowStartDay);
            const displayEndDay = Math.min(taskEndDay, rowEndDay);

            const isFirstDay = day === task.startDay;
            const isLastDay = day === taskEndDay;
            const showExtendButton = isLastDay && !isMobile;

            const taskStyle = {
              borderTopLeftRadius: isFirstDay ? '0.375rem' : '0',
              borderBottomLeftRadius: isFirstDay ? '0.375rem' : '0',
              borderTopRightRadius: isLastDay ? '0.375rem' : '0',
              borderBottomRightRadius: isLastDay ? '0.375rem' : '0',
              borderLeft: isFirstDay ? '3px solid' : '1px solid',
              borderLeftColor: isFirstDay ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)',
              borderRight: isLastDay ? '1px solid rgba(0,0,0,0.1)' : 'none',
              borderTop: '1px solid rgba(0,0,0,0.1)',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
            };

            const priorityInfo = priorityLevels.find(p => p.value === task.priority) || priorityLevels[1];
            const statusInfo = taskStatuses.find(s => s.value === task.status) || taskStatuses[0];

            return (
              <TooltipProvider key={`${task.id}-${row}-${index}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      data-task-id={task.id}
                      className={cn(
                        "relative px-2 py-1 text-xs font-medium group overflow-hidden cursor-pointer transition-colors duration-300",
                        task.color || "bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700",
                        showExtendButton && "pr-6"
                      )}
                      style={{
                        ...taskStyle,
                        transition: 'all 0.2s ease-in-out',
                      }}
                      onMouseEnter={() => showExtendButton && setHoveredTask(index)}
                      onMouseLeave={() => showExtendButton && setHoveredTask(null)}
                      onClick={() => setSelectedTask(task)}
                    >
                      {isFirstDay && (
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <div className="truncate font-medium flex-1">
                              {task.title}
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className={`text-[10px] py-0 px-1 ${priorityInfo.color}`}>
                                {priorityInfo.label}
                              </Badge>
                              <Badge className={`text-[10px] py-0 px-1 ${statusInfo.color}`}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </div>
                          {task.categories && task.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {task.categories.slice(0, 2).map((catId) => {
                                const category = predefinedCategories.find(c => c.id === catId);
                                return category && (
                                  <div key={catId} className={`h-2 w-2 rounded-full ${category.color}`} title={category.name}/>
                                );
                              })}
                              {task.categories.length > 2 && (
                                <div className="text-[10px] text-gray-600 dark:text-gray-400">+{task.categories.length - 2}</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {!isFirstDay && (
                        <div className="h-3"></div>
                      )}
                      {showExtendButton && (
                        <ExtendIcon
                          task={task}
                          day={day}
                          onExtendTask={onExtendTask}
                          currentDate={currentDate}
                          startingDay={startingDay}
                          isEndDay={true}
                        />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={8}
                    className="max-w-[300px] p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md"
                  >
                    <p className="text-sm font-medium mb-1 dark:text-gray-200">Notes</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {task.notes || 'No notes available.'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </ScrollArea>
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={(updatedTask) => onEditTask(updatedTask, day)}
          onDelete={onDeleteTask}
          currentDate={currentDate}
        />
      )}
    </div>
  );
});

function Page() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1));
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [selectedColor, setSelectedColor] = useState(taskColors[0].value);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedStatus, setSelectedStatus] = useState('todo');
  const [calendarTasks, setCalendarTasks] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false);
  const [filterCategories, setFilterCategories] = useState([]);
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useMediaQuery('(max-width: 767px)');

  // Debounce search query updates
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const showFeedback = (message) => {
    setFeedbackMessage(message);
    setShowFeedbackMessage(true);
  };

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      const savedCalendarTasks = localStorage.getItem('calendarTasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
      if (savedCalendarTasks) {
        setCalendarTasks(JSON.parse(savedCalendarTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      setTasks([]);
      setCalendarTasks({});
      showFeedback('Failed to load tasks. Starting fresh.');
    } finally {
      setIsLoading(false);
    }

    const style = document.createElement('style');
    style.textContent = `
      html {
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      .transition-colors {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }
      @keyframes pulse-success {
        0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
        100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
      }
      .task-extended {
        animation: pulse-success 0.5s cubic-bezier(0, 0, 0.2, 1);
      }
      .sidebar {
        transition: transform 0.3s ease;
      }
      .scrollarea-shadow {
        position: relative;
      }
      .scrollarea-shadow::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 8px;
        background: linear-gradient(transparent, rgba(0,0,0,0.1));
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
      showFeedback('Failed to save tasks.');
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('calendarTasks', JSON.stringify(calendarTasks));
    } catch (error) {
      console.error('Failed to save calendar tasks to localStorage:', error);
      showFeedback('Failed to save calendar tasks.');
    }
  }, [calendarTasks]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startingDay = firstDayOfMonth.getDay();
  const monthName = format(currentDate, 'MMMM');
  const year = currentDate.getFullYear();

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleCategoryFilter = (categoryId) => {
    setFilterCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) {
      alert('Task title cannot be empty');
      return;
    }
    if (taskInput.length > 100) {
      alert('Task title cannot exceed 100 characters');
      return;
    }
    const newTask = {
      id: uuidv4(),
      title: taskInput,
      color: selectedColor,
      categories: selectedCategories,
      description: '',
      notes: '',
      attachments: [],
      priority: selectedPriority,
      status: selectedStatus,
    };
    setTasks(prev => [...prev, newTask]);
    setTaskInput('');
    setSelectedPriority('medium');
    setSelectedStatus('todo');
    setSelectedCategories([]);
    showFeedback('Task added successfully');
  };

  const addCalendarTask = (newTask) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${newTask.startDay}`;
    setCalendarTasks((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTask],
    }));
    showFeedback('Task scheduled successfully');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    showFeedback('Task deleted successfully');
  };

  const handleDropTask = (task, day) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    setCalendarTasks((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { ...task, startDay: day }],
    }));
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    showFeedback('Task scheduled successfully');
  };

  const handleExtendTask = (task, startDay, endDate, isModifying = false) => {
    const endDay = endDate.getDate();
    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();

    if (
      endMonth === currentDate.getMonth() &&
      endYear === currentDate.getFullYear() &&
      endDay >= task.startDay
    ) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${task.startDay}`;
      setCalendarTasks((prev) => {
        const updatedTasks = (prev[dateKey] || []).map((t) =>
          t.id === task.id ? { ...t, endDay } : t
        );
        return { ...prev, [dateKey]: updatedTasks };
      });

      const taskEls = document.querySelectorAll(`[data-task-id="${task.id}"]`);
      taskEls.forEach(el => {
        el.classList.add('task-extended');
        setTimeout(() => {
          el.classList.remove('task-extended');
        }, 500);
      });

      showFeedback(isModifying ?
        `Task end date changed to ${endDay}` :
        `Task extended to ${endDay}`);
    }
  };

  const handleEditTask = (updatedTask, day) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${updatedTask.startDay}`;
    setCalendarTasks((prev) => {
      const updatedTasks = (prev[dateKey] || []).map((t) =>
        t.id === updatedTask.id ? { ...t, ...updatedTask } : t
      );
      return { ...prev, [dateKey]: updatedTasks };
    });
    showFeedback('Task updated successfully');
  };

  const handleDeleteCalendarTask = (taskId, startDay) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${startDay}`;
    setCalendarTasks((prev) => {
      const updatedTasks = (prev[dateKey] || []).filter((t) => t.id !== taskId);
      return { ...prev, [dateKey]: updatedTasks };
    });
    showFeedback('Task deleted successfully');
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (debouncedSearchQuery && !task.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
          return false;
        }
        if (filterCategories.length === 0) return true;
        return task.categories && task.categories.some(cat => filterCategories.includes(cat));
      })
      .sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
      });
  }, [tasks, debouncedSearchQuery, filterCategories]);

  const getFilteredCalendarTasks = useMemo(() => {
    let monthTasks = Object.keys(calendarTasks)
      .filter((key) => key.startsWith(`${currentDate.getFullYear()}-${currentDate.getMonth()}-`))
      .flatMap((key) => calendarTasks[key]);

    if (debouncedSearchQuery) {
      monthTasks = monthTasks.filter(task =>
        task.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    if (filterCategories.length > 0) {
      monthTasks = monthTasks.filter(task =>
        task.categories && task.categories.some(cat => filterCategories.includes(cat))
      );
    }

    return monthTasks;
  }, [calendarTasks, currentDate, debouncedSearchQuery, filterCategories]);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <CalendarDay
          key={i}
          day={i}
          isToday={isToday}
          tasks={getFilteredCalendarTasks}
          onDropTask={handleDropTask}
          onExtendTask={handleExtendTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteCalendarTask}
          currentDate={currentDate}
          startingDay={startingDay}
          onClick={setSelectedDay}
          isMobile={isMobile}
        />
      );
    }
    return days;
  }, [daysInMonth, today, getFilteredCalendarTasks, currentDate, startingDay, isMobile]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">Loading tasks...</div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Sidebar for Desktop */}
        {!isMobile && (
          <Card
            className={cn(
              "sidebar border-r rounded-none shadow-none h-screen flex flex-col dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300",
              isSidebarOpen ? "w-72" : "w-16"
            )}
          >
            <div className="flex items-center justify-between px-4 py-4">
              {isSidebarOpen && (
                <CardTitle className="text-xl flex items-center dark:text-gray-100">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Task Manager
                </CardTitle>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="dark:text-gray-200"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
            {isSidebarOpen && (
              <ScrollArea className="flex-1">
                <CardContent className="px-6 pb-6">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks..."
                        className="pl-8 w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <form onSubmit={addTask} className="space-y-3 mb-4">
                    <Input
                      type="text"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="Add a task"
                      className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskColors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 mr-2 rounded ${color.value.split(' ')[0]}`}></div>
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityLevels.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 mr-2 rounded ${priority.color}`}></div>
                              {priority.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 mr-2 rounded ${status.color}`}></div>
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full flex justify-between dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                          <div className="flex items-center">
                            <Tag className="mr-2 h-4 w-4" />
                            {selectedCategories.length === 0 ? 'Add categories' : `${selectedCategories.length} categories`}
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 dark:bg-gray-800 dark:border-gray-700">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm dark:text-gray-200">Select Categories</h4>
                          <Separator />
                          <div className="space-y-2">
                            {predefinedCategories.map((category) => (
                              <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`category-${category.id}`}
                                  checked={selectedCategories.includes(category.id)}
                                  onCheckedChange={() => toggleCategorySelection(category.id)}
                                />
                                <Label
                                  htmlFor={`category-${category.id}`}
                                  className="flex items-center cursor-pointer dark:text-gray-200"
                                >
                                  <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                                  {category.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button type="submit" className="w-full dark:bg-blue-600 dark:hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                  </form>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm dark:text-gray-200">Filter by Category</div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setFilterCategories([]);
                          }}
                          className="dark:text-gray-200"
                        >
                          Clear
                        </Button>
                        <Popover open={categoryFilterOpen} onOpenChange={setCategoryFilterOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={filterCategories.length > 0 ? "text-blue-600 dark:text-blue-400" : "dark:text-gray-200"}
                            >
                              <Filter className="h-4 w-4 mr-1" />
                              {filterCategories.length > 0 ? `${filterCategories.length} active` : "Filter"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 dark:bg-gray-800 dark:border-gray-700">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm dark:text-gray-200">Filter Tasks</h4>
                                {filterCategories.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs dark:text-gray-200"
                                    onClick={() => setFilterCategories([])}
                                  >
                                    Clear all
                                  </Button>
                                )}
                              </div>
                              <Separator />
                              <div className="space-y-2">
                                {predefinedCategories.map((category) => (
                                  <div key={category.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`filter-${category.id}`}
                                      checked={filterCategories.includes(category.id)}
                                      onCheckedChange={() => toggleCategoryFilter(category.id)}
                                    />
                                    <Label
                                      htmlFor={`filter-${category.id}`}
                                      className="flex items-center cursor-pointer dark:text-gray-200"
                                    >
                                      <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                                      {category.name}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    {filterCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {filterCategories.map(catId => {
                          const category = predefinedCategories.find(c => c.id === catId);
                          return category && (
                            <Badge key={catId} variant="secondary" className={`text-xs ${category.color} bg-opacity-10 text-gray-800 dark:text-gray-200 dark:bg-opacity-20`}>
                              {category.name}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 ml-1 p-0 dark:text-gray-200"
                                onClick={() => toggleCategoryFilter(catId)}
                              >
                                <span className="sr-only">Remove</span>
                                <span>×</span>
                              </Button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <Separator className="my-4" />
                  <div className="font-medium text-sm mb-2 dark:text-gray-200">Your Tasks</div>
                  <div className="space-y-1">
                    {filteredTasks.map((task) => (
                      <Task
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        color={task.color}
                        categories={task.categories}
                        priority={task.priority}
                        status={task.status}
                        onDelete={deleteTask}
                      />
                    ))}
                    {tasks.length === 0 && (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                        No tasks available. Create a task and drag it to the calendar.
                      </div>
                    )}
                    {tasks.length > 0 && filteredTasks.length === 0 && (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                        No tasks match your current search or category filters.
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground dark:text-gray-400 px-6 pb-6">
                  Drag tasks to calendar to schedule them
                </CardFooter>
              </ScrollArea>
            )}
          </Card>
        )}

        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col relative">
          <AnimatePresence>
            {showFeedbackMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-16 right-4 z-50 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-2 rounded-md shadow-md"
                onAnimationComplete={() => setTimeout(() => setShowFeedbackMessage(false), 1500)}
              >
                {feedbackMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="rounded-none shadow-none border-b dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between px-4 sm:px-6 py-4">
  <div className="flex items-center flex-wrap gap-2">
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
      asChild
      aria-label="Go to homepage"
    >
      <Link href="/">
        <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </Link>
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="h-10 px-3 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
      asChild
      aria-label="Navigate to task list page"
    >
      <Link href="/list">
        <Tag className="h-4 w-4 mr-2 text-gray-700 dark:text-gray-300" />
        Task List
      </Link>
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
      onClick={goToToday}
    >
      <CalendarIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
      onClick={prevMonth}
    >
      <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
      onClick={nextMonth}
    >
      <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
    </Button>
    <h1 className="text-lg sm:text-xl font-bold dark:text-gray-100">
      {monthName} {year}
    </h1>
  </div>
  <div className="flex items-center space-x-2">
    {isMobile && (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsTaskModalOpen(true)}
        className="h-10 w-10 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
      >
        <Menu className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </Button>
    )}
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="h-10 w-10 rounded-full shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
    >
      {isDarkMode ? <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" /> : <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />}
    </Button>
    {filterCategories.length > 0 && (
      <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-200">
        Filtered: {filterCategories.length} categories
      </Badge>
    )}
    <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-200">
      {format(currentDate, 'MMMM yyyy')}
    </Badge>
  </div>
</CardHeader>
          </Card>

          <div className="flex-1 h-[calc(100vh-80px)] overflow-hidden">
            <div className="grid grid-cols-7 border-b bg-gray-50 dark:bg-gray-800">
              {weekdays.map((day) => (
                <div key={day} className="p-2 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr h-[calc(100vh-112px)] overflow-auto">
              {calendarDays}
            </div>
          </div>

          {isMobile && (
            <Button
              className="fixed bottom-4 right-4 rounded-full h-12 w-12 flex items-center justify-center dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          )}
        </div>

        {isMobile && (
          <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
            <DialogContent className="sm:max-w-[600px] dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="dark:text-gray-100">Task Manager</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh]">
                <div className="px-6 pb-6">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks..."
                        className="pl-8 w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <form onSubmit={addTask} className="space-y-3 mb-4">
                    <Input
                      type="text"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="Add a task"
                      className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskColors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 mr-2 rounded ${color.value.split(' ')[0]}`}></div>
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityLevels.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 mr-2 rounded ${priority.color}`}></div>
                              {priority.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 mr-2 rounded ${status.color}`}></div>
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full flex justify-between dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                          <div className="flex items-center">
                            <Tag className="mr-2 h-4 w-4" />
                            {selectedCategories.length === 0 ? 'Add categories' : `${selectedCategories.length} categories`}
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 dark:bg-gray-800 dark:border-gray-700">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm dark:text-gray-200">Select Categories</h4>
                          <Separator />
                          <div className="space-y-2">
                            {predefinedCategories.map((category) => (
                              <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`category-${category.id}`}
                                  checked={selectedCategories.includes(category.id)}
                                  onCheckedChange={() => toggleCategorySelection(category.id)}
                                />
                                <Label
                                  htmlFor={`category-${category.id}`}
                                  className="flex items-center cursor-pointer dark:text-gray-200"
                                >
                                  <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                                  {category.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button type="submit" className="w-full dark:bg-blue-600 dark:hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                  </form>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm dark:text-gray-200">Filter by Category</div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setFilterCategories([]);
                          }}
                          className="dark:text-gray-200"
                        >
                          Clear
                        </Button>
                        <Popover open={categoryFilterOpen} onOpenChange={setCategoryFilterOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={filterCategories.length > 0 ? "text-blue-600 dark:text-blue-400" : "dark:text-gray-200"}
                            >
                              <Filter className="h-4 w-4 mr-1" />
                              {filterCategories.length > 0 ? `${filterCategories.length} active` : "Filter"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 dark:bg-gray-800 dark:border-gray-700">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm dark:text-gray-200">Filter Tasks</h4>
                                {filterCategories.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs dark:text-gray-200"
                                    onClick={() => setFilterCategories([])}
                                  >
                                    Clear all
                                  </Button>
                                )}
                              </div>
                              <Separator />
                              <div className="space-y-2">
                                {predefinedCategories.map((category) => (
                                  <div key={category.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`filter-${category.id}`}
                                      checked={filterCategories.includes(category.id)}
                                      onCheckedChange={() => toggleCategoryFilter(category.id)}
                                    />
                                    <Label
                                      htmlFor={`filter-${category.id}`}
                                      className="flex items-center cursor-pointer dark:text-gray-200"
                                    >
                                      <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                                      {category.name}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    {filterCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {filterCategories.map(catId => {
                          const category = predefinedCategories.find(c => c.id === catId);
                          return category && (
                            <Badge key={catId} variant="secondary" className={`text-xs ${category.color} bg-opacity-10 text-gray-800 dark:text-gray-200 dark:bg-opacity-20`}>
                              {category.name}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 ml-1 p-0 dark:text-gray-200"
                                onClick={() => toggleCategoryFilter(catId)}
                              >
                                <span className="sr-only">Remove</span>
                                <span>×</span>
                              </Button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <Separator className="my-4" />
                  <div className="font-medium text-sm mb-2 dark:text-gray-200">Your Tasks</div>
                  <div className="space-y-1">
                    {filteredTasks.map((task) => (
                     <Task
                     key={task.id}
                     id={task.id}
                     title={task.title}
                     color={task.color}
                     categories={task.categories}
                     priority={task.priority}
                     status={task.status}
                     onDelete={deleteTask}
                   />
                 ))}
                 {tasks.length === 0 && (
                   <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                     No tasks available. Create a task and drag it to the calendar.
                   </div>
                 )}
                 {tasks.length > 0 && filteredTasks.length === 0 && (
                   <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                     No tasks match your current search or category filters.
                   </div>
                 )}
               </div>
             </div>
           </ScrollArea>
           <DialogFooter>
             <Button variant="outline" onClick={() => setIsTaskModalOpen(false)} className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
               Close
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     )}

     {selectedDay && (
       <TaskModal
         isOpen={!!selectedDay}
         onClose={() => setSelectedDay(null)}
         onAddTask={addCalendarTask}
         onExtendTask={handleExtendTask}
         day={selectedDay}
         currentDate={currentDate}
         tasks={getFilteredCalendarTasks}
       />
     )}
   </div>
 </DndProvider>
);
}

export default Page;