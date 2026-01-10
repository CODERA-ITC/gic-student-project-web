export interface StatusOption {
  value: string;
  label: string;
  color?: string;
}

export interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  role?: string;
  avatar: string;
}

// Project status options
export const availableStatuses: StatusOption[] = [
  { value: "pending", label: "In Pending", color: "yellow" },
  { value: "ongoing", label: "Ongoing", color: "blue" },
  { value: "done", label: "Done", color: "green" },
];

// Project duration options
export const durationOptions: string[] = [
  "1 month",
  "2 months",
  "3 months",
  "4 months",
  "5 months",
  "6 months",
  "6+ months",
];

// Academic year options
export const academicYearOptions: string[] = [
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
];

// Repository visibility options
export const visibilityOptions: string[] = ["public", "private"];

// Suggested team members (this could be fetched from API in production)
export const suggestedMembers: TeamMember[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Chen",
    role: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    firstName: "Alex",
    lastName: "Kumar",
    role: "Backend Developer",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    firstName: "Maya",
    lastName: "Rodriguez",
    role: "UI/UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    firstName: "David",
    lastName: "Park",
    role: "DevOps Engineer",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    firstName: "Emma",
    lastName: "Thompson",
    role: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: 6,
    firstName: "James",
    lastName: "Wilson",
    role: "Full Stack Developer",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
];

export const technologiesOptions: string[] = [
  // Programming Languages
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "Kotlin",
  "Swift",
  "PHP",
  "Ruby",
  "Scala",
  "R",
  "MATLAB",
  "Julia",
  "Dart",
  "Elixir",
  "Clojure",
  "Perl",

  // Frontend Frameworks
  "React",
  "Vue.js",
  "Angular",
  "Svelte",
  "Next.js",
  "Nuxt.js",
  "Gatsby",
  "Astro",
  "SolidJS",
  "Qwik",
  "Ember.js",

  // Backend Frameworks
  "Node.js",
  "Express.js",
  "NestJS",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  "ASP.NET Core",
  "Phoenix",
  "Gin",
  "Fiber",

  // Mobile Development
  "React Native",
  "Flutter",
  "Ionic",
  "Xamarin",
  "SwiftUI",
  "Jetpack Compose",

  // Databases
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "MariaDB",
  "Cassandra",
  "Elasticsearch",
  "Firebase",
  "Supabase",
  "DynamoDB",
  "Neo4j",
  "CouchDB",

  // Cloud Platforms
  "AWS",
  "Azure",
  "Google Cloud",
  "DigitalOcean",
  "Heroku",
  "Vercel",
  "Netlify",
  "Firebase",
  "Cloudflare",

  // DevOps & Infrastructure
  "Docker",
  "Kubernetes",
  "Terraform",
  "Ansible",
  "Jenkins",
  "GitLab CI",
  "GitHub Actions",
  "CircleCI",
  "Travis CI",
  "Prometheus",
  "Grafana",

  // AI/ML Frameworks
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Scikit-learn",
  "OpenCV",
  "Hugging Face",
  "LangChain",
  "JAX",
  "MLflow",
  "Ray",

  // Blockchain
  "Solidity",
  "Web3.js",
  "Ethers.js",
  "Hardhat",
  "Truffle",
  "Substrate",
  "Hyperledger",

  // Game Development
  "Unity",
  "Unreal Engine",
  "Godot",
  "Phaser",
  "Three.js",
  "Babylon.js",

  // Testing
  "Jest",
  "Cypress",
  "Playwright",
  "Selenium",
  "Mocha",
  "Chai",
  "JUnit",
  "pytest",

  // Design & UI/UX
  "Figma",
  "Adobe XD",
  "Sketch",
  "Tailwind CSS",
  "Bootstrap",
  "Material-UI",
  "Chakra UI",
  "Styled Components",
  "SASS/SCSS",
  "Framer Motion",

  // APIs & Communication
  "GraphQL",
  "REST API",
  "gRPC",
  "WebSocket",
  "WebRTC",
  "Apache Kafka",
  "RabbitMQ",

  // Miscellaneous
  "Git",
  "Linux",
  "Nginx",
  "Apache",
  "Electron",
  "Tauri",
  "WebAssembly",
  "Arduino",
  "Raspberry Pi",
  "ESP32",
];

// Helper functions
export const getStatusColor = (status: string): string => {
  const statusOption = availableStatuses.find((s) => s.value === status);
  return statusOption?.color || "gray";
};

export const getStatusLabel = (status: string): string => {
  const statusOption = availableStatuses.find((s) => s.value === status);
  return statusOption?.label || status;
};

export const searchTeamMembers = (
  members: TeamMember[],
  query: string
): TeamMember[] => {
  if (!query.trim()) return members;

  const lowerQuery = query.toLowerCase();
  return members.filter(
    (member) =>
      member.firstName.toLowerCase().includes(lowerQuery) ||
      member.lastName.toLowerCase().includes(lowerQuery) ||
      `${member.firstName} ${member.lastName}`
        .toLowerCase()
        .includes(lowerQuery) ||
      member.role.toLowerCase().includes(lowerQuery)
  );
};
