export const getRandomProject = () => {
  const projectNames = [
    "Smart Parking System",
    "Face Mask Detection App",
    "AI Plant Disease Classifier",
    "Real-time Chat Application",
    "Student Attendance with Face Recognition",
    "E-Commerce Recommendation Engine",
    "Weather Forecast Dashboard",
    "AI Traffic Sign Recognition",
  ];

  const categories = [
    "Artificial Intelligence",
    "Computer Vision",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "IoT",
    "Cybersecurity",
  ];

  const academicYears = ["2023-2024", "2024-2025", "2025-2026"];

  const technologiesList = [
    "Vue.js",
    "Nuxt 3",
    "NestJS",
    "Spring Boot",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "TensorFlow",
    "PyTorch",
    "OpenCV",
    "YOLOv8",
    "Docker",
    "AWS",
  ];

  const courses = [
    "Artificial Intelligence & Computer Vision",
    "Web Programming",
    "Database Systems",
    "Software Engineering",
    "Machine Learning",
  ];

  const membersPool = [
    { name: "Sarah Chen", role: "Frontend Developer", gender: "women", id: 1 },
    { name: "Alex Kumar", role: "Backend Developer", gender: "men", id: 2 },
    { name: "John Lim", role: "ML Engineer", gender: "men", id: 3 },
    { name: "Sophea Chan", role: "UI/UX Designer", gender: "women", id: 4 },
    { name: "Dara Sok", role: "DevOps Engineer", gender: "men", id: 5 },
  ];

  const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomTechnologies = () => {
    const count = randomInt(3, 6);
    const shuffled = [...technologiesList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const getRandomMembers = () => {
    const count = randomInt(2, 4);
    const shuffled = [...membersPool].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count).map((m) => ({
      name: m.name,
      role: m.role,
      avatar: `https://randomuser.me/api/portraits/${m.gender}/${m.id}.jpg`,
    }));
  };

  const projectName = randomPick(projectNames);

  return {
    name: projectName,
    description: `${projectName} is a university project focusing on building a complete system including design, development, and testing.`,
    thumbnails: [],
    category: randomPick(categories),
    academicYear: randomPick(academicYears),
    technologies: getRandomTechnologies(),
    githubUrl: `https://github.com/demo/${projectName.toLowerCase().replaceAll(" ", "-")}`,
    demoUrl: `https://${projectName.toLowerCase().replaceAll(" ", "-")}.demo.com`,
    visibility: Math.random() > 0.5 ? "public" : "private",
    duration: `${randomInt(1, 6)} months`,
    teamSize: randomInt(2, 5),
    teamMembers: getRandomMembers(),
    feature: [
      {
        name: "Planning & Research",
        description:
          "Defined system scope, requirements, and collected references.",
        date: "2025-09-01",
        icon: "i-lucide-book-open",
        status: "done",
      },
      {
        name: "Development",
        description:
          "Implemented core features and integrated backend services.",
        date: "2025-10-01",
        icon: "i-lucide-code",
        status: "done",
      },
      {
        name: "Testing & Improvements",
        description: "Fixed bugs, improved UI, and optimized performance.",
        date: "2025-11-01",
        icon: "i-lucide-bug",
        status: "done",
      },
      {
        name: "Deployment",
        description: "Deployed the project and prepared documentation.",
        date: "2025-12-01",
        icon: "i-lucide-cloud",
        status: "done",
      },
    ],
    tags: [],
    course: randomPick(courses),
  };
};
