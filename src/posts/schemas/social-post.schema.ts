import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SocialPostDocument = SocialPost & Document;

@Schema({ _id: false })
export class CommentItem {
  @Prop({ default: () => 'c-' + Date.now() })
  id: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  authorAvatar: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: 'Just now' })
  timestamp: string;
}

export const CommentItemSchema = SchemaFactory.createForClass(CommentItem);

@Schema({ timestamps: true })
export class SocialPost {
  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  authorAvatar: string;

  @Prop({ default: 'Verified Contributor' })
  authorBadge: string;

  @Prop({ default: 'Contribution' })
  postType: string;

  @Prop({ default: 'Just now' })
  timestamp: string;

  @Prop({ default: 'SAGE University Campus' })
  locationTag: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  imageUrl?: string;

  @Prop({ default: 'Verified Action' })
  impactBadge?: string;

  @Prop({ default: 50 })
  pointsEarned?: number;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: false })
  isLiked?: boolean;

  @Prop({ type: [CommentItemSchema], default: [] })
  comments: CommentItem[];

  @Prop({ default: 0 })
  sharesCount: number;
}

export const SocialPostSchema = SchemaFactory.createForClass(SocialPost);
