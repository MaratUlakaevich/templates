import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashedPassword });
    return this.userRepo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({ where: { email } });
  }

  findOneById(id: string): Promise<User> {
    return this.userRepo.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.userRepo.update(id, data);
    return this.findOneById(id);
  }

  delete(id: string): Promise<void> {
    return this.userRepo.delete(id).then(() => undefined);
  }
}