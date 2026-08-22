import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['student', 'corporate', 'admin'], default: 'student' })
  role: string;

  @Prop({ default: '#456' })
  playerNumber: string;

  @Prop({ default: 0 })
  sustainabilityScore: number;

  @Prop({ default: 0 })
  ecoPoints: number;

  @Prop({ default: 0 })
  wasteRecoveredKg: number;

  @Prop({ default: 0 })
  co2SavedKg: number;

  @Prop({ default: 0 })
  communityContributions: number;

  @Prop({ default: 0 })
  followersCount: number;

  @Prop({ default: 0 })
  followingCount: number;

  @Prop({ default: 'Rookie Contestant (Tier 1)' })
  level: string;

  @Prop({ default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Ensure password is not exposed in JSON output
UserSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    delete ret.password;
    return ret;
  },
});
