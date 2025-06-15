import { PrismaClient, Users } from '@prisma/client'
import { BaseRepository } from '@/shared/repositories/BaseRepository'

export class UserRepository extends BaseRepository<Users> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'users')
  }

  // Add user-specific methods here
  async findByEmail(email: string): Promise<Users | null> {
    return this.prisma.users.findFirst({
      where: { email },
    })
  }

  async findByPhone(phone: string): Promise<Users | null> {
    return this.prisma.users.findFirst({
      where: { phone },
    })
  }
}
