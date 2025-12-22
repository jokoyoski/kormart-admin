/**
 * Permission utility functions for RBAC
 */

// Available permissions
export const PERMISSIONS = {
 ALL: 'all',
 MANAGE_USERS: 'manage_users',
 MANAGE_STAFFS: 'manage_staffs',
 MANAGE_CATEGORIES: 'manage_categories',
 MANAGE_ROLES: 'manage_roles',
 MANAGE_ORDERS: 'manage_orders',
 MANAGE_TRANSACTIONS: 'manage_transactions',
};

// Route to permission mapping
export const ROUTE_PERMISSIONS = {
 '/dashboard': null, // Available to everyone
 '/dashboard/user-management': PERMISSIONS.MANAGE_USERS,
 '/dashboard/members-management': [PERMISSIONS.MANAGE_STAFFS, PERMISSIONS.MANAGE_ROLES], // Can be accessed by either
 '/dashboard/categories': PERMISSIONS.MANAGE_CATEGORIES,
 '/dashboard/category': PERMISSIONS.MANAGE_CATEGORIES, // For category details
 '/dashboard/orders': PERMISSIONS.MANAGE_ORDERS,
 '/dashboard/transactions': PERMISSIONS.MANAGE_TRANSACTIONS,
 '/dashboard/settings': null, // Available to everyone
 '/dashboard/disputes': PERMISSIONS.ALL, // Requires "all" permission
};

/**
 * Get user permissions from user object
 * @param {Object} user - User object from auth store
 * @returns {Array} Array of permission strings
 */
export const getUserPermissions = (user) => {
 if (!user) return [];
 
 // Get permissions from the first role in the roles array
 const roles = user?.roles || [];
 if (roles.length === 0) return [];
 
 // Get permissions from the first role
 const firstRole = roles[0];
 return firstRole?.permissions || [];
};

/**
 * Check if user has a specific permission
 * @param {Object} user - User object from auth store
 * @param {String} permission - Permission to check
 * @returns {Boolean} True if user has permission
 */
export const hasPermission = (user, permission) => {
 if (!permission) return true; // No permission required
  
 const permissions = getUserPermissions(user);
 
 // If user has "all" permission, they have access to everything
 if (permissions.includes(PERMISSIONS.ALL)) {
  return true;
 }
 
 // Check if user has the specific permission
 return permissions.includes(permission);
};

/**
 * Check if user has access to a route
 * @param {Object} user - User object from auth store
 * @param {String} route - Route path
 * @returns {Boolean} True if user has access
 */
export const hasRouteAccess = (user, route) => {
 // Extract base route (remove dynamic segments)
 const baseRoute = route.split('/').slice(0, 3).join('/'); // e.g., /dashboard/orders/123 -> /dashboard/orders
  
 // Check if route has a specific permission requirement
 let requiredPermission = ROUTE_PERMISSIONS[baseRoute];
  
 // Special handling for members-management (can be accessed by manage_staffs OR manage_roles)
 if (baseRoute === '/dashboard/members-management' && Array.isArray(requiredPermission)) {
  const permissions = getUserPermissions(user);
  // Check if user has "all" permission
  if (permissions.includes(PERMISSIONS.ALL)) return true;
  // Check if user has any of the required permissions
  return requiredPermission.some(perm => permissions.includes(perm));
 }
  
 // If not found, try checking with partial match for dynamic routes
 if (!requiredPermission) {
  // Check for category routes
  if (baseRoute.includes('/category') || route.includes('/category')) {
   requiredPermission = PERMISSIONS.MANAGE_CATEGORIES;
  }
  // Check for sub-routes
  else if (baseRoute === '/dashboard' && route !== '/dashboard') {
   // For sub-routes, check if parent route has permission
   const routeParts = route.split('/').filter(Boolean);
   if (routeParts.length >= 2) {
    const parentRoute = `/${routeParts[0]}/${routeParts[1]}`;
    const parentPermission = ROUTE_PERMISSIONS[parentRoute];
    
    // Handle array permissions (like members-management)
    if (Array.isArray(parentPermission)) {
     const permissions = getUserPermissions(user);
     if (permissions.includes(PERMISSIONS.ALL)) return true;
     return parentPermission.some(perm => permissions.includes(perm));
    }
    
    requiredPermission = parentPermission;
   }
   // Handle sub-routes like /dashboard/orders/:id or /dashboard/transactions/:id
   else if (routeParts.length >= 3) {
    const parentRoute = `/${routeParts[0]}/${routeParts[1]}`;
    requiredPermission = ROUTE_PERMISSIONS[parentRoute];
   }
  }
 }
  
 // If still no permission found and it's not dashboard or settings, require "all"
 if (!requiredPermission && baseRoute !== '/dashboard' && !baseRoute.includes('/settings')) {
  // Check if it's a known route that needs "all"
  const knownRoutes = Object.keys(ROUTE_PERMISSIONS);
  const isKnownRoute = knownRoutes.some(knownRoute => {
   if (Array.isArray(ROUTE_PERMISSIONS[knownRoute])) {
    return route.startsWith(knownRoute);
   }
   return route.startsWith(knownRoute);
  });
  
  if (!isKnownRoute) {
   requiredPermission = PERMISSIONS.ALL;
  }
 }
  
 // Handle null permission (available to everyone)
 if (requiredPermission === null) {
  return true;
 }
  
 return hasPermission(user, requiredPermission);
};

/**
 * Get required permission for a route
 * @param {String} route - Route path
 * @returns {String|null} Required permission or null if available to everyone
 */
export const getRoutePermission = (route) => {
 const baseRoute = route.split('/').slice(0, 3).join('/');
 return ROUTE_PERMISSIONS[baseRoute] || null;
};

