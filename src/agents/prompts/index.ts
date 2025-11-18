// World-Class AI Agent System Prompts
// Each agent has a specialized, comprehensive prompt engineered for optimal code generation

export { ORCHESTRATOR_SYSTEM_PROMPT } from './orchestrator.prompt';
export { BACKEND_SYSTEM_PROMPT } from './backend.prompt';
export { FRONTEND_SYSTEM_PROMPT } from './frontend.prompt';
export { DATABASE_SYSTEM_PROMPT } from './database.prompt';
export { AUTH_SYSTEM_PROMPT } from './auth.prompt';
export { INTEGRATIONS_SYSTEM_PROMPT } from './integrations.prompt';
export { DEVOPS_SYSTEM_PROMPT } from './devops.prompt';

// Prompt metadata for documentation
export const AGENT_PROMPTS = {
  orchestrator: {
    name: 'Chief Orchestrator Agent',
    description: 'Master coordinator that plans and delegates tasks to specialized agents',
    expertise: ['Architecture Design', 'Task Coordination', 'Quality Assurance'],
  },
  backend: {
    name: 'Backend Development Agent',
    description: 'Expert in server-side development with Node.js, Express, and TypeScript',
    expertise: ['REST APIs', 'Business Logic', 'Data Validation', 'Security', 'Performance'],
  },
  frontend: {
    name: 'Frontend Development Agent',
    description: 'Expert in React, UX/UI design, and modern web development',
    expertise: ['React Components', 'State Management', 'Styling', 'Accessibility', 'Performance'],
  },
  database: {
    name: 'Database Design Agent',
    description: 'Expert in database design and optimization with Prisma and PostgreSQL',
    expertise: ['Schema Design', 'Relationships', 'Indexing', 'Migrations', 'Performance'],
  },
  auth: {
    name: 'Authentication & Authorization Agent',
    description: 'Expert in application security and user authentication',
    expertise: ['JWT', 'OAuth', 'Password Security', 'Session Management', 'MFA'],
  },
  integrations: {
    name: 'Third-Party Integrations Agent',
    description: 'Expert in integrating external services reliably',
    expertise: ['Stripe', 'SendGrid', 'AWS', 'GitHub', 'Error Handling', 'Webhooks'],
  },
  devops: {
    name: 'DevOps & Deployment Agent',
    description: 'Expert in deployment, infrastructure, and CI/CD pipelines',
    expertise: ['Docker', 'CI/CD', 'Cloud Deployment', 'Monitoring', 'Security'],
  },
} as const;
