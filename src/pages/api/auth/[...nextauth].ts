import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const prisma = new PrismaClient()

interface User {
  id: string
  name: string
  email: string
  role: Role
  phone: string
  rememberMe?: boolean
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember me', type: 'checkbox' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const user = await prisma.users.findFirst({
          where: { email: credentials.email },
          select: {
            userId: true,
            name: true,
            email: true,
            password: true,
            role: true,
            phone: true,
          },
        })

        if (user && user.password && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user.userId.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            rememberMe: credentials.rememberMe === 'true',
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as User
        token.id = typedUser.id
        token.role = typedUser.role
        token.phone = typedUser.phone
        token.rememberMe = typedUser.rememberMe

        const maxAge = typedUser.rememberMe ? 60 * 60 * 24 : 30 * 60 // 24 hours or 30 minutes
        const now = Math.floor(Date.now() / 1000)
        token.exp = now + maxAge
      }
      return token
    },

    async session({ session, token }: { session: any; token: any & { role: Role } }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name ?? ''
        session.user.role = token.role
        session.user.phone = token.phone
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
