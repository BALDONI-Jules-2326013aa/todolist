// DateUtils.js
export const formatDateForDisplay = (dateString) => {
    // Check if the date is in DD/MM/YYYY format
    if (dateString && dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      // Convert to YYYY-MM-DD for HTML date input
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString; // Return as is if not in expected format
  };
  
  export const formatDateForStorage = (dateString) => {
    // Check if the date is in YYYY-MM-DD format
    if (dateString && dateString.includes('-')) {
      const [year, month, day] = dateString.split('-');
      // Convert to DD/MM/YYYY for storage
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    return dateString; // Return as is if not in expected format
  };
  
  export const getCurrentDate = (format = 'storage') => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    if (format === 'display') {
      return `${year}-${month}-${day}`;
    }
    return `${day}/${month}/${year}`;
  };