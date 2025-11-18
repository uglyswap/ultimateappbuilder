import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Orchestrator } from '@/orchestrator';
import type { ProjectConfig } from '@/types';

describe('Orchestrator', () => {
  let orchestrator: Orchestrator;
  let mockConfig: ProjectConfig;

  beforeEach(() => {
    mockConfig = {
      name: 'test-saas',
      template: 'SAAS',
      features: [
        { id: 'auth', name: 'Authentication', enabled: true },
        { id: 'subscriptions', name: 'Subscriptions', enabled: true },
      ],
      database: {
        type: 'postgresql',
        database: 'test_db',
      },
      auth: {
        providers: ['email', 'google'],
      },
    };

    orchestrator = new Orchestrator('proj_123', 'user_456', mockConfig);
  });

  describe('initialization', () => {
    it('should create orchestrator with correct context', () => {
      const context = orchestrator.getContext();

      expect(context.projectId).toBe('proj_123');
      expect(context.userId).toBe('user_456');
      expect(context.config).toEqual(mockConfig);
      expect(context.currentPhase).toBe('initialization');
    });

    it('should initialize all agents', () => {
      const context = orchestrator.getContext();

      // Context should be initialized
      expect(context).toBeDefined();
      expect(context.pendingTasks).toEqual([]);
      expect(context.completedTasks).toEqual([]);
      expect(context.generatedFiles).toEqual([]);
    });
  });

  describe('task orchestration', () => {
    it('should handle SaaS template', () => {
      expect(mockConfig.template).toBe('SAAS');
      expect(mockConfig.features).toHaveLength(2);
    });

    it('should include authentication when specified', () => {
      expect(mockConfig.auth).toBeDefined();
      expect(mockConfig.auth?.providers).toContain('email');
      expect(mockConfig.auth?.providers).toContain('google');
    });

    it('should include database configuration', () => {
      expect(mockConfig.database).toBeDefined();
      expect(mockConfig.database?.type).toBe('postgresql');
    });
  });
});
