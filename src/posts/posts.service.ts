import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialPost, SocialPostDocument } from './schemas/social-post.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(SocialPost.name) private postModel: Model<SocialPostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll() {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(postDto: any, userId?: string) {
    let authorName = postDto.authorName;
    let authorAvatar = postDto.authorAvatar;

    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user) {
        authorName = user.name;
        authorAvatar = user.avatar;

        // Award +50 Eco Points to user in database
        user.ecoPoints = (user.ecoPoints || 0) + 50;
        (user as any).communityContributions = ((user as any).communityContributions || 0) + 1;
        user.sustainabilityScore = (user.sustainabilityScore || 0) + 10;
        await user.save();
      }
    }

    const newPost = new this.postModel({
      ...postDto,
      authorName,
      authorAvatar,
      pointsEarned: 50,
      likesCount: 1,
      isLiked: true,
      comments: [],
    });

    return newPost.save();
  }

  async likePost(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.isLiked = !post.isLiked;
    post.likesCount = post.isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);
    return post.save();
  }

  async addComment(id: string, text: string, userId?: string) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let authorName = 'Eco Contributor';
    let authorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user) {
        authorName = user.name;
        authorAvatar = user.avatar;
      }
    }

    post.comments.push({
      id: 'c-' + Date.now(),
      authorName,
      authorAvatar,
      text,
      timestamp: 'Just now',
    });

    return post.save();
  }
}
