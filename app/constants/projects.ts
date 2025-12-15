export const projectsData: Project[] = [
  {
    id: 1,
    title: "AI Chat Assistant",
    description:
      "An intelligent chatbot powered by GPT-3 for customer support. This project aims to enhance user experience by providing instant and accurate responses to common inquiries.",
    semester: "Fall 2024",
    author: {
      name: "Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/women/11.jpg",
      program: "Computer Science",
      year: "4th Year",
    },
    technologies: ["Python", "GPT-3", "React", "Node.js", "MongoDB"],
    category: "Artificial Intelligence",
    status: "Completed",
    featured: true,
    likes: 342,
    views: 2500,
    demoUrl: "https://ai-chat-assistant.demo.com",
    githubUrl: "https://github.com/sarahchen/ai-chat-assistant",
    images: [
      "https://images.unsplash.com/photo-1763182198113-a9a8d0fe3144?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1763669029223-74f911a9e08b?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1731286446855-c0bd3d23af46?w=900&auto=format&fit=crop&q=60",
    ],
    createdAt: "2024-10-15",
    tags: ["ai", "chatbot", "customer-support"],
    members: [
      {
        name: "Sarah Chen",
        image: "https://randomuser.me/api/portraits/women/11.jpg",
      },
      {
        name: "Alex Park",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        name: "Jordan Lee",
        image: "https://randomuser.me/api/portraits/men/54.jpg",
      },
      {
        name: "Emma Davis",
        image: "https://randomuser.me/api/portraits/women/78.jpg",
      },
    ],
    roadmap: [
      "Phase 1: GPT-3 Integration",
      "Phase 2: Conversation History",
      "Phase 3: Multi-language Support",
      "Phase 4: Production Deployment",
    ],
    duration: "3 months",
    course: "Advanced AI & Machine Learning",
  },

  {
    id: 2,
    title: "Mobile Fitness App",
    description: "Track workouts, nutrition, and health metrics on the go.",
    semester: "Fall 2024",
    author: {
      name: "Alex Rodriguez",
      avatar: "https://randomuser.me/api/portraits/men/21.jpg",
      program: "Mobile Development",
      year: "3rd Year",
    },
    technologies: ["React Native", "Firebase", "Redux", "HealthKit"],
    category: "Mobile Development",
    status: "In Progress",
    featured: false,
    likes: 256,
    views: 1800,
    demoUrl: "https://fitness-app.demo.com",
    githubUrl: "https://github.com/arodriguez/fitness-app",
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&fit=crop",
      "https://images.unsplash.com/photo-1763854492937-fb7ae2f601f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1763667309360-30d7e3779382?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
    ],
    createdAt: "2024-09-22",
    tags: ["fitness", "mobile", "health"],
    members: [
      {
        name: "Alex Rodriguez",
        image: "https://randomuser.me/api/portraits/men/21.jpg",
      },
      {
        name: "Maria Garcia",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
      },
      {
        name: "Sam Wilson",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
      },
    ],
    roadmap: [
      "Phase 1: Core Features",
      "Phase 2: Social Integration",
      "Phase 3: Wearable Sync",
      "Phase 4: Launch",
    ],
    duration: "4 months",
    course: "Mobile App Development",
  },

  {
    id: 3,
    title: "E-Commerce Platform",
    description:
      "Full-stack online store with payment integration and analytics.",
    semester: "Summer 2024",
    author: {
      name: "Priya Patel",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg",
      program: "Web Development",
      year: "4th Year",
    },
    technologies: ["Next.js", "Stripe", "PostgreSQL", "Tailwind", "Vercel"],
    category: "Web Development",
    status: "Completed",
    featured: true,
    likes: 489,
    views: 3200,
    demoUrl: "https://ecommerce-platform.demo.com",
    githubUrl: "https://github.com/ppatel/ecommerce-platform",
    images: [
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&fit=crop",
    ],
    createdAt: "2024-08-10",
    tags: ["ecommerce", "payment", "analytics"],
    members: [
      {
        name: "Priya Patel",
        image: "https://randomuser.me/api/portraits/women/90.jpg",
      },
      {
        name: "David Chen",
        image: "https://randomuser.me/api/portraits/men/34.jpg",
      },
      {
        name: "Lisa Brown",
        image: "https://randomuser.me/api/portraits/women/23.jpg",
      },
      {
        name: "Tom Anderson",
        image: "https://randomuser.me/api/portraits/men/56.jpg",
      },
      {
        name: "Sarah White",
        image: "https://randomuser.me/api/portraits/women/12.jpg",
      },
    ],
    roadmap: [
      "Phase 1: Product Catalog",
      "Phase 2: Payment Integration",
      "Phase 3: Analytics Dashboard",
      "Phase 4: Production Launch",
    ],
    duration: "6 months",
    course: "Full Stack Web Development",
  },

  {
    id: 4,
    title: "Climate Monitoring IoT",
    description: "IoT sensors and dashboard for environmental monitoring.",
    semester: "Spring 2024",
    author: {
      name: "Jordan Kim",
      avatar: "https://randomuser.me/api/portraits/men/88.jpg",
      program: "Environmental Science",
      year: "4th Year",
    },
    technologies: ["Arduino", "Node.js", "MQTT", "Chart.js", "Raspberry Pi"],
    category: "Environmental Tech",
    status: "Completed",
    featured: false,
    likes: 178,
    views: 1200,
    demoUrl: "https://climate-iot.demo.com",
    githubUrl: "https://github.com/jkim/climate-iot",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&fit=crop",
      "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVjaGFuaWNzfGVufDB8fDB8fHww",
    ],
    createdAt: "2024-05-20",
    tags: ["iot", "environment", "sensors"],
    members: [
      {
        name: "Jordan Kim",
        image: "https://randomuser.me/api/portraits/men/88.jpg",
      },
      {
        name: "Nina Patel",
        image: "https://randomuser.me/api/portraits/women/41.jpg",
      },
      {
        name: "Chris Lee",
        image: "https://randomuser.me/api/portraits/men/25.jpg",
      },
    ],
    roadmap: [
      "Phase 1: Sensor Setup",
      "Phase 2: Data Collection",
      "Phase 3: Dashboard",
      "Phase 4: Deployment",
    ],
    duration: "5 months",
    course: "IoT & Environmental Tech",
  },

  {
    id: 5,
    title: "Machine Learning Pipeline",
    description: "Automated data processing and model training framework.",
    semester: "Spring 2024",
    author: {
      name: "Emma Watson",
      avatar: "https://randomuser.me/api/portraits/women/16.jpg",
      program: "Data Science",
      year: "4th Year",
    },
    technologies: ["Python", "TensorFlow", "Docker", "Airflow", "MLflow"],
    category: "Artificial Intelligence",
    status: "Completed",
    featured: false,
    likes: 312,
    views: 2100,
    demoUrl: "https://ml-pipeline.demo.com",
    githubUrl: "https://github.com/ewatson/ml-pipeline",
    images: [
      "https://plus.unsplash.com/premium_photo-1664701474750-e3b51072957e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&fit=crop",
      "https://images.unsplash.com/photo-1577918248023-62b9a2748a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
    ],
    createdAt: "2024-04-15",
    tags: ["machine-learning", "automation", "data-processing"],
    members: [
      {
        name: "Emma Watson",
        image: "https://randomuser.me/api/portraits/women/16.jpg",
      },
      {
        name: "Robert Chang",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
      },
      {
        name: "Maya Singh",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
      },
      {
        name: "James Miller",
        image: "https://randomuser.me/api/portraits/men/44.jpg",
      },
    ],
    roadmap: [
      "Phase 1: Pipeline Architecture",
      "Phase 2: Data Processing",
      "Phase 3: Model Training",
      "Phase 4: Deployment",
    ],
    duration: "5 months",
    course: "Machine Learning Systems",
  },

  {
    id: 6,
    title: "Social Media Dashboard",
    description: "Manage and monitor multiple social accounts in one place.",
    semester: "Fall 2023",
    author: {
      name: "Mike Johnson",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      program: "Web Development",
      year: "3rd Year",
    },
    technologies: ["Vue.js", "Express", "OAuth", "MongoDB", "Socket.io"],
    category: "Web Development",
    status: "Completed",
    featured: false,
    likes: 142,
    views: 890,
    demoUrl: "https://social-dashboard.demo.com",
    githubUrl: "https://github.com/mjohnson/social-dashboard",
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
      "https://plus.unsplash.com/premium_photo-1661764256397-af154e87b1b3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    createdAt: "2023-11-08",
    tags: ["social-media", "dashboard", "analytics"],
    members: [
      {
        name: "Mike Johnson",
        image: "https://randomuser.me/api/portraits/men/11.jpg",
      },
      {
        name: "Jessica Lee",
        image: "https://randomuser.me/api/portraits/women/29.jpg",
      },
      {
        name: "Kevin Chen",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
      },
    ],
    roadmap: [
      "Phase 1: OAuth Integration",
      "Phase 2: Multi-platform Support",
      "Phase 3: Analytics",
      "Phase 4: Launch",
    ],
    duration: "4 months",
    course: "Advanced Web Applications",
  },

  {
    id: 7,
    title: "Data Analytics Platform",
    description: "Real-time data visualization and reporting tool.",
    semester: "Summer 2023",
    author: {
      name: "Lisa Wong",
      avatar: "https://randomuser.me/api/portraits/women/18.jpg",
      program: "Data Science",
      year: "4th Year",
    },
    technologies: ["D3.js", "React", "Python", "Pandas", "PostgreSQL"],
    category: "Data Science",
    status: "Completed",
    featured: false,
    likes: 201,
    views: 1500,
    demoUrl: "https://analytics-platform.demo.com",
    githubUrl: "https://github.com/lwong/analytics-platform",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1c2luZXNzfGVufDB8fDB8fHww",
    ],
    createdAt: "2023-08-15",
    tags: ["data-viz", "analytics", "reporting"],
    members: [
      {
        name: "Lisa Wong",
        image: "https://randomuser.me/api/portraits/women/18.jpg",
      },
      {
        name: "Marcus Johnson",
        image: "https://randomuser.me/api/portraits/men/24.jpg",
      },
      {
        name: "Patricia Green",
        image: "https://randomuser.me/api/portraits/women/53.jpg",
      },
      {
        name: "Daniel White",
        image: "https://randomuser.me/api/portraits/men/36.jpg",
      },
    ],
    roadmap: [
      "Phase 1: Data Connectors",
      "Phase 2: Visualization Engine",
      "Phase 3: Report Builder",
      "Phase 4: Production",
    ],
    duration: "5 months",
    course: "Data Visualization & Analytics",
  },

  // Additional projects for pagination testing
  {
    id: 8,
    title: "IoT Home Automation",
    description:
      "Smart home system controlling lights, temperature, and security using IoT sensors and mobile app integration.",
    semester: "Spring 2024",
    author: {
      name: "David Park",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      program: "Electrical Engineering",
      year: "4th Year",
    },
    technologies: ["Arduino", "React Native", "Node.js", "MQTT", "Firebase"],
    category: "IoT",
    status: "Completed",
    featured: true,
    likes: 198,
    views: 1650,
    demoUrl: "https://iot-home.demo.com",
    githubUrl: "https://github.com/dpark/iot-home",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&auto=format&fit=crop&q=60",
    ],
    createdAt: "2024-05-20",
    tags: ["iot", "automation", "smart-home"],
    members: [
      {
        name: "David Park",
        image: "https://randomuser.me/api/portraits/men/41.jpg",
      },
      {
        name: "Sophie Chen",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
      },
    ],
    duration: "4 months",
    course: "IoT Systems Design",
  },

  {
    id: 9,
    title: "Blockchain Voting System",
    description:
      "Secure and transparent voting platform built on Ethereum blockchain ensuring vote integrity and anonymity.",
    semester: "Fall 2023",
    author: {
      name: "Michael Torres",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      program: "Computer Science",
      year: "4th Year",
    },
    technologies: ["Solidity", "Web3.js", "React", "Ethereum", "IPFS"],
    category: "Blockchain",
    status: "Completed",
    featured: false,
    likes: 287,
    views: 2100,
    demoUrl: "https://blockchain-voting.demo.com",
    githubUrl: "https://github.com/mtorres/blockchain-voting",
    images: [
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60",
    ],
    createdAt: "2023-12-10",
    tags: ["blockchain", "voting", "ethereum"],
    members: [
      {
        name: "Michael Torres",
        image: "https://randomuser.me/api/portraits/men/55.jpg",
      },
      {
        name: "Anna Kim",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
      },
      {
        name: "James Wilson",
        image: "https://randomuser.me/api/portraits/men/29.jpg",
      },
    ],
    duration: "6 months",
    course: "Distributed Systems",
  },

  {
    id: 10,
    title: "AR Shopping Experience",
    description:
      "Augmented reality mobile app allowing users to virtually try products before purchasing online.",
    semester: "Spring 2024",
    author: {
      name: "Rachel Green",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      program: "Interactive Media",
      year: "3rd Year",
    },
    technologies: ["Unity", "ARCore", "C#", "Firebase", "Blender"],
    category: "Augmented Reality",
    status: "In Progress",
    featured: true,
    likes: 234,
    views: 1890,
    demoUrl: "https://ar-shopping.demo.com",
    githubUrl: "https://github.com/rgreen/ar-shopping",
    images: [
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format&fit=crop&q=60",
    ],
    createdAt: "2024-03-15",
    tags: ["ar", "shopping", "mobile"],
    members: [
      {
        name: "Rachel Green",
        image: "https://randomuser.me/api/portraits/women/67.jpg",
      },
      {
        name: "Oliver Brown",
        image: "https://randomuser.me/api/portraits/men/38.jpg",
      },
    ],
    duration: "5 months",
    course: "AR/VR Development",
  },

  {
    id: 11,
    title: "Machine Learning Stock Predictor",
    description:
      "AI-powered platform that analyzes market trends and predicts stock prices using multiple ML algorithms.",
    semester: "Fall 2024",
    author: {
      name: "Kevin Liu",
      avatar: "https://randomuser.me/api/portraits/men/72.jpg",
      program: "Data Science",
      year: "4th Year",
    },
    technologies: ["Python", "TensorFlow", "Pandas", "Django", "PostgreSQL"],
    category: "Machine Learning",
    status: "Completed",
    featured: false,
    likes: 412,
    views: 3200,
    demoUrl: "https://ml-stocks.demo.com",
    githubUrl: "https://github.com/kliu/ml-stock-predictor",
    images: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=60",
    ],
    createdAt: "2024-11-05",
    tags: ["ml", "stocks", "prediction"],
    members: [
      {
        name: "Kevin Liu",
        image: "https://randomuser.me/api/portraits/men/72.jpg",
      },
      {
        name: "Isabella Garcia",
        image: "https://randomuser.me/api/portraits/women/28.jpg",
      },
      {
        name: "Thomas Anderson",
        image: "https://randomuser.me/api/portraits/men/47.jpg",
      },
    ],
    duration: "4 months",
    course: "Advanced Machine Learning",
  },

  {
    id: 12,
    title: "Social Media Analytics Dashboard",
    description:
      "Comprehensive dashboard analyzing social media engagement across multiple platforms with real-time insights.",
    semester: "Spring 2024",
    author: {
      name: "Amanda Johnson",
      avatar: "https://randomuser.me/api/portraits/women/89.jpg",
      program: "Marketing Technology",
      year: "3rd Year",
    },
    technologies: ["Vue.js", "D3.js", "Node.js", "MongoDB", "Redis"],
    category: "Data Analytics",
    status: "Completed",
    featured: false,
    likes: 178,
    views: 1420,
    demoUrl: "https://social-analytics.demo.com",
    githubUrl: "https://github.com/ajohnson/social-analytics",
    images: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60",
    ],
    createdAt: "2024-06-12",
    tags: ["analytics", "social-media", "dashboard"],
    members: [
      {
        name: "Amanda Johnson",
        image: "https://randomuser.me/api/portraits/women/89.jpg",
      },
      {
        name: "Ryan Murphy",
        image: "https://randomuser.me/api/portraits/men/63.jpg",
      },
    ],
    duration: "3 months",
    course: "Digital Marketing Analytics",
  },

  {
    id: 13,
    title: "Virtual Classroom Platform",
    description:
      "Interactive online learning platform with video conferencing, whiteboard, and collaborative tools for remote education.",
    semester: "Fall 2024",
    author: {
      name: "Jennifer Walsh",
      avatar: "https://randomuser.me/api/portraits/women/42.jpg",
      program: "Educational Technology",
      year: "4th Year",
    },
    technologies: ["React", "WebRTC", "Socket.io", "Express", "AWS"],
    category: "EdTech",
    status: "In Progress",
    featured: true,
    likes: 298,
    views: 2350,
    demoUrl: "https://virtual-classroom.demo.com",
    githubUrl: "https://github.com/jwalsh/virtual-classroom",
    images: [
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
    ],
    createdAt: "2024-09-18",
    tags: ["education", "video-conference", "collaboration"],
    members: [
      {
        name: "Jennifer Walsh",
        image: "https://randomuser.me/api/portraits/women/42.jpg",
      },
      {
        name: "Carlos Mendez",
        image: "https://randomuser.me/api/portraits/men/51.jpg",
      },
      {
        name: "Grace Taylor",
        image: "https://randomuser.me/api/portraits/women/76.jpg",
      },
    ],
    duration: "6 months",
    course: "Educational Technology Design",
  },

  {
    id: 14,
    title: "Cryptocurrency Trading Bot",
    description:
      "Automated trading bot using technical analysis indicators and risk management strategies for cryptocurrency markets.",
    semester: "Spring 2024",
    author: {
      name: "Brian Cooper",
      avatar: "https://randomuser.me/api/portraits/men/84.jpg",
      program: "Financial Engineering",
      year: "4th Year",
    },
    technologies: ["Python", "Pandas", "Binance API", "PostgreSQL", "Docker"],
    category: "FinTech",
    status: "Completed",
    featured: false,
    likes: 356,
    views: 2780,
    demoUrl: "https://crypto-bot.demo.com",
    githubUrl: "https://github.com/bcooper/crypto-trading-bot",
    images: [
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=500&auto=format&fit=crop&q=60",
    ],
    createdAt: "2024-04-22",
    tags: ["crypto", "trading", "automation"],
    members: [
      {
        name: "Brian Cooper",
        image: "https://randomuser.me/api/portraits/men/84.jpg",
      },
      {
        name: "Maya Patel",
        image: "https://randomuser.me/api/portraits/women/91.jpg",
      },
    ],
    duration: "3 months",
    course: "Algorithmic Trading",
  },

  {
    id: 15,
    title: "Weather Prediction API",
    description:
      "RESTful API service providing accurate weather forecasts using machine learning models trained on historical data.",
    semester: "Fall 2023",
    author: {
      name: "Nicole Zhang",
      avatar: "https://randomuser.me/api/portraits/women/15.jpg",
      program: "Meteorology & CS",
      year: "4th Year",
    },
    technologies: ["Python", "FastAPI", "Scikit-learn", "Redis", "Docker"],
    category: "APIs",
    status: "Completed",
    featured: false,
    likes: 145,
    views: 1230,
    demoUrl: "https://weather-api.demo.com",
    githubUrl: "https://github.com/nzhang/weather-prediction-api",
    images: [
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?w=500&auto=format&fit=crop&q=60",
    ],
    createdAt: "2023-11-28",
    tags: ["api", "weather", "prediction"],
    members: [
      {
        name: "Nicole Zhang",
        image: "https://randomuser.me/api/portraits/women/15.jpg",
      },
      {
        name: "Eric Kim",
        image: "https://randomuser.me/api/portraits/men/27.jpg",
      },
    ],
    duration: "4 months",
    course: "Applied Meteorology",
  },

  {
    id: 16,
    title: "VR Museum Experience",
    description:
      "Immersive virtual reality application allowing users to explore historical artifacts and art collections from around the world.",
    semester: "Spring 2024",
    author: {
      name: "Marco Silva",
      avatar: "https://randomuser.me/api/portraits/men/19.jpg",
      program: "Digital Arts",
      year: "3rd Year",
    },
    technologies: ["Unity", "C#", "Oculus SDK", "Photon", "Blender"],
    category: "Virtual Reality",
    status: "In Progress",
    featured: true,
    likes: 267,
    views: 1950,
    demoUrl: "https://vr-museum.demo.com",
    githubUrl: "https://github.com/msilva/vr-museum",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&auto=format&fit=crop&q=60",
    ],
    createdAt: "2024-02-14",
    tags: ["vr", "museum", "education"],
    members: [
      {
        name: "Marco Silva",
        image: "https://randomuser.me/api/portraits/men/19.jpg",
      },
      {
        name: "Luna Rodriguez",
        image: "https://randomuser.me/api/portraits/women/56.jpg",
      },
      {
        name: "Alex Thompson",
        image: "https://randomuser.me/api/portraits/men/31.jpg",
      },
    ],
    duration: "5 months",
    course: "Immersive Media Design",
  },

  {
    id: 17,
    title: "Smart Parking System",
    description:
      "IoT-based parking management system with real-time space detection, mobile app booking, and payment integration.",
    semester: "Fall 2024",
    author: {
      name: "Samantha Lee",
      avatar: "https://randomuser.me/api/portraits/women/23.jpg",
      program: "Urban Planning & Tech",
      year: "4th Year",
    },
    technologies: [
      "React Native",
      "Node.js",
      "IoT Sensors",
      "MongoDB",
      "Stripe",
    ],
    category: "Smart Cities",
    status: "Completed",
    featured: false,
    likes: 189,
    views: 1567,
    demoUrl: "https://smart-parking.demo.com",
    githubUrl: "https://github.com/slee/smart-parking",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&auto=format&fit=crop&q=60",
    ],
    createdAt: "2024-10-30",
    tags: ["iot", "parking", "smart-city"],
    members: [
      {
        name: "Samantha Lee",
        image: "https://randomuser.me/api/portraits/women/23.jpg",
      },
      {
        name: "Diego Martinez",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
      },
    ],
    duration: "4 months",
    course: "Smart Cities Technology",
  },
];

export default projectsData;
