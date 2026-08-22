import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WasteReportDocument = WasteReport & Document;

@Schema({ timestamps: true })
export class WasteReport {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [String], default: [] })
  detectedMaterials: string[];

  @Prop({ default: 10 })
  estimatedQuantityKg: number;

  @Prop({ default: 'High' })
  severity: string;

  @Prop({ default: 80 })
  recyclablePercentage: number;

  @Prop({ default: 'Reported' })
  status: string;

  @Prop({ required: true })
  reportedBy: string;

  @Prop({ default: 10 })
  pointsAwarded: number;

  @Prop({ default: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600' })
  imageUrl: string;

  @Prop({ default: 'Eco Hub #2' })
  nearestCollectionPoint: string;

  @Prop({ default: 250 })
  distanceMeters: number;
}

export const WasteReportSchema = SchemaFactory.createForClass(WasteReport);
