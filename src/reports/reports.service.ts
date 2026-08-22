import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WasteReport, WasteReportDocument } from './schemas/waste-report.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(WasteReport.name) private reportModel: Model<WasteReportDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll() {
    return this.reportModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(reportDto: any, userId?: string) {
    const newReport = new this.reportModel(reportDto);
    const saved = await newReport.save();

    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user) {
        user.ecoPoints = (user.ecoPoints || 0) + 10;
        (user as any).communityContributions = ((user as any).communityContributions || 0) + 1;
        user.sustainabilityScore = (user.sustainabilityScore || 0) + 5;
        await user.save();
      }
    }

    return saved;
  }

  async verifyReport(id: string, approve: boolean, userId?: string) {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = approve ? 'Cleaned' : 'Rejected';
    const updatedReport = await report.save();

    if (approve && userId) {
      const user = await this.userModel.findById(userId);
      if (user) {
        user.ecoPoints = (user.ecoPoints || 0) + 50;
        user.wasteRecoveredKg = (user.wasteRecoveredKg || 0) + (report.estimatedQuantityKg || 12);
        user.co2SavedKg = (user.co2SavedKg || 0) + 18.4;
        await user.save();
      }
    }

    return updatedReport;
  }
}
