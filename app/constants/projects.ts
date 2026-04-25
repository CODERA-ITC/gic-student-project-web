import type { Project } from "~/utils/Interfaces";
// export const projectsData: Project[] = [
//   {
//     id: "1",
//     name: "AI Chat Assistant",
//     description:
//       "An intelligent chatbot powered by GPT-3 for customer support. This project aims to enhance user experience by providing instant and accurate responses to common inquiries.",
//     academicYear: "2024-2025",
//     author: {
//       id: "1",
//       name: "Mr. Test",
//       avatar: "https://randomuser.me/api/portraits/women/50.jpg",
//       program: "Computer Science",
//       year: "4th Year",
//     },
//     technologies: ["Python", "GPT-3", "React", "Node.js", "MongoDB"],
//     category: "Artificial Intelligence",
//     status: "Completed",
//     featured: true,
//     likes: 342,
//     views: 2500,
//     demoUrl: "https://ai-chat-assistant.demo.com",
//     githubUrl: "https://github.com/sarahchen/ai-chat-assistant",
//     images: [
//       {
//         id: "1234",
//         originalUrl: `https://www.pixeden.com/media/k2/galleries/856/001-screen-showcase-landing-page-devices-presentation-web-psd-projects.jpg`,
//         thumbnailUrl: `https://www.pixeden.com/media/k2/galleries/856/001-screen-showcase-landing-page-devices-presentation-web-psd-projects.jpg`,
//       },
//       {
//         id: "1235",
//         originalUrl: `https://img.freepik.com/free-photo/elegant-cozy-office-lifestyle_23-2149636247.jpg?semt=ais_user_personalization&w=740&q=80`,
//         thumbnailUrl: `https://img.freepik.com/free-photo/elegant-cozy-office-lifestyle_23-2149636247.jpg?semt=ais_user_personalization&w=740&q=80`,
//       },
//     ],
//     createdAt: "2024-10-15",
//     tags: ["ai", "chatbot", "customer-support"],
//     members: [
//       {
//         name: "Sarah Chen",
//         image: "https://randomuser.me/api/portraits/women/11.jpg",
//       },
//       {
//         name: "Alex Park",
//         image: "https://randomuser.me/api/portraits/men/32.jpg",
//       },
//       {
//         name: "Jordan Lee",
//         image: "https://randomuser.me/api/portraits/men/54.jpg",
//       },
//       {
//         name: "Emma Davis",
//         image: "https://randomuser.me/api/portraits/women/78.jpg",
//       },
//     ],
//     features: [
//       {
//         date: "Sep 1, 2024",
//         name: "GPT-3 Integration",
//         description:
//           "Set up GPT-3 API integration and basic chatbot framework with Python backend.",
//         icon: "i-lucide-brain",
//         status: "done",
//       },
//       {
//         date: "Sep 15, 2024",
//         name: "Conversation History",
//         description:
//           "Implemented conversation persistence and user session management with MongoDB.",
//         icon: "i-lucide-message-circle",
//         status: "ongoing",
//       },
//       {
//         date: "Oct 1, 2024",
//         name: "Multi-language Support",
//         description:
//           "Added support for multiple languages and improved response accuracy.",
//         icon: "i-lucide-globe",
//         status: "pending",
//       },
//       {
//         date: "Oct 15, 2024",
//         name: "Production Deployment",
//         description:
//           "Successfully deployed to production with monitoring and analytics dashboard.",
//         icon: "i-lucide-rocket",
//         status: "done",
//       },
//     ],
//     duration: "3 months",
//     course: "Advanced AI & Machine Learning",
//     visibility: "public",
//   },
//   {
//     id: "2",
//     name: "Mobile Fitness App",
//     description: "Track workouts, nutrition, and health metrics on the go.",
//     academicYear: "2024-2025",
//     author: {
//       id: "2",
//       name: "Mr. Test",
//       avatar: "https://randomuser.me/api/portraits/women/50.jpg",
//       program: "Computer Science",
//       year: "4th Year",
//     },
//     technologies: ["React Native", "Firebase", "Redux", "HealthKit"],
//     category: "Mobile Development",
//     status: "In Progress",
//     featured: false,
//     likes: 256,
//     views: 1800,
//     demoUrl: "https://fitness-app.demo.com",
//     githubUrl: "https://github.com/arodriguez/fitness-app",
//     images: [
//       {
//         id: "img1",
//         originalUrl:
//           "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&fit=crop",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&fit=crop",
//       },
//       {
//         id: "img2",
//         originalUrl:
//           "https://images.unsplash.com/photo-1763854492937-fb7ae2f601f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1763854492937-fb7ae2f601f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D",
//       },
//       {
//         id: "img3",
//         originalUrl:
//           "https://images.unsplash.com/photo-1763667309360-30d7e3779382?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1763667309360-30d7e3779382?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
//       },
//     ],
//     createdAt: "2024-09-22",
//     tags: ["fitness", "mobile", "health"],
//     members: [
//       {
//         name: "Alex Rodriguez",
//         image: "https://randomuser.me/api/portraits/men/21.jpg",
//       },
//       {
//         name: "Maria Garcia",
//         image: "https://randomuser.me/api/portraits/women/45.jpg",
//       },
//       {
//         name: "Sam Wilson",
//         image: "https://randomuser.me/api/portraits/men/67.jpg",
//       },
//     ],
//     features: [
//       {
//         date: "Aug 20, 2024",
//         name: "Core Features",
//         description:
//           "Developed workout tracking, nutrition logging, and health metrics dashboard.",
//         icon: "i-lucide-activity",
//         status: "done",
//       },
//       {
//         date: "Sep 10, 2024",
//         name: "Social Integration",
//         description:
//           "Added friend connections, workout sharing, and community challenges.",
//         icon: "i-lucide-users",
//         status: "done",
//       },
//       {
//         date: "Oct 5, 2024",
//         name: "Wearable Sync",
//         description:
//           "Integrated with HealthKit and popular fitness wearables for automatic data sync.",
//         icon: "i-lucide-watch",
//         status: "ongoing",
//       },
//       {
//         date: "Nov 1, 2024",
//         name: "Launch",
//         description:
//           "Final testing, app store submission, and public launch preparation.",
//         icon: "i-lucide-rocket",
//         status: "pending",
//       },
//     ],
//     duration: "4 months",
//     course: "Mobile App Development",
//     visibility: "public",
//   },
//   {
//     id: "3",
//     name: "E-Commerce Platform",
//     description:
//       "Full-stack online store with payment integration and analytics.",
//     academicYear: "2024-2025",
//     author: {
//       id: "3",
//       name: "Mr. Test",
//       avatar: "https://randomuser.me/api/portraits/women/50.jpg",
//       program: "Computer Science",
//       year: "4th Year",
//     },
//     technologies: ["Next.js", "Stripe", "PostgreSQL", "Tailwind", "Vercel"],
//     category: "Web Development",
//     status: "Completed",
//     featured: true,
//     likes: 489,
//     views: 3200,
//     demoUrl: "https://ecommerce-platform.demo.com",
//     githubUrl: "https://github.com/ppatel/ecommerce-platform",
//     images: [
//       {
//         id: "img1",
//         originalUrl:
//           "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&fit=crop",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&fit=crop",
//       },
//       {
//         id: "img2",
//         originalUrl:
//           "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&fit=crop",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&fit=crop",
//       },
//       {
//         id: "img3",
//         originalUrl:
//           "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&fit=crop",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&fit=crop",
//       },
//     ],
//     createdAt: "2024-08-10",
//     tags: ["ecommerce", "payment", "analytics"],
//     members: [
//       {
//         name: "Priya Patel",
//         image: "https://randomuser.me/api/portraits/women/90.jpg",
//       },
//       {
//         name: "David Chen",
//         image: "https://randomuser.me/api/portraits/men/34.jpg",
//       },
//       {
//         name: "Lisa Brown",
//         image: "https://randomuser.me/api/portraits/women/23.jpg",
//       },
//       {
//         name: "Tom Anderson",
//         image: "https://randomuser.me/api/portraits/men/56.jpg",
//       },
//       {
//         name: "Sarah White",
//         image: "https://randomuser.me/api/portraits/women/12.jpg",
//       },
//     ],
//     features: [
//       {
//         date: "May 1, 2024",
//         name: "Product Catalog",
//         description:
//           "Built product management system with categories, search, and inventory tracking.",
//         icon: "i-lucide-package",
//         status: "done",
//       },
//       {
//         date: "Jun 15, 2024",
//         name: "Payment Integration",
//         description:
//           "Integrated Stripe payment processing with cart management and order flow.",
//         icon: "i-lucide-credit-card",
//         status: "done",
//       },
//       {
//         date: "Jul 20, 2024",
//         name: "Analytics Dashboard",
//         description:
//           "Developed admin dashboard with sales analytics, user insights, and reporting.",
//         icon: "i-lucide-bar-chart",
//         status: "done",
//       },
//       {
//         date: "Aug 10, 2024",
//         name: "Production Launch",
//         description:
//           "Deployed to production with monitoring, security hardening, and performance optimization.",
//         icon: "i-lucide-globe",
//         status: "done",
//       },
//     ],
//     duration: "6 months",
//     course: "Full Stack Web Development",
//     visibility: "public",
//   },

//   {
//     id: "4",
//     name: "Climate Monitoring IoT",
//     description: "IoT sensors and dashboard for environmental monitoring.",
//     academicYear: "2024-2025",
//     author: {
//       id: "4",
//       name: "Jordan Kim",
//       avatar: "https://randomuser.me/api/portraits/men/88.jpg",
//       program: "Environmental Science",
//       year: "4th Year",
//     },
//     technologies: ["Arduino", "Node.js", "MQTT", "Chart.js", "Raspberry Pi"],
//     category: "Environmental Tech",
//     status: "Completed",
//     featured: false,
//     likes: 178,
//     views: 1200,
//     demoUrl: "https://climate-iot.demo.com",
//     githubUrl: "https://github.com/jkim/climate-iot",
//     images: [
//       {
//         id: "img1",
//         originalUrl:
//           "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop",
//       },
//       {
//         id: "img2",
//         originalUrl:
//           "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&fit=crop",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&fit=crop",
//       },
//       {
//         id: "img3",
//         originalUrl:
//           "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVjaGFuaWNzfGVufDB8fDB8fHww",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVjaGFuaWNzfGVufDB8fDB8fHww",
//       },
//     ],
//     createdAt: "2024-05-20",
//     tags: ["iot", "environment", "sensors"],
//     members: [
//       {
//         name: "Jordan Kim",
//         image: "https://randomuser.me/api/portraits/men/88.jpg",
//       },
//       {
//         name: "Nina Patel",
//         image: "https://randomuser.me/api/portraits/women/41.jpg",
//       },
//       {
//         name: "Chris Lee",
//         image: "https://randomuser.me/api/portraits/men/25.jpg",
//       },
//     ],
//     features: [
//       {
//         date: "Feb 1, 2024",
//         name: "Sensor Setup",
//         description:
//           "Deployed IoT sensors for temperature, humidity, and air quality monitoring.",
//         icon: "i-lucide-thermometer",
//         status: "done",
//       },
//       {
//         date: "Mar 15, 2024",
//         name: "Data Collection",
//         description:
//           "Implemented data aggregation system with real-time sensor data streaming.",
//         icon: "i-lucide-database",
//         status: "done",
//       },
//       {
//         date: "Apr 20, 2024",
//         name: "Dashboard",
//         description:
//           "Built interactive dashboard with data visualization and alert system.",
//         icon: "i-lucide-monitor",
//         status: "ongoing",
//       },
//       {
//         date: "May 30, 2024",
//         name: "Deployment",
//         description:
//           "System deployment and integration with environmental monitoring networks.",
//         icon: "i-lucide-cloud",
//         status: "pending",
//       },
//     ],
//     duration: "5 months",
//     course: "IoT & Environmental Tech",
//     visibility: "private",
//   },

//   {
//     id: "5",
//     name: "Machine Learning Pipeline",
//     description: "Automated data processing and model training framework.",
//     academicYear: "2024-2025",
//     author: {
//       id: "5",
//       name: "Emma Watson",
//       avatar: "https://randomuser.me/api/portraits/women/16.jpg",
//       program: "Data Science",
//       year: "4th Year",
//     },
//     technologies: ["Python", "TensorFlow", "Docker", "Airflow", "MLflow"],
//     category: "Artificial Intelligence",
//     status: "Completed",
//     featured: false,
//     likes: 312,
//     views: 2100,
//     demoUrl: "https://ml-pipeline.demo.com",
//     githubUrl: "https://github.com/ewatson/ml-pipeline",
//     images: [
//       {
//         id: "img1",
//         originalUrl:
//           "https://plus.unsplash.com/premium_photo-1664701474750-e3b51072957e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
//         thumbnailUrl:
//           "https://plus.unsplash.com/premium_photo-1664701474750-e3b51072957e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
//       },
//       {
//         id: "img2",
//         originalUrl:
//           "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&fit=crop",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&fit=crop",
//       },
//       {
//         id: "img3",
//         originalUrl:
//           "https://images.unsplash.com/photo-1577918248023-62b9a2748a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1577918248023-62b9a2748a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
//       },
//     ],
//     createdAt: "2024-04-15",
//     tags: ["machine-learning", "automation", "data-processing"],
//     members: [
//       {
//         name: "Emma Watson",
//         image: "https://randomuser.me/api/portraits/women/16.jpg",
//       },
//       {
//         name: "Robert Chang",
//         image: "https://randomuser.me/api/portraits/men/52.jpg",
//       },
//       {
//         name: "Maya Singh",
//         image: "https://randomuser.me/api/portraits/women/33.jpg",
//       },
//       {
//         name: "James Miller",
//         image: "https://randomuser.me/api/portraits/men/44.jpg",
//       },
//     ],
//     features: [
//       {
//         date: "Jan 15, 2024",
//         name: "Pipeline Architecture",
//         description:
//           "Designed scalable ML pipeline architecture using Apache Airflow and Docker.",
//         icon: "i-lucide-git-branch",
//         status: "done",
//       },
//       {
//         date: "Feb 20, 2024",
//         name: "Data Processing",
//         description:
//           "Implemented automated data cleaning, validation, and feature engineering modules.",
//         icon: "i-lucide-filter",
//         status: "done",
//       },
//       {
//         date: "Mar 25, 2024",
//         name: "Model Training",
//         description:
//           "Built automated model training with hyperparameter tuning and validation.",
//         icon: "i-lucide-brain",
//         status: "done",
//       },
//       {
//         date: "Apr 30, 2024",
//         name: "Deployment",
//         description:
//           "Deployed ML pipeline to production with monitoring and automated retraining.",
//         icon: "i-lucide-server",
//         status: "done",
//       },
//     ],
//     duration: "5 months",
//     course: "Machine Learning Systems",
//     visibility: "public",
//   },

//   {
//     id: "6",
//     name: "Social Media Dashboard",
//     description: "Manage and monitor multiple social accounts in one place.",
//     academicYear: "2024-2025",
//     author: {
//       id: "6",
//       name: "Mike Johnson",
//       avatar: "https://randomuser.me/api/portraits/men/11.jpg",
//       program: "Web Development",
//       year: "3rd Year",
//     },
//     technologies: ["Vue.js", "Express", "OAuth", "MongoDB", "Socket.io"],
//     category: "Web Development",
//     status: "Completed",
//     featured: false,
//     likes: 142,
//     views: 890,
//     demoUrl: "https://social-dashboard.demo.com",
//     githubUrl: "https://github.com/mjohnson/social-dashboard",
//     images: [
//       {
//         id: "img1",
//         originalUrl:
//           "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       },
//       {
//         id: "img2",
//         originalUrl:
//           "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
//       },
//       {
//         id: "img3",
//         originalUrl:
//           "https://plus.unsplash.com/premium_photo-1661764256397-af154e87b1b3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         thumbnailUrl:
//           "https://plus.unsplash.com/premium_photo-1661764256397-af154e87b1b3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       },
//     ],
//     createdAt: "2023-11-08",
//     tags: ["social-media", "dashboard", "analytics"],
//     members: [
//       {
//         name: "Mike Johnson",
//         image: "https://randomuser.me/api/portraits/men/11.jpg",
//       },
//       {
//         name: "Jessica Lee",
//         image: "https://randomuser.me/api/portraits/women/29.jpg",
//       },
//       {
//         name: "Kevin Chen",
//         image: "https://randomuser.me/api/portraits/men/75.jpg",
//       },
//     ],
//     features: [
//       {
//         date: "Aug 1, 2023",
//         name: "OAuth Integration",
//         description:
//           "Implemented OAuth authentication for major social media platforms.",
//         icon: "i-lucide-key",
//         status: "done",
//       },
//       {
//         date: "Sep 15, 2023",
//         name: "Multi-platform Support",
//         description:
//           "Added support for Twitter, Facebook, Instagram, and LinkedIn APIs.",
//         icon: "i-lucide-share-2",
//         status: "done",
//       },
//       {
//         date: "Oct 20, 2023",
//         name: "Analytics",
//         description:
//           "Built engagement analytics and performance tracking dashboard.",
//         icon: "i-lucide-trending-up",
//         status: "done",
//       },
//       {
//         date: "Nov 30, 2023",
//         name: "Launch",
//         description:
//           "Public launch with user onboarding and customer support system.",
//         icon: "i-lucide-rocket",
//         status: "done",
//       },
//     ],
//     duration: "4 months",
//     course: "Advanced Web Applications",
//     visibility: "public",
//   },

//   {
//     id: "7",
//     name: "Data Analytics Platform",
//     description: "Real-time data visualization and reporting tool.",
//     academicYear: "2024-2025",
//     author: {
//       id: "7",
//       name: "Lisa Wong",
//       avatar: "https://randomuser.me/api/portraits/women/18.jpg",
//       program: "Data Science",
//       year: "4th Year",
//     },
//     technologies: ["D3.js", "React", "Python", "Pandas", "PostgreSQL"],
//     category: "Data Science",
//     status: "Completed",
//     featured: false,
//     likes: 201,
//     views: 1500,
//     demoUrl: "https://analytics-platform.demo.com",
//     githubUrl: "https://github.com/lwong/analytics-platform",
//     images: [
//       {
//         id: "img1",
//         originalUrl:
//           "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
//       },
//       {
//         id: "img2",
//         originalUrl:
//           "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzfGVufDB8fDB8fHww",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzfGVufDB8fDB8fHww",
//       },
//       {
//         id: "img3",
//         originalUrl:
//           "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1c2luZXNzfGVufDB8fDB8fHww",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1c2luZXNzfGVufDB8fDB8fHww",
//       },
//     ],
//     createdAt: "2023-08-15",
//     tags: ["data-viz", "analytics", "reporting"],
//     members: [
//       {
//         name: "Lisa Wong",
//         image: "https://randomuser.me/api/portraits/women/18.jpg",
//       },
//       {
//         name: "Marcus Johnson",
//         image: "https://randomuser.me/api/portraits/men/24.jpg",
//       },
//       {
//         name: "Patricia Green",
//         image: "https://randomuser.me/api/portraits/women/53.jpg",
//       },
//       {
//         name: "Daniel White",
//         image: "https://randomuser.me/api/portraits/men/36.jpg",
//       },
//     ],
//     features: [
//       {
//         date: "May 1, 2023",
//         name: "Data Connectors",
//         description:
//           "Built connectors for databases, APIs, and file sources with real-time sync.",
//         icon: "i-lucide-plug",
//         status: "done",
//       },
//       {
//         date: "Jun 15, 2023",
//         name: "Visualization Engine",
//         description:
//           "Developed interactive charts, graphs, and custom visualization components.",
//         icon: "i-lucide-bar-chart-3",
//         status: "done",
//       },
//       {
//         date: "Jul 30, 2023",
//         name: "Report Builder",
//         description:
//           "Created drag-and-drop report builder with automated scheduling.",
//         icon: "i-lucide-file-text",
//         status: "done",
//       },
//       {
//         date: "Aug 31, 2023",
//         name: "Production",
//         description:
//           "Deployed platform with enterprise security and scalability features.",
//         icon: "i-lucide-server",
//         status: "done",
//       },
//     ],
//     duration: "5 months",
//     course: "Data Visualization & Analytics",
//     visibility: "public",
//   },

//   // Additional projects for pagination testing
//   {
//     id: "8",
//     name: "IoT Home Automation",
//     description:
//       "Smart home system controlling lights, temperature, and security using IoT sensors and mobile app integration.",
//     academicYear: "2024-2025",
//     author: {
//       id: "8",
//       name: "David Park",
//       avatar: "https://randomuser.me/api/portraits/men/41.jpg",
//       program: "Electrical Engineering",
//       year: "4th Year",
//     },
//     technologies: ["Arduino", "React Native", "Node.js", "MQTT", "Firebase"],
//     category: "IoT",
//     status: "Completed",
//     featured: true,
//     likes: 198,
//     views: 1650,
//     demoUrl: "https://iot-home.demo.com",
//     githubUrl: "https://github.com/dpark/iot-home",
//     images: [
//       {
//         id: "img1",
//         originalUrl:
//           "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=60",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=60",
//       },
//       {
//         id: "img2",
//         originalUrl:
//           "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&auto=format&fit=crop&q=60",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&auto=format&fit=crop&q=60",
//       },
//     ],
//     createdAt: "2024-05-20",
//     tags: ["iot", "automation", "smart-home"],
//     members: [
//       {
//         name: "David Park",
//         image: "https://randomuser.me/api/portraits/men/41.jpg",
//       },
//       {
//         name: "Sophie Chen",
//         image: "https://randomuser.me/api/portraits/women/33.jpg",
//       },
//     ],
//     features: [
//       {
//         date: "Feb 1, 2024",
//         name: "Hardware Setup",
//         description:
//           "Set up Arduino controllers, sensors, and smart device integration framework.",
//         icon: "i-lucide-cpu",
//         status: "done",
//       },
//       {
//         date: "Mar 15, 2024",
//         name: "Mobile App Development",
//         description:
//           "Built React Native app for remote control and monitoring of home systems.",
//         icon: "i-lucide-smartphone",
//         status: "done",
//       },
//       {
//         date: "Apr 20, 2024",
//         name: "MQTT Integration",
//         description:
//           "Implemented real-time communication between devices using MQTT protocol.",
//         icon: "i-lucide-wifi",
//         status: "done",
//       },
//       {
//         date: "May 20, 2024",
//         name: "System Deployment",
//         description:
//           "Deployed complete home automation system with cloud monitoring.",
//         icon: "i-lucide-home",
//         status: "done",
//       },
//     ],
//     duration: "4 months",
//     course: "IoT Systems Design",
//     visibility: "public",
//   },

//   {
//     id: "9",
//     name: "Blockchain Voting System",
//     description:
//       "Secure and transparent voting platform built on Ethereum blockchain ensuring vote integrity and anonymity.",
//     academicYear: "2024-2025",
//     author: {
//       id: "9",
//       name: "Michael Torres",
//       avatar: "https://randomuser.me/api/portraits/men/55.jpg",
//       program: "Computer Science",
//       year: "4th Year",
//     },
//     technologies: ["Solidity", "Web3.js", "React", "Ethereum", "IPFS"],
//     category: "Blockchain",
//     status: "Completed",
//     featured: false,
//     likes: 287,
//     views: 2100,
//     demoUrl: "https://blockchain-voting.demo.com",
//     githubUrl: "https://github.com/mtorres/blockchain-voting",
//     images: [
//       {
//         id: "img1",
//         originalUrl:
//           "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60",
//       },
//       {
//         id: "img2",
//         originalUrl:
//           "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60",
//         thumbnailUrl:
//           "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60",
//       },
//     ],
//     createdAt: "2023-12-10",
//     tags: ["blockchain", "voting", "ethereum"],
//     members: [
//       {
//         name: "Michael Torres",
//         image: "https://randomuser.me/api/portraits/men/55.jpg",
//       },
//       {
//         name: "Anna Kim",
//         image: "https://randomuser.me/api/portraits/women/45.jpg",
//       },
//       {
//         name: "James Wilson",
//         image: "https://randomuser.me/api/portraits/men/29.jpg",
//       },
//     ],
//     features: [
//       {
//         date: "Aug 1, 2023",
//         name: "Smart Contract Development",
//         description:
//           "Developed secure voting smart contracts using Solidity with vote verification.",
//         icon: "i-lucide-shield-check",
//         status: "done",
//       },
//       {
//         date: "Sep 15, 2023",
//         name: "Web3 Integration",
//         description:
//           "Integrated Web3.js for blockchain interaction and wallet connectivity.",
//         icon: "i-lucide-link",
//         status: "done",
//       },
//       {
//         date: "Oct 30, 2023",
//         name: "IPFS Storage",
//         description:
//           "Implemented decentralized storage for candidate information and voting records.",
//         icon: "i-lucide-database",
//         status: "done",
//       },
//       {
//         date: "Dec 10, 2023",
//         name: "Security Audit",
//         description:
//           "Completed comprehensive security testing and deployed to Ethereum testnet.",
//         icon: "i-lucide-lock",
//         status: "done",
//       },
//     ],
//     duration: "6 months",
//     course: "Distributed Systems",
//     visibility: "public",
//   },
// ];

export const projectsData: Project[] = [];

export default projectsData;
