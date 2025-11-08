export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [
      {
        id: 1,
        title: 'AI Study Assistant',
        description:
          'Machine learning application that helps students optimize their study schedules using advanced algorithms and personalized learning patterns.',
        semester: 'Fall 2024',
        author: {
          name: 'Sarah Chen',
          avatar:
            'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=face',
          program: 'Computer Science',
          year: '4th Year',
        },
        technologies: ['Python', 'TensorFlow', 'React', 'MongoDB', 'Docker'],
        category: 'Artificial Intelligence',
        status: 'Completed',
        featured: true,
        likes: 245,
        views: 1842,
        demoUrl: 'https://ai-study-assistant.demo.com',
        githubUrl: 'https://github.com/sarahchen/ai-study-assistant',
        thumbnail:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
        createdAt: '2024-10-15',
        tags: ['machine-learning', 'education', 'productivity'],
      },
      {
        id: 2,
        title: 'Campus Navigator AR',
        description:
          'Augmented reality mobile application that helps students and visitors navigate the campus efficiently with real-time directions and points of interest.',
        semester: 'Fall 2024',
        author: {
          name: 'Marcus Johnson',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          program: 'Software Engineering',
          year: '3rd Year',
        },
        technologies: ['Unity', 'ARCore', 'C#', 'Firebase', 'Google Maps API'],
        category: 'Mobile Development',
        status: 'In Progress',
        featured: true,
        likes: 189,
        views: 1337,
        demoUrl: 'https://campus-navigator.demo.com',
        githubUrl: 'https://github.com/mjohnson/campus-navigator',
        thumbnail:
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
        createdAt: '2024-09-22',
        tags: ['augmented-reality', 'navigation', 'mobile'],
      },
      {
        id: 3,
        title: 'Sustainability Tracker',
        description:
          'Comprehensive platform for tracking and analyzing campus environmental impact with real-time monitoring and actionable insights for sustainability.',
        semester: 'Summer 2024',
        author: {
          name: 'Emily Rodriguez',
          avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          program: 'Environmental Science',
          year: '4th Year',
        },
        technologies: [
          'Vue.js',
          'Node.js',
          'PostgreSQL',
          'Chart.js',
          'IoT Sensors',
        ],
        category: 'Environmental Tech',
        status: 'Completed',
        featured: false,
        likes: 156,
        views: 892,
        demoUrl: 'https://sustainability-tracker.demo.com',
        githubUrl: 'https://github.com/erodriguez/sustainability-tracker',
        thumbnail:
          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=250&fit=crop',
        createdAt: '2024-08-10',
        tags: ['sustainability', 'environment', 'data-visualization'],
      },
      {
        id: 4,
        title: 'Smart Library System',
        description:
          'Digital library management system with AI-powered book recommendations, automated inventory tracking, and seamless user experience.',
        semester: 'Spring 2024',
        author: {
          name: 'David Kim',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          program: 'Information Systems',
          year: '3rd Year',
        },
        technologies: [
          'Angular',
          'Spring Boot',
          'MySQL',
          'ElasticSearch',
          'Docker',
        ],
        category: 'Information Systems',
        status: 'Completed',
        featured: false,
        likes: 203,
        views: 1456,
        demoUrl: 'https://smart-library.demo.com',
        githubUrl: 'https://github.com/dkim/smart-library',
        thumbnail:
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
        createdAt: '2024-05-20',
        tags: ['library', 'ai-recommendations', 'management-system'],
      },
      {
        id: 5,
        title: 'Health & Wellness Dashboard',
        description:
          'Student wellness tracking application with mental health resources, fitness goals, and peer support community features.',
        semester: 'Spring 2024',
        author: {
          name: 'Aisha Patel',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
          program: 'Health Informatics',
          year: '4th Year',
        },
        technologies: [
          'React Native',
          'Express.js',
          'MongoDB',
          'Socket.io',
          'Chart.js',
        ],
        category: 'Health Tech',
        status: 'Completed',
        featured: true,
        likes: 287,
        views: 2156,
        demoUrl: 'https://wellness-dashboard.demo.com',
        githubUrl: 'https://github.com/apatel/wellness-dashboard',
        thumbnail:
          'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
        createdAt: '2024-04-15',
        tags: ['health', 'wellness', 'community', 'mental-health'],
      },
      {
        id: 6,
        title: 'Blockchain Voting System',
        description:
          'Secure and transparent student government voting platform built on blockchain technology ensuring tamper-proof elections.',
        semester: 'Fall 2023',
        author: {
          name: 'Alex Thompson',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
          program: 'Cybersecurity',
          year: '4th Year',
        },
        technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'IPFS'],
        category: 'Blockchain',
        status: 'Completed',
        featured: false,
        likes: 178,
        views: 1234,
        demoUrl: 'https://blockchain-voting.demo.com',
        githubUrl: 'https://github.com/athompson/blockchain-voting',
        thumbnail:
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
        createdAt: '2023-11-08',
        tags: ['blockchain', 'voting', 'security', 'ethereum'],
      },
    ],
    categories: [
      'All',
      'Artificial Intelligence',
      'Mobile Development',
      'Environmental Tech',
      'Information Systems',
      'Health Tech',
      'Blockchain',
      'Web Development',
      'Data Science',
    ],
    semesters: [
      'All',
      'Fall 2024',
      'Summer 2024',
      'Spring 2024',
      'Fall 2023',
      'Summer 2023',
    ],
    filters: {
      category: 'All',
      semester: 'All',
      search: '',
      sortBy: 'newest',
    },
    loading: false,
  }),

  getters: {
    filteredProjects: (state) => {
      let filtered = [...state.projects]

      // Apply category filter
      if (state.filters.category !== 'All') {
        filtered = filtered.filter(
          project => project.category === state.filters.category,
        )
      }

      // Apply semester filter
      if (state.filters.semester !== 'All') {
        filtered = filtered.filter(
          project => project.semester === state.filters.semester,
        )
      }

      // Apply search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          project =>
            project.title.toLowerCase().includes(searchTerm)
            || project.description.toLowerCase().includes(searchTerm)
            || project.author.name.toLowerCase().includes(searchTerm)
            || project.technologies.some(tech =>
              tech.toLowerCase().includes(searchTerm),
            )
            || project.tags.some(tag => tag.toLowerCase().includes(searchTerm)),
        )
      }

      // Apply sorting
      switch (state.filters.sortBy) {
        case 'newest':
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )
          break
        case 'oldest':
          filtered.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          )
          break
        case 'popular':
          filtered.sort((a, b) => b.likes - a.likes)
          break
        case 'views':
          filtered.sort((a, b) => b.views - a.views)
          break
        case 'alphabetical':
          filtered.sort((a, b) => a.title.localeCompare(b.title))
          break
      }

      return filtered
    },

    featuredProjects: (state) => {
      return state.projects.filter(project => project.featured)
    },

    projectsByCategory: (state) => {
      const categoryMap = {}
      state.projects.forEach((project) => {
        if (!categoryMap[project.category]) {
          categoryMap[project.category] = []
        }
        categoryMap[project.category].push(project)
      })
      return categoryMap
    },

    projectStats: (state) => {
      return {
        total: state.projects.length,
        completed: state.projects.filter(p => p.status === 'Completed')
          .length,
        inProgress: state.projects.filter(p => p.status === 'In Progress')
          .length,
        totalLikes: state.projects.reduce((sum, p) => sum + p.likes, 0),
        totalViews: state.projects.reduce((sum, p) => sum + p.views, 0),
      }
    },
  },

  actions: {
    setFilter(filterType, value) {
      this.filters[filterType] = value
    },

    clearFilters() {
      this.filters = {
        category: 'All',
        semester: 'All',
        search: '',
        sortBy: 'newest',
      }
    },

    async likeProject(projectId) {
      const project = this.projects.find(p => p.id === projectId)
      if (project) {
        project.likes++
      }
    },

    async incrementViews(projectId) {
      const project = this.projects.find(p => p.id === projectId)
      if (project) {
        project.views++
      }
    },

    getProject(id) {
      return this.projects.find(project => project.id === Number.parseInt(id))
    },

    getProjectsByAuthor(authorName) {
      return this.projects.filter(project =>
        project.author.name.toLowerCase().includes(authorName.toLowerCase()),
      )
    },
  },
})
