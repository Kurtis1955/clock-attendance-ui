import { getServerSession } from "next-auth";
import { AuthOptions, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import KeycloakProvider from "next-auth/providers/keycloak";
import { getSession } from "next-auth/react";

export const getAccessToken = async () => {
  const session: any = await getServerSession(authOptions);
  // console.log("session is here>>", session)
  if (session) {
    const accessTokenDecrypted = session.accessToken;
    return accessTokenDecrypted;
  }
  return null;
};

export const getUserName = async () => {
  const session: any = await getServerSession(authOptions);
  console.log("session is nameeeee>>", session);
  if (session) {
    const sessionName = session.user.name;
    return sessionName;
  }
  return null;
};

// function requestRefreshOfAccessToken(token: JWT) {
// 	return fetch(`${process.env.KEYCLOAK_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`, {
// 	  headers: { "Content-Type": "application/x-www-form-urlencoded" },
// 	  body: new URLSearchParams({
// 		client_id: process.env.KEYCLOAK_CLIENT_ID,
// 		client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
// 		grant_type: "refresh_token",
// 		refresh_token: token.refreshToken! as any,
// 	  }),
// 	  method: "POST",
// 	  cache: "no-store",
// 	});
//   }
function requestRefreshOfAccessToken(token: JWT) {
  return fetch(
    `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID ?? "",
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
        grant_type: "refresh_token",
        refresh_token: String(token.refreshToken ?? ""),
      }),
      method: "POST",
      cache: "no-store",
    }
  );
}


export const authOptions: AuthOptions = {

  providers: [
    KeycloakProvider({
      id: "keycloak", // Explicitly set the provider ID
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: {
        params: {
          response_type: "code",
         // redirect_uri: `${process.env.NEXTAUTH_URL}/auth/callback`,

        },
        
      },

      profile(profile) {
        console.log("Profile", profile);
        return {
          id: profile.sub,
          name: profile.preferred_username || profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  session: {
    maxAge: 60 * 30,
  },

  callbacks: {

    async jwt({ token, account, profile }) {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.profile = profile;

        return token;
      }
      // we take a buffer of one minute(60 * 1000 ms)
      if (Date.now() < +token.expiresAt! * 1000 - 60 * 1000) {
        return token;
      } else {
        try {
          const response = await requestRefreshOfAccessToken(token);

          const tokens: TokenSet = await response.json();

          if (!response.ok) throw tokens;

          const updatedToken: JWT = {
            ...token, // Keep the previous token properties
            idToken: tokens.id_token,
            accessToken: tokens.access_token,
            expiresAt: Math.floor(
              Date.now() / 1000 + (tokens.expires_in as number)
            ),
            refreshToken: tokens.refresh_token ?? token.refreshToken,
          };
          console.log("updatedToken>>", updatedToken);
          return updatedToken;
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
    },
    async session({ session, token, user }: any) {
      //console.log("session callback>>", session, "token",token,"user",user);
      session.id_token = token.idToken;
      session.username = token.profile.preferred_username;
      session.accessToken = token.accessToken;
      session.userId = token.sub;

      // Surface token refresh errors to the client so guards/hooks can react
      if ((token as any).error) {
        (session as any).error = (token as any).error;
      }

      return session;
    },
  },
};