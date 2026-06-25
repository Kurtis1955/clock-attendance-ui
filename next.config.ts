/** @type {import('next').NextConfig} */

const isProd = process.env.ENVIRONMENT === 'production';
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  env: {
    API_ENDPOINT_BASEURL_ACTIVITY: process.env.API_ENDPOINT_BASEURL_ACTIVITY,
    ENVIRONMENT:process.env.ENVIRONMENT,
    KEYCLOAK_URL:process.env.KEYCLOAK_URL,
    KEYCLOAK_REALM:process.env.KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID:process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET:process.env.KEYCLOAK_CLIENT_SECRET,
    KEYCLOAK_ISSUER:process.env.KEYCLOAK_ISSUER,
    NEXTAUTH_URL:process.env.NEXTAUTH_URL
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  compiler: {
    removeConsole: isProd
      ? { exclude: ['error', 'warn'] }
      : false,
  },
};

export default nextConfig;
