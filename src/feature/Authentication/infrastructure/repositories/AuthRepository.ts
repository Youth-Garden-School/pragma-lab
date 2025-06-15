import { Role } from '@prisma/client'
import prisma from '@/configs/prisma/prisma'
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository'

class AuthRepository implements IAuthRepository {
  async findByEmail(email: string) {
    return prisma.users.findFirst({
      where: { email },
      select: {
        userId: true,
        email: true,
        password: true,
        role: true,
        name: true,
        phone: true,
      },
    })
  }

  async createUser(data: {
    email: string
    password: string
    name: string
    role: Role
    phone: string
  }) {
    const user = await prisma.users.create({
      data,
      select: {
        userId: true,
        email: true,
        name: true,
      },
    })
    return user
  }
}

export const authRepository = new AuthRepository()
