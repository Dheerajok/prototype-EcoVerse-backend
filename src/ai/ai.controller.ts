import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body('message') message: string, @Body('history') history?: any[]) {
    if (!message || !message.trim()) {
      return { reply: 'Please ask a valid sustainability question.' };
    }
    const reply = await this.aiService.generateChatResponse(message, history);
    return { reply };
  }
}
