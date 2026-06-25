import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

function logoutParams(token: any) {
  return {
    id_token_hint: token.idToken,
    post_logout_redirect_uri: process.env.NEXTAUTH_URL!,
  };
}

function handleEmptyToken() {
  return NextResponse.json(
    { error: "No session present" },
    { status: 400 }
  );
}

function sendEndSessionEndpointToURL(token: any) {
  console.log("user token>>", token)
  const endSessionEndPoint = new URL(
    `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`
  );

  const endSessionParams = new URLSearchParams(logoutParams(token));

  return NextResponse.json({
    url: `${endSessionEndPoint.href}?${endSessionParams.toString()}`,
  });
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return handleEmptyToken();
    }

    return sendEndSessionEndpointToURL(token);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to logout from the session" },
      { status: 500 }
    );
  }
}
