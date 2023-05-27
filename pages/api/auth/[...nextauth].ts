import { NextApiRequest } from 'next';
import { IncomingMessage } from 'http';
import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'my-project',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: 'email',
          type: 'email',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials?: Record<"email" | "password", string>      ) {
        if (!credentials) {
            throw new Error('Credentials not provided');
          }
        const payload = {
          identifier: credentials.email,
          password: credentials.password,
        };
        console.log(payload)
        const res = await axios.post(`${process.env.API_URL}`,{identifier:payload.identifier,password:payload.password})
        console.log(res)
        const user = await res.data.user

        if (!res) {
          throw new Error(user.message);
        }
        // If no error and we have user data, return it
        if (res && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.token,
          refreshToken: user.refreshToken,
        };
      }
      return token;
    },
    async session({ session, token }:any) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.accessTokenExpires;

      return session;
    },
  },
  
});