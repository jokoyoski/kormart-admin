/**
 * Get user name from user object
 * Checks fullName, username, and email in that order
 */
export const getUserName = (user) => {
 return (
  user?.userDetails?.fullName ||
  user?.userDetails?.username ||
  user?.email ||
  'Unknown User'
 );
};

/**
 * Get user initials from user object
 */
export const getUserInitials = (user) => {
 const name = getUserName(user);
 const parts = name.split(' ');
 if (parts.length >= 2) {
  return (parts[0][0] + parts[1][0]).toUpperCase();
 }
 return name.substring(0, 2).toUpperCase();
};

/**
 * Get user avatar from user object
 */
export const getUserAvatar = (user) => {
 return user?.userDetails?.avatar || null;
};
