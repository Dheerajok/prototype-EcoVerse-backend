import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketItem, MarketItemDocument } from './schemas/market-item.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class MarketService {
  constructor(
    @InjectModel(MarketItem.name) private marketModel: Model<MarketItemDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll() {
    return this.marketModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(itemDto: any, userId?: string) {
    let sellerName = itemDto.sellerName;
    let sellerAvatar = itemDto.sellerAvatar;
    let sellerPlayerNumber = itemDto.sellerPlayerNumber;

    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user) {
        sellerName = user.name;
        sellerAvatar = user.avatar;
        sellerPlayerNumber = user.playerNumber;
      }
    }

    const newItem = new this.marketModel({
      ...itemDto,
      sellerName,
      sellerAvatar,
      sellerPlayerNumber,
    });

    return newItem.save();
  }
}
