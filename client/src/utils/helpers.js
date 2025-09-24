// Utility functions for the Community Watch application

/**
 * Format date to a readable string
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format date and time to a readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time string (e.g., "2 days ago")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now - targetDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Get status color class
 * @param {string} status - Status string
 * @returns {string} CSS class name
 */
export const getStatusColor = (status) => {
  const statusColors = {
    open: 'status-open',
    pending: 'status-pending',
    closed: 'status-closed',
    active: 'status-active',
    inactive: 'status-inactive'
  };
  
  return statusColors[status?.toLowerCase()] || 'status-default';
};

/**
 * Get role color class
 * @param {string} role - Role string
 * @returns {string} CSS class name
 */
export const getRoleColor = (role) => {
  const roleColors = {
    admin: 'role-admin',
    officer: 'role-officer',
    supervisor: 'role-supervisor'
  };
  
  return roleColors[role?.toLowerCase()] || 'role-default';
};

/**
 * Generate initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Filter array by search term
 * @param {Array} items - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered array
 */
export const filterBySearch = (items, searchTerm, searchFields) => {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  
  return items.filter(item => 
    searchFields.some(field => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(term);
    })
  );
};

/**
 * Get nested object value by dot notation
 * @param {object} obj - Object to search
 * @param {string} path - Dot notation path
 * @returns {any} Value at path
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Sort array by field
 * @param {Array} items - Array to sort
 * @param {string} field - Field to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortBy = (items, field, direction = 'asc') => {
  return [...items].sort((a, b) => {
    const aValue = getNestedValue(a, field);
    const bValue = getNestedValue(b, field);
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by field
 * @param {Array} items - Array to group
 * @param {string} field - Field to group by
 * @returns {object} Grouped object
 */
export const groupBy = (items, field) => {
  return items.reduce((groups, item) => {
    const key = getNestedValue(item, field);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate random ID
 * @returns {string} Random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Calculate statistics from data
 * @param {Array} data - Data array
 * @param {string} field - Field to calculate stats for
 * @returns {object} Statistics object
 */
export const calculateStats = (data, field) => {
  if (!data.length) return { total: 0, average: 0, min: 0, max: 0 };
  
  const values = data.map(item => getNestedValue(item, field)).filter(v => v != null);
  const total = values.reduce((sum, val) => sum + val, 0);
  
  return {
    total,
    average: total / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length
  };
};
