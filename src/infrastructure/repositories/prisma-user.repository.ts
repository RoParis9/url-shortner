import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

    return new User(
      createdUser.id,
      createdUser.email,
      createdUser.password,
      createdUser.createdAt,
      createdUser.updatedAt
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt
    );
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        password: user.password,
        updatedAt: user.updatedAt
      }
    });

    return new User(
      updatedUser.id,
      updatedUser.email,
      updatedUser.password,
      updatedUser.createdAt,
      updatedUser.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }
} 