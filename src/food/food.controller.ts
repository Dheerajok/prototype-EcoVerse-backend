import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { FoodService } from './food.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  async findAll() {
    return this.foodService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any) {
    return this.foodService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reserve')
  async reserve(@Param('id') id: string) {
    return this.foodService.reserve(id);
  }
}
