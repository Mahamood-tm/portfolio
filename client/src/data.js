// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  firstName: 'MAHAMOOD',
  lastName: 'T M',
  role: 'Software engineer and full-stack developer',
  location: 'Kannur, Kerala, India',
  email: 'mahamoodtharimooppan@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mahamoodtharimooppan',
  github: 'https://github.com/Mahamood-tm',
  resume: '/Mahamood_TM_Resume.pdf',
}

export const intro =
  'I build full-stack web applications with React, Node.js, Express and Supabase, from the database schema to the deployed screen. One of them runs a multi-store supermarket every day.'

export const about = [
  'I finished my MCA in 2026. Since then I have shipped software for real businesses: an ERP for a construction company during my internship, and a live supermarket management platform as a freelancer.',
  'I care about the parts users never see: role-based access done properly, clean REST APIs and database designs that stay fast as data grows. I am looking for a software engineer role on a team that builds products people depend on.',
]

// Real chronological order, newest first.
export const path = [
  {
    when: 'Mar 2026 – Jun 2026',
    title: 'Software Development Intern',
    org: 'VIndia Infrasec, Mysore (on-site)',
    stack: 'React.js, Node.js, Express.js, PostgreSQL, REST APIs, Git',
    points: [
      'Built ERP modules for a construction company: incident management, task management, drawing management, drawing version control and role-based access control.',
      'Wrote responsive React components and wired them to Node.js and Express services.',
      'Designed and managed the PostgreSQL databases behind the business workflows.',
      'Took part in requirement analysis, debugging, testing and rollout with the team.',
    ],
  },
  {
    when: '2024 – 2026',
    title: 'Master of Computer Applications',
    org: 'Chinmaya Institute of Technology, Kannur',
    stack: 'CGPA 8.3',
  },
  {
    when: '2021 – 2024',
    title: 'B.Sc. Computer Science',
    org: 'Mary Matha Arts & Science College, Mananthavady',
    stack: 'CGPA 7.4',
  },
]

export const projects = [
  {
    name: 'Supermarket Management System',
    status: 'Live',
    context: 'Freelance project for Metreo Supermarket',
    stack: ['React.js', 'Node.js', 'Express.js', 'Supabase', 'PostgreSQL', 'Cloudflare Pages', 'Render'],
    points: [
      'A multi-store platform with separate access for Super Admin, Store Admin, Salesperson, Purchaser and Inventory Person.',
      'Store, employee and product management, barcode scanning with manual entry, purchasing with order acknowledgement, inventory and expiry monitoring.',
      'A tablet-based, face-verified attendance system that records check-in and check-out across multiple sessions a day.',
      'REST APIs in Node.js and Express, Supabase for PostgreSQL and auth, deployed on Cloudflare Pages and Render.',
    ],
  },
  {
    name: 'Project Management & Employee Portal',
    status: '2026',
    context: 'Single-page application',
    stack: ['React.js', 'JavaScript', 'Node.js', 'Express.js', 'PostgreSQL'],
    points: [
      'Manages projects and employee records across teams, with views that change by role.',
      'Component-based React with Hooks for state, and REST CRUD with proper loading and error states.',
    ],
  },
  {
    name: 'Maternal and Child Health Portal',
    status: '2025',
    context: 'Django application',
    stack: ['Python', 'Django', 'MySQL'],
    points: [
      'Role-based access for ASHA workers and Health Inspectors, with ANC tracking and automatic immunization scheduling.',
      'High-risk pregnancy detection logic on a normalized MySQL schema queried through the Django ORM.',
    ],
  },
]

export const skills = [
  { group: 'Languages', items: ['JavaScript', 'Python', 'Java', 'C', 'C++'] },
  { group: 'Web', items: ['React.js', 'Node.js', 'Express.js', 'Django REST Framework', 'REST APIs', 'HTML5', 'CSS3'] },
  { group: 'Data', items: ['PostgreSQL', 'Supabase', 'MySQL', 'SQL'] },
  { group: 'Ship & secure', items: ['Git and GitHub', 'Cloudflare Pages', 'Render', 'Network security'] },
  { group: 'Foundations', items: ['Data structures and algorithms', 'OOP', 'DBMS', 'Operating systems', 'Computer networks'] },
]

export const certifications = [
  'Python and Django Full Stack Web Development, Udemy',
  'Introduction to Cybersecurity, Cisco Networking Academy',
  'Networking Basics, Cisco Networking Academy',
]
