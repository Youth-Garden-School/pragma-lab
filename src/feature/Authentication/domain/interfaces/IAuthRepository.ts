import { Role } from '@prisma/client'

export interface IAuthRepository {
  findByEmail(email: string): Promise<{
    userId: number
    email: string
    password: string
    role: Role
    name: string
    phone: string
  } | null>

  createUser(data: {
    email: string
    password: string
    name: string
    role: Role
    phone: string
  }): Promise<{
    userId: number
    email: string
    name: string
  }>
}
