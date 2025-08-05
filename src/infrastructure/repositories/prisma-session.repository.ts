import { PrismaClient } from '@prisma/client';
import { Session } from '../../domain/entities/session.entity';
import { SessionRepository } from '../../domain/repositories/session.repository.interface';

export class PrismaSessionRepository implements SessionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(session: Session): Promise<Session> {
    const createdSession = await this.prisma.session.create({
      data: {
        id: session.id,
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent
      }
    });

    return new Session(
      createdSession.id,
      createdSession.userId,
      createdSession.token,
      createdSession.expiresAt,
      createdSession.createdAt,
      createdSession.ipAddress,
      createdSession.userAgent
    );
  }

  async findById(id: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { id }
    });

    if (!session) return null;

    return new Session(
      session.id,
      session.userId,
      session.token,
      session.expiresAt,
      session.createdAt,
      session.ipAddress,
      session.userAgent
    );
  }

  async findByToken(token: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { token }
    });

    if (!session) return null;

    return new Session(
      session.id,
      session.userId,
      session.token,
      session.expiresAt,
      session.createdAt,
      session.ipAddress,
      session.userAgent
    );
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return sessions.map(session => new Session(
      session.id,
      session.userId,
      session.token,
      session.expiresAt,
      session.createdAt,
      session.ipAddress,
      session.userAgent
    ));
  }

  async update(session: Session): Promise<Session> {
    const updatedSession = await this.prisma.session.update({
      where: { id: session.id },
      data: {
        token: session.token,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent
      }
    });

    return new Session(
      updatedSession.id,
      updatedSession.userId,
      updatedSession.token,
      updatedSession.expiresAt,
      updatedSession.createdAt,
      updatedSession.ipAddress,
      updatedSession.userAgent
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.session.delete({
      where: { id }
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId }
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
} 