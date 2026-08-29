import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * A bcrypt hash of the string "unreachable-placeholder". When no admin account
 * is configured, or the submitted email does not match, we still run a compare
 * against this so a wrong email and a wrong password cost the same amount of
 * time. Without it, response latency reveals whether the email is correct.
 */
const DUMMY_HASH = "$2b$12$Q0y0Q7Qk1nQ0z6r9nS1Yq.uS9K9Vd2sV1p0eYcQ8oO7wG5tHqQ2Ue";

function adminEmail() {
  return (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
}

function adminPasswordHash() {
  const hash = (process.env.ADMIN_PASSWORD_HASH || "").trim();
  if (hash) return hash;

  // Escape hatch for local development. `npm run hash` generates the hash that
  // should be used in any deployed environment instead.
  const plain = process.env.ADMIN_PASSWORD;
  if (plain) return bcrypt.hashSync(plain, 10);

  return "";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const expectedEmail = adminEmail();
        const expectedHash = adminPasswordHash();

        const emailMatches =
          expectedEmail.length > 0 && email.trim().toLowerCase() === expectedEmail;

        const passwordMatches = await bcrypt.compare(
          password,
          emailMatches && expectedHash ? expectedHash : DUMMY_HASH,
        );

        if (!emailMatches || !expectedHash || !passwordMatches) return null;

        return {
          id: "admin",
          email: expectedEmail,
          name: process.env.ADMIN_NAME || "Admin",
          role: "admin",
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) ?? "admin";
      }
      return session;
    },
  },
});

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}
