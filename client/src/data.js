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
  'I care about the parts users never see: role-based access done properly, token-based authentication, clean REST APIs and database designs that stay fast as data grows. I am looking for a software engineer role on a team that builds products people depend on.',
]

export const hero = {
  title: 'I build software',
  titleItalic: 'that businesses run on.',
  sub: "I'm Mahamood, a full-stack developer from Kerala. I design the database, write the API and ship the interface with React, Node.js, Express and Supabase.",
  leftCard: { title: 'Live in production.', text: 'A multi-store supermarket platform, used every day.' },
  rightCard: { title: 'Database to deployment.', text: 'One developer, the whole stack.' },
  bottomLeft: ['MCA graduate, 2026.', 'Open to full-time roles.'],
  bottomRight: ['Clean code.', 'Real users.'],
  badge: 'OPEN TO WORK • FULL-STACK DEVELOPER • ',
}

// Glass cards that orbit the code window in the hero.
export const ring = [
  { icon: 'store', tint: '#FDD5B8', title: 'Supermarket', text: 'Live in production' },
  { icon: 'grid', tint: '#DDD3FD', title: 'Construction ERP', text: 'Projects, drawings' },
  { icon: 'heart', tint: '#E4F7C2', title: 'Health portal', text: 'Django, ANC tracking' },
  { icon: 'shield', tint: '#CDEBFA', title: 'Auth', text: 'HTTP-only tokens' },
  { icon: 'users', tint: '#FBEBB5', title: 'Access control', text: 'Six roles, RBAC' },
  { icon: 'code', tint: '#DDD3FD', title: 'REST APIs', text: 'Node.js and Express' },
  { icon: 'database', tint: '#E4F7C2', title: 'PostgreSQL', text: 'Supabase, 18 tables' },
  { icon: 'cloud', tint: '#FDD5B8', title: 'Deployed', text: 'Cloudflare and Render' },
]

export const aboutStats = [
  { value: '2026', label: 'MCA, CGPA 8.3' },
  { value: '3', label: 'full-stack projects' },
  { value: '1', label: 'platform live in production' },
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
    summary:
      'A multi-store platform that runs branches, staff, products, purchasing, inventory, expiry and attendance from one place.',
    stats: [
      { value: 6, label: 'user roles' },
      { value: 18, label: 'database tables' },
      { value: 7, label: 'core modules' },
    ],
    groups: [
      {
        title: 'Multi-store and roles',
        points: [
          'Super Admin creates stores and assigns a Store Admin to each one.',
          'Store Admins manage only their own store; every record is tied to a store_id.',
          'Six roles with backend permission checks: Super Admin, Store Admin, Salesperson, Purchaser, Inventory Person and Employee.',
        ],
      },
      {
        title: 'Authentication',
        points: [
          'Supabase Auth users linked to employee records through auth_user_id.',
          'Access and refresh tokens stored in HTTP-only cookies.',
          'Authentication and authorization middleware in Express.',
          'Store Admins approve or reject new employee registrations.',
        ],
      },
      {
        title: 'Products and barcodes',
        points: [
          'Manufacturer EAN barcodes kept separate from store-specific item codes.',
          'Products without an EAN are fully supported.',
          'Barcode scanning with manual lookup as a fallback.',
        ],
      },
      {
        title: 'Ordering workflow',
        points: [
          'Salespeople search products and raise orders.',
          'Purchasers acknowledge each order and mark items ordered or unavailable, with an out-of-stock reason.',
          'Salespeople follow the status of every order they raised.',
        ],
      },
      {
        title: 'Expiry tracking',
        points: [
          'Logs expired quantities, who scanned the product and who brought it in.',
          'Each case resolved as an exchange or a credit note.',
          'Linked to the store, product and supplier for reporting.',
        ],
      },
      {
        title: 'Face-verified attendance',
        points: [
          'Tablet kiosk: employees pick their name and verify their face before punching.',
          'Check-in and check-out across multiple sessions a day.',
          'Consent records and face descriptors stored as JSONB.',
        ],
      },
    ],
    stack: ['React 19', 'Vite', 'Node.js', 'Express.js', 'Supabase Auth', 'PostgreSQL', 'Cloudflare Pages', 'Render'],
  },
  {
    name: 'Construction Project Management ERP',
    status: '2026',
    context: 'Built during my internship at VIndia Infrasec',
    summary:
      'An ERP for a construction company that brings projects, teams, tasks, incidents, drawings, timesheets and costs into one system.',
    stats: [
      { value: 12, label: 'user roles' },
      { value: 8, label: 'departments' },
      { value: 5, label: 'drawing formats' },
    ],
    groups: [
      {
        title: 'Roles and departments',
        points: [
          'Twelve roles, from CEO and Project Manager to Site, Structural and MEP Engineers and Clients.',
          'Eight departments including HR, Finance, Design, Operations and Project Management.',
          'New registrations stay pending until the CEO assigns a role.',
        ],
      },
      {
        title: 'Projects and WBS',
        points: [
          'Projects created and tracked through project cards with progress.',
          'Work Breakdown Structure splits each project into activities and tasks.',
          'Employees and teams attached to the projects they work on.',
        ],
      },
      {
        title: 'Tasks and incidents',
        points: [
          'Tasks created and assigned, incidents recorded against projects.',
          'Priority levels P1, P2 and P3 with a Created-to-Closed workflow.',
          'Visibility limited to the creator and the assignee.',
        ],
      },
      {
        title: 'Drawing management',
        points: [
          'Shared MEP drawing uploads in DWG, DXF, PDF, RVT and IFC.',
          'Drawing version control so teams always work from the latest revision.',
        ],
      },
      {
        title: 'Timesheets, costs and dashboards',
        points: [
          'Employee time tracked against projects.',
          'Project costs organised alongside the work.',
          'Dashboards for monitoring projects and tasks.',
        ],
      },
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'REST APIs'],
  },
  {
    name: 'Maternal and Child Health Portal',
    status: '2025',
    context: 'MCA mini-project',
    summary:
      'A Django application that digitises pregnancy registration, antenatal care, child records and immunization tracking for ASHA workers and Health Inspectors.',
    stats: [
      { value: 2, label: 'user roles' },
      { value: 18, suffix: ' yrs', label: 'immunization schedule' },
      { value: 5, label: 'core modules' },
    ],
    groups: [
      {
        title: 'Roles',
        points: [
          'Custom Django User model with two roles: ASHA Worker and Health Inspector.',
          'Health Inspectors create ASHA Worker accounts.',
        ],
      },
      {
        title: 'Pregnancy registration',
        points: [
          'ASHA Workers register pregnant women and record the LMP.',
          'Expected Date of Delivery calculated automatically, pregnancy status tracked.',
          'Each record linked to a ward and an ASHA Worker.',
        ],
      },
      {
        title: 'Antenatal care',
        points: ['ANC visits recorded and linked to each registered woman.'],
      },
      {
        title: 'Children and immunization',
        points: [
          'Child registration and records.',
          'Immunization schedule up to 18 years with due dates and status for every vaccine.',
        ],
      },
      {
        title: 'Reports and high-risk cases',
        points: [
          'Health Inspectors view records and generate reports.',
          'High-risk pregnancies identified and managed.',
        ],
      },
    ],
    stack: ['Python', 'Django 5.2', 'SQLite', 'HTML', 'CSS', 'Bootstrap'],
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