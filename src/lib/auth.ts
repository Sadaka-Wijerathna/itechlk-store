import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import type { Adapter } from 'next-auth/adapters'

// Custom adapter wrapper to handle existing users
function CustomPrismaAdapter(p: typeof prisma): Adapter {
  const adapter = PrismaAdapter(p) as Adapter
  
  return {
    ...adapter,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createUser(data: any) {
      try {
        // Check if user with this googleId already exists
        if (data.googleId) {
          const existingUser = await p.user.findUnique({
            where: { googleId: data.googleId },
          })
          if (existingUser) {
            return existingUser
          }
        }
        
        // Check if user with this email already exists
        if (data.email) {
          const existingUser = await p.user.findUnique({
            where: { email: data.email },
          })
          if (existingUser) {
            // Update existing user with googleId if not set
            if (data.googleId && !existingUser.googleId) {
              return await p.user.update({
                where: { email: data.email },
                data: { googleId: data.googleId },
              })
            }
            return existingUser
          }
        }
        
        // Create new user
        return await p.user.create({ data })
      } catch (error) {
        console.error('Error in createUser:', error)
        throw error
      }
    },
  }
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          googleId: profile.sub,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.sub) {
        try {
          // Check if user exists with this googleId
          const existingUser = await prisma.user.findUnique({
            where: { googleId: profile.sub },
          })

          if (existingUser) {
            // User exists, allow sign in
            return true
          }

          // Check if user exists with this email
          const existingEmailUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (existingEmailUser && !existingEmailUser.googleId) {
            // Link Google account to existing email user
            await prisma.user.update({
              where: { email: user.email! },
              data: { googleId: profile.sub },
            })
            return true
          }

          // New user, will be created by adapter
          return true
        } catch (error) {
          console.error('Sign in error:', error)
          return false
        }
      }
      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.isAdmin = user.isAdmin || false
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', code, metadata)
    },
  },
}
