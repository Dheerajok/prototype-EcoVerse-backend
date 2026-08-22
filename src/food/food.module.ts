import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { SurplusFoodListing, SurplusFoodSchema } from './schemas/surplus-food.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SurplusFoodListing.name, schema: SurplusFoodSchema },
    ]),
  ],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
