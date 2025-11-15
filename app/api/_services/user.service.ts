import { User } from '@/generated/prisma/client';
import { prisma } from '../prisma';
import { hashPassword } from './auth.service';

export async function findUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function findUserBySessionId(id: string): Promise<User | null> {
  if (!id) return null;

  const session = await prisma.userSession.findUnique({
    where: { id },
    select: { user: true },
  });

  return session?.user ?? null;
}

export async function updateUser(
  id: number,
  input: Partial<User>
): Promise<User> {
  return prisma.user.update({ where: { id }, data: input });
}

export async function updateUserPassword(
  id: number,
  password: string
): Promise<User> {
  const hashedPassword = await hashPassword(password);

  return prisma.user.update({ where: { id }, data: { hashedPassword } });
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<User> {
  const hashedPassword = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      name: input.name,
      hashedPassword,
    },
  });
}

export type UserResponse = {
  id: number;
  createdAt: string;
  updatedAt: string;

  email: string;
  name: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    email: user.email,
    name: user.name,
  };
}
