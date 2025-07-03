import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { googleSingIn, loginUser } from "../../userService";
import { Usuario } from "@/libs/interfaces";
import GoogleProvider from "next-auth/providers/google";
declare module "next-auth" {
  interface Session {
    user: {
      usuario?: Usuario;
    } & DefaultSession["user"];
  }
}
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // console.log("credentials", credentials);
          let user = null;

          user = await loginUser(credentials);
          // console.log(user);

          if (!user) {
            // No user found, so this is their first attempt to login
            // Optionally, this is also the place you could do a user registration
            throw new Error("Datos invalidos.");
          }
          return user;
        } catch (error) {
          // console.log("errordeauth", error.response.data);
          return null;
        }
        // return user object with their profile data
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 días
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) token.user = user;
      if (account?.provider === "google") {
        try {
          // const response = await fetch(
          //   `${process.env.BACKEND_API_URL}/auth/google`,
          //   {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({
          //       access_token: account.access_token,
          //       id_token: account.id_token,
          //     }),
          //   }
          // );
          const response = await googleSingIn({
            access_token: account.access_token,
            id_token: account.id_token,
          });
          console.log("response", response);
          // const googleUser = await response.json();

          if (response) {
            //   token.id = googleUser._id;
            //   token.role = googleUser.role;
            //   token.email = googleUser.email;
            //   token.name = googleUser.name;
            token.user = response;
          }
          console.log(token);
        } catch (error) {
          console.error("Google auth error:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
    // async signIn({ user, account, profile }) {
    //   // Verificar si el usuario ya existe
    //   const existingUser = await prisma.user.findUnique({
    //     where: { email: user.email! },
    //   });

    //   if (account?.provider === "google") {
    //     // Crear nuevo usuario si no existe
    //     if (!existingUser) {
    //       await prisma.user.create({
    //         data: {
    //           email: user.email!,
    //           name: user.name!,
    //           role: "USER", // Rol por defecto
    //           accounts: {
    //             create: {
    //               provider: account.provider,
    //               providerAccountId: account.providerAccountId,
    //               type: account.type,
    //             },
    //           },
    //         },
    //       });
    //     } else {
    //       // Vincular cuenta Google a usuario existente
    //       await prisma.account.create({
    //         data: {
    //           userId: existingUser.id,
    //           provider: account.provider,
    //           providerAccountId: account.providerAccountId,
    //           type: account.type,
    //         },
    //       });
    //     }
    //   }
    //   return true;
    // },
  },
  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
