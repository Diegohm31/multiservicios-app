
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  
  let date;
  if (typeof dateInput === 'string') {
    // Handle YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const [year, month, day] = dateInput.split('-').map(Number);
      return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}-${year}`;
    }
    // Handle YYYY-MM-DD with time
    if (dateInput.includes('T') || dateInput.includes(' ')) {
      date = new Date(dateInput);
    } else {
      // Fallback for other string formats
      date = new Date(dateInput);
    }
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return dateInput;
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}-${day}-${year}`;
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  
  const date = parseLocalDateTime(dateInput);
  if (!date || isNaN(date.getTime())) return dateInput;
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
};

/**
 * Parses a date string (YYYY-MM-DD or YYYY-MM-DD HH:mm:ss) to a Date object in local time.
 * If setToEnd is true, it sets the time to 23:59:59.999.
 */
export const parseLocalDate = (dateStr, setToEnd = false) => {
  if (!dateStr) return null;
  
  let match;
  if (dateStr instanceof Date) {
      match = [null, dateStr.getFullYear(), dateStr.getMonth() + 1, dateStr.getDate()];
  } else if (typeof dateStr === 'string') {
      match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  }
  
  if (!match) return null;
  
  const [ , year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  
  if (setToEnd) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  
  return date;
};

/**
 * Specifically for matching actual date-time values against a day-only filter.
 * This version preserves the full time of the input date if it's the one being checked.
 */
export const parseLocalDateTime = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  
  // If it has 'T' or space, it likely has time.
  // We want to parse it as a local date even if it looks like ISO but lacks Z
  if (typeof dateStr === 'string' && (dateStr.includes('T') || dateStr.includes(' '))) {
    // Replace space with T for standardized parsing if needed, 
    // but Date(YYYY-MM-DD HH:mm:ss) works in most browsers as local time.
    const date = new Date(dateStr.replace(' ', 'T'));
    if (!isNaN(date.getTime())) return date;
  }
  
  // Fallback to day parsing if it's just a day
  return parseLocalDate(dateStr);
};

/**
 * Smart parser for filters. 
 * If the input has time (datetime-local), it preserves it.
 * If it doesn't (date), it sets it to start or end of day.
 */
export const parseFilter = (dateStr, isEnd = false) => {
  if (!dateStr) return null;
  if (dateStr.includes('T') || dateStr.includes(' ')) {
    return parseLocalDateTime(dateStr);
  }
  return parseLocalDate(dateStr, isEnd);
};

/**
 * Parses a date string and returns a Date object set to the beginning of the day in local time
 */
export const getStartOfDay = (dateInput) => {
  return parseLocalDate(dateInput, false);
};

/**
 * Parses a date string and returns a Date object set to the end of the day in local time
 */
export const getEndOfDay = (dateInput) => {
  return parseLocalDate(dateInput, true);
};
