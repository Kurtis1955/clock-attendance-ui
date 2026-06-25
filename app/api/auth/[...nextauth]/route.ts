
import { authOptions } from "@/utils/security";
// import { encryptToken } from "@/utils/helpers";

import NextAuth from "next-auth/next";

// import { jwtDecode } from 'jwt-decode';


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
