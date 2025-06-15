import { Role } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name?: string | null
    email?: string | null
    role: Role
    phone: string
  }

  interface Session {
    user: User
  }
}
