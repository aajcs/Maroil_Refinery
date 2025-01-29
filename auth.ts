import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginUser } from "./app/api/userService";
// Your own logic for dealing with plaintext password strings; be careful!

interface ExtendedUser extends User {
  usuario: string;
  token: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        correo: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          console.log("credentials", credentials);
          let user = null;

          user = await loginUser(credentials);
          console.log(user);

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
  session: { strategy: "jwt" },
  // callbacks: {
  //   async jwt(token, user, account, profile, isNewUser) {
  //     // Add the user id to the token
  //     if (user) {
  //       token.id = user.id;
  //     }
  //     return token;
  //   },
  //   async session(session, token) {
  //     // Add the user id to the session
  //     session.id = token.id;
  //     return session;
  //   },
  // },

  callbacks: {
    // jwt() se ejecuta cada vez que se crea o actualiza un token JWT.
    // Aquí es donde puedes agregar información adicional al token.
    jwt({ token, user }) {
      if (user) {
        token.user = (user as ExtendedUser).usuario;
        token.token = (user as ExtendedUser).token;
      }
      return token;
    },
    // session() se utiliza para agregar la información del token a la sesión del usuario,
    // lo que hace que esté disponible en el cliente.
    session({ session, token }) {
      if (session.user) {
        (session.user as unknown as ExtendedUser).usuario =
          token.user as string;
        (session.user as unknown as ExtendedUser).token = token.token as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.AUTH_SECRET,
});
