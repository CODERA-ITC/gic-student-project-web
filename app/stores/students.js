export const useStudentStore = defineStore('students', {
  state: () => ({
    students: [
      {
        id: 1,
        name: 'Sarah Chen',
        email: 'sarah.chen@gic.edu',
        program: 'Computer Science',
        year: '4th Year',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=200&h=200&fit=crop&crop=face',
        bio: 'Passionate about AI and machine learning applications in education. Currently working on my thesis about adaptive learning systems.',
        skills: [
          'Python',
          'TensorFlow',
          'React',
          'MongoDB',
          'Docker',
          'Machine Learning',
          'Data Science',
        ],
        projects: [1, 4],
        achievements: [
          'Dean\'s List 2023-2024',
          'Best AI Project Award 2023',
          'Google Summer of Code Participant 2023',
        ],
        social: {
          github: 'https://github.com/sarahchen',
          linkedin: 'https://linkedin.com/in/sarahchen',
          portfolio: 'https://sarahchen.dev',
        },
        location: 'Singapore',
        joinedDate: '2021-08-15',
        graduationYear: 2025,
        gpa: 3.92,
      },
      {
        id: 2,
        name: 'Marcus Johnson',
        email: 'marcus.johnson@gic.edu',
        program: 'Software Engineering',
        year: '3rd Year',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        bio: 'Mobile development enthusiast with a focus on augmented reality and cross-platform applications. Love creating intuitive user experiences.',
        skills: [
          'Unity',
          'ARCore',
          'C#',
          'Firebase',
          'Kotlin',
          'Swift',
          'React Native',
        ],
        projects: [2],
        achievements: [
          'Best Mobile App Award 2024',
          'Hackathon Winner 2023',
          'Google Developer Student Club Lead',
        ],
        social: {
          github: 'https://github.com/mjohnson',
          linkedin: 'https://linkedin.com/in/marcusjohnson',
          portfolio: 'https://marcusj.dev',
        },
        location: 'Malaysia',
        joinedDate: '2022-08-20',
        graduationYear: 2026,
        gpa: 3.78,
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@gic.edu',
        program: 'Environmental Science',
        year: '4th Year',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        bio: 'Environmental data scientist working on sustainability solutions. Combining technology with environmental research for positive impact.',
        skills: [
          'Vue.js',
          'Node.js',
          'PostgreSQL',
          'Chart.js',
          'IoT',
          'Data Analysis',
          'GIS',
        ],
        projects: [3],
        achievements: [
          'Environmental Innovation Award 2024',
          'Sustainability Research Grant Recipient',
          'Published Research Paper on Campus Sustainability',
        ],
        social: {
          github: 'https://github.com/erodriguez',
          linkedin: 'https://linkedin.com/in/emilyrodriguez',
          portfolio: 'https://emilyrodriguez.eco',
        },
        location: 'Philippines',
        joinedDate: '2021-08-10',
        graduationYear: 2025,
        gpa: 3.89,
      },
      {
        id: 4,
        name: 'David Kim',
        email: 'david.kim@gic.edu',
        program: 'Information Systems',
        year: '3rd Year',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        bio: 'Full-stack developer with expertise in enterprise systems and database design. Interested in scalable architecture and cloud technologies.',
        skills: [
          'Angular',
          'Spring Boot',
          'MySQL',
          'ElasticSearch',
          'Docker',
          'AWS',
          'Microservices',
        ],
        projects: [4],
        achievements: [
          'Outstanding Academic Performance 2023',
          'AWS Certified Solutions Architect',
          'Internship at Tech Innovation Lab',
        ],
        social: {
          github: 'https://github.com/dkim',
          linkedin: 'https://linkedin.com/in/davidkim',
          portfolio: 'https://davidkim.tech',
        },
        location: 'South Korea',
        joinedDate: '2022-08-15',
        graduationYear: 2026,
        gpa: 3.85,
      },
      {
        id: 5,
        name: 'Aisha Patel',
        email: 'aisha.patel@gic.edu',
        program: 'Health Informatics',
        year: '4th Year',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
        bio: 'Health technology advocate combining healthcare knowledge with software development. Passionate about improving healthcare accessibility.',
        skills: [
          'React Native',
          'Express.js',
          'MongoDB',
          'Socket.io',
          'Chart.js',
          'FHIR',
          'Healthcare APIs',
        ],
        projects: [5],
        achievements: [
          'Health Innovation Award 2024',
          'Research Assistant in Digital Health Lab',
          'Presented at International Health Informatics Conference',
        ],
        social: {
          github: 'https://github.com/apatel',
          linkedin: 'https://linkedin.com/in/aishapatel',
          portfolio: 'https://aishapatel.health',
        },
        location: 'India',
        joinedDate: '2021-08-12',
        graduationYear: 2025,
        gpa: 3.94,
      },
      {
        id: 6,
        name: 'Alex Thompson',
        email: 'alex.thompson@gic.edu',
        program: 'Cybersecurity',
        year: '4th Year',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        bio: 'Blockchain and cybersecurity specialist. Focused on developing secure, decentralized systems and protecting digital assets.',
        skills: [
          'Solidity',
          'Web3.js',
          'React',
          'Ethereum',
          'IPFS',
          'Penetration Testing',
          'Cryptography',
        ],
        projects: [6],
        achievements: [
          'Cybersecurity Excellence Award 2023',
          'Certified Ethical Hacker (CEH)',
          'Blockchain Hackathon Winner 2023',
        ],
        social: {
          github: 'https://github.com/athompson',
          linkedin: 'https://linkedin.com/in/alexthompson',
          portfolio: 'https://alexthompson.security',
        },
        location: 'Canada',
        joinedDate: '2021-08-18',
        graduationYear: 2025,
        gpa: 3.87,
      },
    ],
    programs: [
      'All',
      'Computer Science',
      'Software Engineering',
      'Environmental Science',
      'Information Systems',
      'Health Informatics',
      'Cybersecurity',
      'Data Science',
      'Digital Innovation',
    ],
    years: ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
    filters: {
      program: 'All',
      year: 'All',
      search: '',
      sortBy: 'name',
    },
  }),

  getters: {
    filteredStudents: (state) => {
      let filtered = [...state.students]

      // Apply program filter
      if (state.filters.program !== 'All') {
        filtered = filtered.filter(
          student => student.program === state.filters.program,
        )
      }

      // Apply year filter
      if (state.filters.year !== 'All') {
        filtered = filtered.filter(
          student => student.year === state.filters.year,
        )
      }

      // Apply search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          student =>
            student.name.toLowerCase().includes(searchTerm)
            || student.program.toLowerCase().includes(searchTerm)
            || student.bio.toLowerCase().includes(searchTerm)
            || student.skills.some(skill =>
              skill.toLowerCase().includes(searchTerm),
            ),
        )
      }

      // Apply sorting
      switch (state.filters.sortBy) {
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'program':
          filtered.sort((a, b) => a.program.localeCompare(b.program))
          break
        case 'year':
          filtered.sort((a, b) => b.graduationYear - a.graduationYear)
          break
        case 'gpa':
          filtered.sort((a, b) => b.gpa - a.gpa)
          break
        case 'projects':
          filtered.sort((a, b) => b.projects.length - a.projects.length)
          break
      }

      return filtered
    },

    studentsByProgram: (state) => {
      const programMap = {}
      state.students.forEach((student) => {
        if (!programMap[student.program]) {
          programMap[student.program] = []
        }
        programMap[student.program].push(student)
      })
      return programMap
    },

    studentStats: (state) => {
      return {
        total: state.students.length,
        byProgram: state.studentsByProgram,
        averageGPA: (
          state.students.reduce((sum, s) => sum + s.gpa, 0)
          / state.students.length
        ).toFixed(2),
        graduating2025: state.students.filter(s => s.graduationYear === 2025)
          .length,
        graduating2026: state.students.filter(s => s.graduationYear === 2026)
          .length,
      }
    },

    topPerformers: (state) => {
      return [...state.students].sort((a, b) => b.gpa - a.gpa).slice(0, 5)
    },
  },

  actions: {
    setFilter(filterType, value) {
      this.filters[filterType] = value
    },

    clearFilters() {
      this.filters = {
        program: 'All',
        year: 'All',
        search: '',
        sortBy: 'name',
      }
    },

    getStudent(id) {
      return this.students.find(student => student.id === Number.parseInt(id))
    },

    getStudentsByProgram(program) {
      return this.students.filter(student => student.program === program)
    },

    searchStudents(query) {
      const searchTerm = query.toLowerCase()
      return this.students.filter(
        student =>
          student.name.toLowerCase().includes(searchTerm)
          || student.program.toLowerCase().includes(searchTerm)
          || student.skills.some(skill =>
            skill.toLowerCase().includes(searchTerm),
          ),
      )
    },
  },
})
