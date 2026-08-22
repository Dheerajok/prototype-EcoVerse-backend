import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MarketItemDocument = MarketItem & Document;

@Schema({ timestamps: true })
export class MarketItem {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  priceInr: number;

  @Prop({ default: 0 })
  pointsCost?: number;

  @Prop({ default: 50 })
  ecoPointsBonus?: number;

  @Prop({ required: true })
  sellerName: string;

  @Prop({ default: 'Contestant' })
  sellerRole: string;

  @Prop({ default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' })
  sellerAvatar: string;

  @Prop({ default: '#456' })
  sellerPlayerNumber: string;

  @Prop({ default: 'Campus Eco Hub #1' })
  location: string;

  @Prop({ default: 'Used / Upcycled' })
  condition: string;

  @Prop({ default: 'High quality upcycled item saved from landfill.' })
  description: string;

  @Prop({ default: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600' })
  imageUrl: string;

  @Prop({ default: false })
  isSold?: boolean;
}

export const MarketItemSchema = SchemaFactory.createForClass(MarketItem);
