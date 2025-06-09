
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      restaurant: string;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    restaurant: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    restaurant: string;
    role: string;
  }
}
