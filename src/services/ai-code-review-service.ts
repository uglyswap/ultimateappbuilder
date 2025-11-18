import { logger } from '@/utils/logger';
import { universalAIClient } from '@/utils/universal-ai-client';

/**
 * AI Code Review Service
 *
 * Automated code review using AI:
 * - Security vulnerabilities
 * - Performance issues
 * - Code quality & best practices
 * - TypeScript type safety
 * - Accessibility issues
 * - Test coverage suggestions
 */

export interface CodeReviewResult {
  score: number;
  issues: CodeIssue[];
  suggestions: string[];
  summary: string;
}

export interface CodeIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'security' | 'performance' | 'quality' | 'accessibility' | 'types';
  line?: number;
  file?: string;
  message: string;
  suggestion?: string;
}

export class AICodeReviewService {
  /**
   * Review code using AI
   */
  async reviewCode(code: string, language: string = 'typescript'): Promise<CodeReviewResult> {
    logger.info('Starting AI code review');

    const prompt = `You are an expert code reviewer. Review this ${language} code for:
1. Security vulnerabilities (XSS, SQL injection, etc.)
2. Performance issues
3. Code quality & best practices
4. Type safety
5. Accessibility issues
6. Missing tests

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON in this format:
{
  "score": 85,
  "issues": [
    {
      "severity": "high",
      "category": "security",
      "line": 42,
      "message": "Potential XSS vulnerability",
      "suggestion": "Use DOMPurify to sanitize user input"
    }
  ],
  "suggestions": [
    "Add input validation",
    "Add error handling"
  ],
  "summary": "Overall good code quality with a few security concerns"
}`;

    const result = await universalAIClient.generateCode(prompt, 'backend', {
      autonomousMode: true,
      temperature: 0.3,
    });

    try {
      return JSON.parse(result.content);
    } catch (error) {
      logger.error('Failed to parse code review result', { error });
      return {
        score: 0,
        issues: [],
        suggestions: [],
        summary: 'Code review failed',
      };
    }
  }

  /**
   * Review entire project
   */
  async reviewProject(files: Record<string, string>): Promise<{
    overall: CodeReviewResult;
    fileReviews: Record<string, CodeReviewResult>;
  }> {
    logger.info('Reviewing entire project');

    const fileReviews: Record<string, CodeReviewResult> = {};

    for (const [filename, code] of Object.entries(files)) {
      const ext = filename.split('.').pop() || 'typescript';
      fileReviews[filename] = await this.reviewCode(code, ext);
    }

    // Calculate overall score
    const scores = Object.values(fileReviews).map(r => r.score);
    const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    const allIssues = Object.values(fileReviews).flatMap(r => r.issues);

    return {
      overall: {
        score: overallScore,
        issues: allIssues,
        suggestions: [],
        summary: `Project review complete. ${allIssues.length} issues found.`,
      },
      fileReviews,
    };
  }

  /**
   * Get improvement suggestions
   */
  async getSuggestions(code: string): Promise<string[]> {
    const review = await this.reviewCode(code);
    return review.suggestions;
  }

  /**
   * Auto-fix code issues
   */
  async autoFixCode(code: string): Promise<string> {
    logger.info('Auto-fixing code issues');

    const prompt = `Fix all issues in this code while maintaining functionality:

${code}

Return ONLY the fixed code, nothing else.`;

    const result = await universalAIClient.generateCode(prompt, 'backend', {
      autonomousMode: true,
      temperature: 0.2,
    });

    return result.content;
  }
}

export const aiCodeReviewService = new AICodeReviewService();
