import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password, role } = registerDto;

    const existingUser = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const randomPlayerNumber = `#${Math.floor(100 + Math.random() * 900)}`;

    const isAdminEmail = email.toLowerCase() === 'thakrethe@gmail.com';
    const assignedRole = isAdminEmail ? 'admin' : (role || 'student');

    const newUser = new this.userModel({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: assignedRole,
      playerNumber: randomPlayerNumber,
      sustainabilityScore: 0,
      ecoPoints: 0,
      wasteRecoveredKg: 0,
      co2SavedKg: 0,
      communityContributions: 0,
      followersCount: 0,
      followingCount: 0,
      level: 'Rookie Contestant (Tier 1)',
    });

    const savedUser = await newUser.save();
    const token = this.generateJwtToken(savedUser);

    return {
      message: 'Registration successful',
      user: this.formatUserObj(savedUser),
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Default admin check for thakrethe@gmail.com
    if (user.email === 'thakrethe@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = this.generateJwtToken(user);

    return {
      message: 'Login successful',
      user: this.formatUserObj(user),
      token,
    };
  }

  async promoteUserToAdmin(targetEmailOrId: string) {
    let user = await this.userModel.findOne({ email: targetEmailOrId.toLowerCase() });
    if (!user) {
      try {
        user = await this.userModel.findById(targetEmailOrId);
      } catch (e) {}
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = 'admin';
    await user.save();

    return {
      message: `User ${user.email} has been successfully promoted to Admin`,
      user: this.formatUserObj(user),
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return this.formatUserObj(user);
  }

  async updateProfile(userId: string, updateProfileDto: any) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    if (updateProfileDto.name) user.name = updateProfileDto.name;
    if (updateProfileDto.avatar) user.avatar = updateProfileDto.avatar;
    if (updateProfileDto.level) (user as any).level = updateProfileDto.level;
    if (updateProfileDto.wasteRecoveredKg !== undefined) user.wasteRecoveredKg = updateProfileDto.wasteRecoveredKg;
    if (updateProfileDto.co2SavedKg !== undefined) user.co2SavedKg = updateProfileDto.co2SavedKg;
    if (updateProfileDto.ecoPoints !== undefined) user.ecoPoints = updateProfileDto.ecoPoints;
    if (updateProfileDto.communityContributions !== undefined) (user as any).communityContributions = updateProfileDto.communityContributions;
    if (updateProfileDto.followersCount !== undefined) (user as any).followersCount = updateProfileDto.followersCount;
    if (updateProfileDto.followingCount !== undefined) (user as any).followingCount = updateProfileDto.followingCount;

    const updatedUser = await user.save();
    return {
      message: 'Profile updated successfully',
      user: this.formatUserObj(updatedUser),
    };
  }

  private formatUserObj(user: UserDocument) {
    const obj = user.toObject ? user.toObject() : user;
    return {
      id: obj._id,
      name: obj.name,
      email: obj.email,
      role: obj.role,
      playerNumber: obj.playerNumber,
      sustainabilityScore: obj.sustainabilityScore ?? 0,
      ecoPoints: obj.ecoPoints ?? 0,
      wasteRecoveredKg: obj.wasteRecoveredKg ?? 0,
      co2SavedKg: obj.co2SavedKg ?? 0,
      communityContributions: obj.communityContributions ?? 0,
      followersCount: obj.followersCount ?? 0,
      followingCount: obj.followingCount ?? 0,
      level: obj.level || 'Rookie Contestant (Tier 1)',
      avatar: obj.avatar,
    };
  }

  private generateJwtToken(user: UserDocument): string {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }
}
