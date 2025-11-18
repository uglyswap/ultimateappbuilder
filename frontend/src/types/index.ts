// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  template: ProjectTemplate;
  status: ProjectStatus;
  config: ProjectConfig;
  generatedFiles?: GeneratedFile[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export enum ProjectTemplate {
  SAAS = 'SAAS',
  ECOMMERCE = 'ECOMMERCE',
  BLOG = 'BLOG',
  API = 'API',
}

export enum ProjectStatus {
  DRAFT = 'draft',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ARCHIVED = 'archived',
}

export interface ProjectConfig {
  name: string;
  description?: string;
  template: ProjectTemplate;
  features: Feature[];
  database?: DatabaseConfig;
  auth?: AuthConfig;
  integrations?: Integration[];
  deployment?: DeploymentConfig;
}

export interface Feature {
  name: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface DatabaseConfig {
  type: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';
  version?: string;
}

export interface AuthConfig {
  providers: AuthProvider[];
  features: {
    emailVerification?: boolean;
    passwordReset?: boolean;
    mfa?: boolean;
    socialLogin?: boolean;
  };
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  GITHUB = 'github',
  FACEBOOK = 'facebook',
}

export interface Integration {
  name: string;
  type: IntegrationType;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export enum IntegrationType {
  STRIPE = 'stripe',
  SENDGRID = 'sendgrid',
  AWS_S3 = 'aws_s3',
  TWILIO = 'twilio',
  ANALYTICS = 'analytics',
}

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'aws' | 'docker' | 'railway';
  region?: string;
  customDomain?: string;
}

// Generated Files
export interface GeneratedFile {
  path: string;
  content: string;
  language?: string;
  size?: number;
}

// Generation
export interface Generation {
  id: string;
  projectId: string;
  status: GenerationStatus;
  progress: number;
  agentStatuses: AgentStatus[];
  logs: GenerationLog[];
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export enum GenerationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface AgentStatus {
  name: string;
  type: AgentType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  filesGenerated?: number;
  error?: string;
}

export enum AgentType {
  DATABASE = 'database',
  BACKEND = 'backend',
  FRONTEND = 'frontend',
  AUTH = 'auth',
  INTEGRATIONS = 'integrations',
  DEVOPS = 'devops',
  ORCHESTRATOR = 'orchestrator',
}

export interface GenerationLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  agent: AgentType;
  message: string;
  data?: Record<string, unknown>;
}

// Templates
export interface Template {
  id: string;
  name: string;
  description: string;
  template: ProjectTemplate;
  features: string[];
  tags: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  preview?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form Types
export interface CreateProjectFormData {
  name: string;
  description?: string;
  template: ProjectTemplate;
  database: DatabaseConfig;
  auth?: AuthConfig;
  features: Feature[];
  integrations?: Integration[];
  deployment?: DeploymentConfig;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: unknown;
}

export enum WebSocketMessageType {
  GENERATION_STARTED = 'generation_started',
  GENERATION_PROGRESS = 'generation_progress',
  GENERATION_COMPLETED = 'generation_completed',
  GENERATION_FAILED = 'generation_failed',
  AGENT_STATUS_UPDATE = 'agent_status_update',
  LOG_MESSAGE = 'log_message',
  FILE_GENERATED = 'file_generated',
}

export interface GenerationProgressPayload {
  projectId: string;
  generationId: string;
  progress: number;
  currentAgent: AgentType;
  message: string;
}

export interface AgentStatusUpdatePayload {
  projectId: string;
  generationId: string;
  agent: AgentStatus;
}

export interface FileGeneratedPayload {
  projectId: string;
  generationId: string;
  file: GeneratedFile;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}
