/**
 * Utility functions for generating avatar placeholders
 */

// Predefined color palette for avatar backgrounds
const AVATAR_COLORS = [
  "#E53935", // Strong Red
  "#D81B60", // Deep Pink
  "#8E24AA", // Purple
  "#5E35B1", // Deep Violet
  "#3949AB", // Indigo
  "#1E88E5", // Bright Blue
  "#039BE5", // Sky Blue
  "#00ACC1", // Cyan
  "#00897B", // Teal
  "#43A047", // Green
  "#7CB342", // Lime Green
  "#FDD835", // Yellow
  "#FB8C00", // Orange
  "#F4511E", // Deep Orange
  "#6D4C41", // Brown
];

/**
 * Generate a consistent hash number from a string
 * Used to always get the same color for the same name
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get initials from first and last name
 * @param firstName - First name
 * @param lastName - Last name (optional)
 * @returns Two-character initials (e.g., "JD" for "John Doe")
 */
export function getInitials(
  firstName: string = "",
  lastName: string = "",
): string {
  const first = firstName.trim().charAt(0).toUpperCase();
  const last = lastName.trim().charAt(0).toUpperCase();

  if (first && last) {
    return `${first}${last}`;
  } else if (first) {
    // If only first name, try to get second character
    const second = firstName.trim().charAt(1).toUpperCase();
    return second ? `${first}${second}` : first;
  }

  return "UN"; // Unknown
}

/**
 * Get a consistent background color based on the name
 * @param firstName - First name
 * @param lastName - Last name (optional)
 * @returns Hex color code
 */
export function getAvatarColor(
  firstName: string = "",
  lastName: string = "",
): string {
  const fullName = `${firstName}${lastName}`.toLowerCase();
  const hash = hashString(fullName);
  const index = hash % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Generate a data URI for an avatar with initials and colored background
 * @param firstName - First name
 * @param lastName - Last name (optional)
 * @param size - Size of the avatar in pixels (default: 200)
 * @returns Data URI that can be used as img src
 */
export function generateAvatarDataUri(
  firstName: string = "",
  lastName: string = "",
  size: number = 200,
): string {
  const initials = getInitials(firstName, lastName);
  const bgColor = getAvatarColor(firstName, lastName);
  const textColor = "#FFFFFF";
  const fontSize = Math.floor(size * 0.4); // 40% of size

  // Create SVG
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${bgColor}"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="${fontSize}px"
        font-weight="600"
        fill="${textColor}"
      >${initials}</text>
    </svg>
  `.trim();

  // Convert to data URI
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get avatar URL with fallback to generated initials avatar
 * @param avatarUrl - User's avatar URL (may be null/undefined)
 * @param firstName - First name for fallback
 * @param lastName - Last name for fallback
 * @param size - Size of the fallback avatar (default: 200)
 * @returns Avatar URL or generated data URI
 */
export function getAvatarUrl(
  avatarUrl?: string | null | undefined,
  firstName: string = "",
  lastName: string = "",
  size: number = 200,
): string {
  // If avatar URL exists and is not empty, use it
  if (avatarUrl && avatarUrl.trim() !== "") {
    return avatarUrl;
  }

  // Otherwise, generate initials avatar
  return generateAvatarDataUri(firstName, lastName, size);
}
