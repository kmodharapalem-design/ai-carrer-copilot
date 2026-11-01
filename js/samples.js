/**
 * Sample Resumes and Job Descriptions for instant 1-click testing
 */

export const SAMPLES = {
  internship: {
    title: "Computer Science Intern (Frontend Focus)",
    resume: `ALEX RIVERA
Seattle, WA | alex.rivera@email.edu | (555) 234-5678 | linkedin.com/in/alex-rivera-cs | github.com/alexrivera-dev

EDUCATION
University of Washington, Seattle, WA
Bachelor of Science in Computer Science | Expected Graduation: June 2026
GPA: 3.82 / 4.00
Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Web Development, Database Management, Software Engineering Principles

TECHNICAL SKILLS
Languages: JavaScript (ES6+), Python, HTML5, CSS3, SQL
Frameworks & Libraries: React.js, Node.js, Express, Bootstrap, Chart.js
Developer Tools: Git, GitHub, VS Code, Postman, Vite, Vercel
Concepts: RESTful APIs, Responsive Web Design, Component-Based Architecture, Agile/Scrum

TECHNICAL PROJECTS
Campus Event Discovery Platform | React.js, Node.js, Express, MongoDB
• Architected a responsive web application serving 1,200+ active students to discover and filter student club events by category and date.
• Implemented client-side routing using React Router and state management with React Hooks (useState, useEffect, useContext).
• Built RESTful API endpoints for user authentication and RSVP event registration with input validation.
• Designed mobile-first accessible UI layouts achieving a 98% Google Lighthouse accessibility rating.

Automated Study Planner & Flashcard App | JavaScript, HTML5, CSS3, LocalStorage
• Developed an interactive single-page study application featuring spaced-repetition flashcards and daily study streak tracking.
• Implemented custom CSS Grid and Flexbox layouts supporting seamless transitions between desktop and mobile devices.
• Integrated local storage persistence allowing users to maintain study progress offline without data loss.

CAMPUS LEADERSHIP & ACTIVITIES
Peer Tutor – Introduction to Computer Programming | Sept 2024 – Present
• Mentored 35+ undergraduate students weekly in core programming fundamentals, debugging techniques, and algorithm problem-solving.
ACM Student Chapter – Active Member | Oct 2023 – Present
• Collaborated in bi-weekly hack nights and organized an introductory React workshop for 50+ freshman engineering students.`,

    jobDescription: `Job Title: Frontend Software Engineer Intern
Company: NovaTech Solutions
Location: Remote (US) / Seattle, WA

About the Role:
NovaTech Solutions is seeking an enthusiastic Frontend Engineering Intern to join our core product team for Summer 2026. You will collaborate directly with senior engineers and product designers to build intuitive, accessible, and high-performance user interfaces for our real-time collaboration platform.

Key Responsibilities:
• Build modular, reusable web components using React.js and TypeScript.
• Collaborate with UI/UX designers in Figma to translate wireframes into responsive, pixel-perfect web pages using Tailwind CSS.
• Integrate frontend interfaces with RESTful APIs and GraphQL endpoints.
• Write unit tests using Jest and React Testing Library to ensure application reliability.
• Participate in Agile sprints, daily standups, code reviews, and git branching workflows.

Required Qualifications:
• Currently enrolled in a Bachelor's or Master's program in Computer Science, Software Engineering, or related technical field.
• Strong foundation in JavaScript (ES6+), HTML5, and modern CSS (Flexbox, Grid).
• Hands-on project experience with React.js and modern state management.
• Familiarity with version control using Git and GitHub.
• Passion for clean code, web performance, and user-centered design.

Preferred / Nice-to-Have:
• Experience with TypeScript.
• Experience styling with Tailwind CSS or CSS-in-JS.
• Exposure to automated testing frameworks (Jest, Vitest, Cypress).
• Understanding of CI/CD pipelines and deployment platforms (Vercel, AWS).`
  },

  backendJunior: {
    title: "Junior Backend Engineer (Python / API)",
    resume: `JORDAN PATEL
Austin, TX | jordan.patel@email.com | (555) 876-5432 | github.com/jordan-patel-dev

SUMMARY
Software engineering graduate with hands-on experience building scalable backend APIs, relational database schemas, and microservices in Python. Passionate about system performance, database query optimization, and reliable cloud deployments.

TECHNICAL SKILLS
Languages: Python, SQL (PostgreSQL, SQLite), JavaScript (Basic)
Frameworks & Backend: Flask, Django REST Framework, SQLAlchemy
Databases: PostgreSQL, Redis (Caching basics)
DevOps & Tools: Docker, Git, Linux/Bash, Postman, pytest
Architecture: RESTful APIs, MVC, JWT Authentication, Database Normalization

PROJECTS
E-Commerce Inventory & Order API | Python, Flask, PostgreSQL, Docker
• Designed and deployed a RESTful backend microservice supporting product catalog indexing and transactional order processing.
• Created PostgreSQL schema with optimized indexed queries, reducing sample query latency by 32%.
• Implemented JWT token-based authentication and role-based access control (Admin vs. Customer).
• Containerized the application using Docker and Docker Compose for reproducible local and staging environments.

Real-Time Notification Worker | Python, Redis, Celery
• Built an asynchronous task queue processing automated email notifications and daily digest summaries.
• Utilized Redis as an in-memory message broker to handle background tasks without blocking HTTP response cycles.
• Achieved 85%+ unit test coverage utilizing pytest and mock fixtures.

EDUCATION
University of Texas at Dallas
Bachelor of Science in Computer Information Systems & Technology | Dec 2025
Key Courses: Relational Databases, Operating Systems, Cloud Architecture, Python for Data Systems`,

    jobDescription: `Job Title: Junior Backend Software Engineer
Company: CloudPulse Systems
Location: Austin, TX (Hybrid)

Role Overview:
CloudPulse is looking for a driven Junior Backend Engineer to help maintain and scale our distributed cloud telemetry service. You will work on robust APIs, database migrations, and CI/CD automation alongside our engineering team.

Key Responsibilities:
• Develop, test, and document RESTful APIs in Python using FastAPI or Django REST Framework.
• Design and optimize PostgreSQL queries, schemas, and database migrations.
• Implement automated tests using pytest to maintain high test coverage in CI/CD pipelines.
• Assist with containerizing backend services using Docker and deploying to AWS (ECS/EKS).
• Troubleshoot production backend bottlenecks and monitor system health using Datadog.

Requirements:
• BS in Computer Science, Software Engineering, or equivalent practical experience.
• 0-2 years of backend programming experience in Python.
• Solid understanding of relational databases (PostgreSQL/MySQL) and SQL queries.
• Experience building or consuming RESTful APIs.
• Proficiency with Git for team collaboration.

Desired Skills:
• Experience with FastAPI or asynchronous Python (asyncio).
• Hands-on familiarity with Docker and AWS cloud services (S3, RDS, ECS).
• Knowledge of Redis caching strategies and message queues (Kafka, RabbitMQ, Celery).
• Experience setting up GitHub Actions workflows.`
  }
};
