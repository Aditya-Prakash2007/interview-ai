const resume = `
Aditya Prakash
Email: aditya.prakash@example.com

Phone: +91-9876543210
Location: Jamshedpur, India

Education

Bachelor of Technology in Computer Science
National Institute of Technology, Jamshedpur
2023 – 2027
CGPA: 8.5

Technical Skills
Programming Languages: C++, JavaScript
Frontend: React.js, Next.js, HTML, CSS, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB
Tools: Git, GitHub, VS Code
Concepts: Data Structures & Algorithms, REST APIs
Machine Learning: Basics of ANN, CNN, RNN
Projects

Complaint Management System

Developed a full-stack web application with role-based access (resident, worker, manager)
Implemented QR-based verification system
Designed token reward system for workers
Used React.js, Node.js, Express, MongoDB

AI Resume Analyzer

Built an AI-based system to compare resumes with job descriptions
Integrated Gemini API for text analysis and scoring
Generated match percentage and improvement suggestions
Experience

Web Development Intern
XYZ Tech Pvt Ltd
May 2025 – July 2025

Developed responsive UI components using React
Integrated backend APIs
Fixed bugs and improved application performance
`


const selfDescription = `
I am a highly motivated and curious Computer Science student with a strong interest in software development and artificial intelligence. I enjoy solving complex problems and building real-world applications that create impact. I have hands-on experience in full-stack development using technologies like React, Node.js, and MongoDB, and I continuously practice data structures and algorithms to improve my problem-solving abilities.

I am a quick learner who adapts easily to new technologies and environments. I work well both independently and in teams, and I believe in writing clean, efficient, and maintainable code. I am always eager to learn, take on new challenges, and grow as a developer. My goal is to secure a software development role where I can contribute to meaningful projects while continuously improving my skills.
`

const jobDescription = `
Position: Software Development Intern
Company: ABC Technologies
Location: Remote

We are seeking a motivated and passionate Software Development Intern to join our team. The ideal candidate should have a strong understanding of programming fundamentals and data structures, along with hands-on experience in web development.

Responsibilities
Develop and maintain web applications
Build responsive and user-friendly UI components
Work with backend APIs and databases
Debug issues and improve application performance
Collaborate with team members on ongoing projects
Requirements
Proficiency in JavaScript, HTML, and CSS
Experience with React.js or similar frontend frameworks
Basic knowledge of Node.js and backend development
Familiarity with Git and version control
Strong problem-solving skills
Preferred Qualifications
Experience with Next.js and MongoDB
Understanding of REST APIs
Interest in learning new technologies
`

module.exports = {
    resume,
    selfDescription,
    jobDescription
}