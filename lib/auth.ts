import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail, updateUser } from "@/lib/store"
import type { User } from "@/types"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
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

        const user = getUserByEmail(email)
        if (!user) return null

        updateUser(user.id, { lastLogin: new Date().toISOString() })

        // Returned object becomes `token.user` via callbacks below.
        return user as unknown as Record<string, unknown>
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as unknown as User
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

