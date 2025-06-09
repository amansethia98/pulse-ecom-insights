
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { google } from 'googleapis';

const auth = google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/spreadsheets/readonly'],
});

async function getUserFromSheet(email: string) {
  try {
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'users!A:D',
    });

    const rows = response.data.values;
    if (!rows) return null;

    const headers = rows[0];
    const userRow = rows.find(row => row[0] === email);
    
    if (!userRow) return null;

    return {
      email: userRow[0],
      hashedPassword: userRow[1],
      restaurant: userRow[2],
      role: userRow[3]
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await getUserFromSheet(credentials.email);
        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.email,
          email: user.email,
          restaurant: user.restaurant,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.restaurant = user.restaurant;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.restaurant = token.restaurant as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
