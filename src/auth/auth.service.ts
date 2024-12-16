import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const user = await this.usersService.create(email, password);
    return this.generateToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
