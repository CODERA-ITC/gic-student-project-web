export interface Icon {
  name: string;
  label: string;
  category?: string;
  keywords?: string[];
  featured?: boolean;
}

export const availableIcons: Icon[] = [
  // Development & Code
  {
    name: "i-heroicons-code-bracket",
    label: "Code",
    category: "Development",
    keywords: ["code", "programming", "dev"],
    featured: true,
  },
  {
    name: "i-heroicons-command-line",
    label: "Terminal",
    category: "Development",
    keywords: ["terminal", "cli", "command"],
    featured: true,
  },
  {
    name: "i-heroicons-bug-ant",
    label: "Bug",
    category: "Development",
    keywords: ["bug", "debug", "error"],
    featured: true,
  },
  {
    name: "i-heroicons-wrench-screwdriver",
    label: "Tools",
    category: "Development",
    keywords: ["tools", "build", "config"],
  },

  // Server & Infrastructure
  {
    name: "i-lucide-server",
    label: "Server",
    category: "Infrastructure",
    keywords: ["server", "backend", "api"],
    featured: true,
  },
  {
    name: "i-heroicons-cloud",
    label: "Cloud",
    category: "Infrastructure",
    keywords: ["cloud", "deploy", "hosting"],
    featured: true,
  },
  {
    name: "i-heroicons-cpu-chip",
    label: "Performance",
    category: "Infrastructure",
    keywords: ["performance", "cpu", "optimization"],
  },
  {
    name: "i-heroicons-circle-stack",
    label: "Database",
    category: "Infrastructure",
    keywords: ["database", "storage", "data"],
    featured: true,
  },

  // UI & Design
  {
    name: "i-heroicons-paint-brush",
    label: "Design",
    category: "UI/UX",
    keywords: ["design", "ui", "paint"],
    featured: true,
  },
  {
    name: "i-heroicons-sparkles",
    label: "Enhancement",
    category: "UI/UX",
    keywords: ["enhance", "improve", "sparkle"],
    featured: true,
  },
  {
    name: "i-heroicons-swatch",
    label: "Theme",
    category: "UI/UX",
    keywords: ["theme", "color", "style"],
  },
  {
    name: "i-heroicons-photo",
    label: "Image",
    category: "UI/UX",
    keywords: ["image", "photo", "media"],
    featured: true,
  },

  // Analytics & Data
  {
    name: "i-lucide-bar-chart",
    label: "Analytics",
    category: "Analytics",
    keywords: ["analytics", "chart", "stats"],
    featured: true,
  },
  {
    name: "i-heroicons-chart-bar",
    label: "Dashboard",
    category: "Analytics",
    keywords: ["dashboard", "chart", "data"],
    featured: true,
  },
  {
    name: "i-heroicons-chart-pie",
    label: "Report",
    category: "Analytics",
    keywords: ["report", "pie", "stats"],
  },
  {
    name: "i-heroicons-presentation-chart-line",
    label: "Metrics",
    category: "Analytics",
    keywords: ["metrics", "line", "graph"],
  },

  // Security & Auth
  {
    name: "i-heroicons-shield-check",
    label: "Security",
    featured: true,
    category: "Security",
    keywords: ["security", "protect", "safe"],
  },
  {
    name: "i-heroicons-lock-closed",
    label: "Auth",
    category: "Security",
    keywords: ["auth", "lock", "login"],
    featured: true,
  },
  {
    name: "i-heroicons-key",
    label: "API Key",
    category: "Security",
    keywords: ["key", "token", "credential"],
    featured: true,
  },
  {
    name: "i-heroicons-finger-print",
    label: "Biometric",
    category: "Security",
    keywords: ["biometric", "fingerprint", "identity"],
  },

  // Features & Status
  {
    name: "i-heroicons-star",
    label: "Feature",
    category: "Feature",
    keywords: ["feature", "star", "new"],
    featured: true,
  },
  {
    name: "i-heroicons-check-circle",
    label: "Complete",
    category: "Status",
    keywords: ["complete", "done", "success"],
    featured: true,
  },
  {
    name: "i-heroicons-clock",
    label: "Pending",
    category: "Status",
    keywords: ["pending", "waiting", "time"],
  },
  {
    name: "i-heroicons-rocket-launch",
    label: "Launch",
    category: "Status",
    keywords: ["launch", "deploy", "release"],
    featured: true,
  },

  // User & Team
  {
    name: "i-heroicons-user-group",
    label: "Team",
    category: "User",
    keywords: ["team", "group", "people"],
  },
  {
    name: "i-heroicons-user-circle",
    label: "Profile",
    category: "User",
    keywords: ["profile", "user", "account"],
  },
  {
    name: "i-heroicons-chat-bubble-left-right",
    label: "Chat",
    category: "User",
    keywords: ["chat", "message", "communication"],
  },
  {
    name: "i-heroicons-bell",
    label: "Notification",
    category: "User",
    keywords: ["notification", "bell", "alert"],
  },

  // Settings & Config
  {
    name: "i-heroicons-cog-6-tooth",
    label: "Settings",
    category: "Settings",
    keywords: ["settings", "config", "preferences"],
  },
  {
    name: "i-heroicons-adjustments-horizontal",
    label: "Controls",
    category: "Settings",
    keywords: ["controls", "adjust", "filter"],
  },
  {
    name: "i-heroicons-wrench",
    label: "Configuration",
    category: "Settings",
    keywords: ["config", "setup", "tool"],
  },

  // Devices & Platforms
  {
    name: "i-heroicons-device-phone-mobile",
    label: "Mobile",
    category: "Platform",
    keywords: ["mobile", "phone", "responsive"],
  },
  {
    name: "i-heroicons-device-tablet",
    label: "Tablet",
    category: "Platform",
    keywords: ["tablet", "ipad", "device"],
  },
  {
    name: "i-heroicons-computer-desktop",
    label: "Desktop",
    category: "Platform",
    keywords: ["desktop", "computer", "pc"],
  },
  {
    name: "i-heroicons-globe-alt",
    label: "Web",
    category: "Platform",
    keywords: ["web", "internet", "global"],
  },

  // Communication & Social
  {
    name: "i-heroicons-envelope",
    label: "Email",
    category: "Communication",
    keywords: ["email", "mail", "message"],
  },
  {
    name: "i-heroicons-megaphone",
    label: "Announcement",
    category: "Communication",
    keywords: ["announcement", "broadcast", "news"],
  },
  {
    name: "i-heroicons-chat-bubble-bottom-center",
    label: "Comment",
    category: "Communication",
    keywords: ["comment", "feedback", "chat"],
  },

  // Documents & Files
  {
    name: "i-heroicons-document-text",
    label: "Document",
    category: "Files",
    keywords: ["document", "file", "text"],
  },
  {
    name: "i-heroicons-folder",
    label: "Folder",
    category: "Files",
    keywords: ["folder", "directory", "files"],
  },
  {
    name: "i-heroicons-clipboard-document",
    label: "Copy",
    category: "Files",
    keywords: ["copy", "clipboard", "paste"],
  },
  {
    name: "i-heroicons-arrow-down-tray",
    label: "Download",
    category: "Files",
    keywords: ["download", "save", "export"],
  },

  // AI & Innovation
  {
    name: "i-heroicons-light-bulb",
    label: "Idea",
    category: "Innovation",
    keywords: ["idea", "innovation", "creative"],
  },
  {
    name: "i-heroicons-beaker",
    label: "Experiment",
    category: "Innovation",
    keywords: ["experiment", "test", "lab"],
  },
  {
    name: "i-heroicons-academic-cap",
    label: "Learning",
    category: "Innovation",
    keywords: ["learning", "education", "study"],
  },

  // Actions
  {
    name: "i-heroicons-plus",
    label: "Add",
    category: "Action",
    keywords: ["add", "create", "new"],
  },
  {
    name: "i-heroicons-trash",
    label: "Delete",
    category: "Action",
    keywords: ["delete", "remove", "trash"],
  },
  {
    name: "i-heroicons-pencil",
    label: "Edit",
    category: "Action",
    keywords: ["edit", "modify", "update"],
  },
  {
    name: "i-heroicons-magnifying-glass",
    label: "Search",
    category: "Action",
    keywords: ["search", "find", "look"],
  },
];

export const getIconsByCategory = (category: string): Icon[] => {
  return availableIcons.filter((icon) => icon.category === category);
};

export const searchIcons = (query: string): Icon[] => {
  if (!query.trim()) return availableIcons;

  const lowerQuery = query.toLowerCase();
  return availableIcons.filter(
    (icon) =>
      icon.label.toLowerCase().includes(lowerQuery) ||
      icon.name.toLowerCase().includes(lowerQuery) ||
      icon.category?.toLowerCase().includes(lowerQuery) ||
      icon.keywords?.some((keyword) => keyword.includes(lowerQuery))
  );
};

export const getIconCategories = (): string[] => {
  const categories = new Set<string>();
  availableIcons.forEach((icon) => {
    if (icon.category) categories.add(icon.category);
  });
  return Array.from(categories).sort();
};

export const getFeaturedIcons = (limit: number = 15): Icon[] => {
  return availableIcons.filter((icon) => icon.featured).slice(0, limit);
};
