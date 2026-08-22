import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.postsService.create(body, req.user._id);
  }

  @Post(':id/like')
  async like(@Param('id') id: string) {
    return this.postsService.likePost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  async addComment(@Request() req: any, @Param('id') id: string, @Body('text') text: string) {
    return this.postsService.addComment(id, text, req.user._id);
  }
}
