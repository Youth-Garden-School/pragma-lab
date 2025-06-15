import { PrismaClient } from '@prisma/client'

type PrismaModel = keyof Omit<
  PrismaClient,
  | symbol
  | `$${string}`
  | `_${string}`
  | `$connect`
  | `$disconnect`
  | `$on`
  | `$transaction`
  | `$use`
  | `$extends`
>

export class BaseRepository<T extends { userId: number }> {
  protected prisma: PrismaClient
  protected model: PrismaModel

  constructor(prisma: PrismaClient, model: PrismaModel) {
    this.prisma = prisma
    this.model = model
  }

  async findById(id: number): Promise<T | null> {
    return (this.prisma[this.model] as any).findUnique({
      where: { id },
    })
  }

  async findByUserId(userId: number): Promise<T[]> {
    return (this.prisma[this.model] as any).findMany({
      where: { userId },
    })
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    return (this.prisma[this.model] as any).create({
      data: data as any,
    })
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return (this.prisma[this.model] as any).update({
      where: { id },
      data: data as any,
    })
  }

  async delete(id: number): Promise<T> {
    return (this.prisma[this.model] as any).delete({
      where: { id },
    })
  }

  async findMany(params: {
    skip?: number
    take?: number
    where?: any
    orderBy?: any
  }): Promise<T[]> {
    return (this.prisma[this.model] as any).findMany(params)
  }

  async count(where?: any): Promise<number> {
    return (this.prisma[this.model] as any).count({ where })
  }
}
