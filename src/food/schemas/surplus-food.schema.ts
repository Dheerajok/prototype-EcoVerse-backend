import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SurplusFoodDocument = SurplusFoodListing & Document;

@Schema({ timestamps: true })
export class SurplusFoodListing {
  @Prop({ required: true })
  restaurantName: string;

  @Prop({ default: '☕' })
  restaurantLogo: string;

  @Prop({ required: true })
  foodName: string;

  @Prop({ default: 'Meals' })
  category: string;

  @Prop({ default: '5 Servings' })
  quantityLabel: string;

  @Prop({ default: 200 })
  originalPriceInr: number;

  @Prop({ default: 100 })
  discountedPriceInr: number;

  @Prop({ default: 50 })
  discountPercentage: number;

  @Prop({ default: 'Today, 6 PM - 9 PM' })
  pickupWindow: string;

  @Prop({ default: 5 })
  availableServings: number;

  @Prop({ default: 'Campus Canteen Hub' })
  location: string;

  @Prop({ default: 'Available' })
  status: string;

  @Prop({ default: 'Freshly Prepared Today' })
  bestBeforeInfo: string;

  @Prop({ default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600' })
  imageUrl: string;
}

export const SurplusFoodSchema = SchemaFactory.createForClass(SurplusFoodListing);
