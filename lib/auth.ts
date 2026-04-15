import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import crypto from "crypto"
import { createUser, getUserByEmail, updateUser, verifyUserPassword } from "@/lib/store"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { User } from "@/types"

function ensureStoreUser(params: { email: string; name?: string | null; idHint?: string }): User {
  const existing = getUserByEmail(params.email)
  if (existing) return existing

  const user = createUser({
    id: params.idHint || crypto.randomUUID(),
    name: params.name?.trim() || params.email.split("@")[0] || "User",
    email: params.email,
    xp: 0,
    level: "Beginner",
    streak: 1,
    badges: [],
    completedModules: [],
    lastLogin: new Date().toISOString()
  })
  return user
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
          })
        ]
      : []),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email : ""
        const password = typeof credentials?.password === "string" ? credentials.password : ""

        if (!email || !password) return null

        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error || !data.user?.email) return null

          const storeUser = ensureStoreUser({
            email: data.user.email,
            name: (data.user.user_metadata?.name as string | undefined) ?? data.user.email,
            idHint: data.user.id
          })
          updateUser(storeUser.id, { lastLogin: new Date().toISOString() })
          return storeUser as unknown as Record<string, unknown>
        }

        // Fallback local auth when Supabase env vars are not configured.
        const user = getUserByEmail(email)
        if (!user) return null
        const isValidPassword = await verifyUserPassword(email, password)
        if (!isValidPassword) return null

        updateUser(user.id, { lastLogin: new Date().toISOString() })

        // Returned object becomes `token.user` via callbacks below.
        return user as unknown as Record<string, unknown>
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.trim()
      if (!email) return false

      const storeUser = ensureStoreUser({
        email,
        name: user.name,
        idHint: user.id
      })
      updateUser(storeUser.id, { lastLogin: new Date().toISOString() })
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        const incoming = user as unknown as Partial<User> & { email?: string | null }
        if (incoming.email) {
          const storeUser = ensureStoreUser({
            email: incoming.email,
            name: incoming.name,
            idHint: incoming.id
          })
          token.user = storeUser
        } else {
          token.user = user as unknown as User
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        ;(session as { user: User }).user = token.user as User
      }
      return session
    }
  }
})

