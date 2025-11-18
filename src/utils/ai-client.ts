import Anthropic from '@anthropic-ai/sdk';
import { config } from '@/config';
import { logger } from './logger';
import type { AgentType } from '@/types';

export class AIClient {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.ai.apiKey,
    });
  }

  async generateCode(
    prompt: string,
    agentType: AgentType,
    systemPrompt?: string
  ): Promise<{ content: string; tokensUsed: number }> {
    try {
      logger.info(`Generating code with ${agentType} agent`);

      const response = await this.client.messages.create({
        model: config.ai.model,
        max_tokens: config.ai.maxTokens,
        temperature: config.ai.temperature,
        system: systemPrompt || this.getSystemPrompt(agentType),
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      const text = content.type === 'text' ? content.text : '';

      logger.info(`Code generation completed`, {
        agentType,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      });

      return {
        content: text,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      };
    } catch (error) {
      logger.error(`AI generation failed for ${agentType}`, { error });
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async streamGeneration(
    prompt: string,
    agentType: AgentType,
    onChunk: (chunk: string) => void
  ): Promise<{ content: string; tokensUsed: number }> {
    try {
      logger.info(`Streaming code generation with ${agentType} agent`);

      const stream = await this.client.messages.create({
        model: config.ai.model,
        max_tokens: config.ai.maxTokens,
        temperature: config.ai.temperature,
        system: this.getSystemPrompt(agentType),
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: true,
      });

      let fullContent = '';
      let tokensUsed = 0;

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          const chunk = event.delta.text;
          fullContent += chunk;
          onChunk(chunk);
        }

        if (event.type === 'message_stop') {
          // Estimate tokens (rough approximation)
          tokensUsed = Math.ceil(fullContent.length / 4);
        }
      }

      logger.info(`Streaming completed`, { agentType, tokensUsed });

      return { content: fullContent, tokensUsed };
    } catch (error) {
      logger.error(`AI streaming failed for ${agentType}`, { error });
      throw new Error(`AI streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getSystemPrompt(agentType: AgentType): string {
    // Import world-class system prompts
    const {
      ORCHESTRATOR_SYSTEM_PROMPT,
      BACKEND_SYSTEM_PROMPT,
      FRONTEND_SYSTEM_PROMPT,
      DATABASE_SYSTEM_PROMPT,
      AUTH_SYSTEM_PROMPT,
      INTEGRATIONS_SYSTEM_PROMPT,
      DEVOPS_SYSTEM_PROMPT,
    } = require('@/agents/prompts');

    const agentPrompts: Record<AgentType, string> = {
      orchestrator: ORCHESTRATOR_SYSTEM_PROMPT,
      backend: BACKEND_SYSTEM_PROMPT,
      frontend: FRONTEND_SYSTEM_PROMPT,
      database: DATABASE_SYSTEM_PROMPT,
      auth: AUTH_SYSTEM_PROMPT,
      integrations: INTEGRATIONS_SYSTEM_PROMPT,
      devops: DEVOPS_SYSTEM_PROMPT,
      designer: FRONTEND_SYSTEM_PROMPT, // Designer uses frontend prompt
    };

    return agentPrompts[agentType] || BACKEND_SYSTEM_PROMPT;
  }
}

export const aiClient = new AIClient();
