import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SurplusFoodListing, SurplusFoodDocument } from './schemas/surplus-food.schema';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(SurplusFoodListing.name) private foodModel: Model<SurplusFoodDocument>,
  ) {}

  async findAll() {
    return this.foodModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(foodDto: any) {
    const newListing = new this.foodModel(foodDto);
    return newListing.save();
  }

  async reserve(id: string) {
    const listing = await this.foodModel.findById(id);
    if (!listing) {
      throw new NotFoundException('Food listing not found');
    }
    listing.status = 'Reserved';
    return listing.save();
  }
}
