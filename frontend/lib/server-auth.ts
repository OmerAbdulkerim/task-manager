import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'access_secret',
);

export async function getJwtSecretKey() {
  return JWT_SECRET;
}

/**
 * Server-side function to verify the access token
 *
 * @remarks
 * This function verifies the access token by decoding it
 * and checking its validity against the JWT secret.
 *
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export async function verifyAuth() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('accessToken')?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (err) {
    return null;
  }
}

/**
 * Server-side function that redirects to login if not authenticated
 *
 * @remarks
 * This function checks if the user is authenticated and
 * redirects to the login page if not.
 *
 * @returns The user payload if authenticated, otherwise null.
 */
export async function requireAuth() {
  const payload = await verifyAuth();

  if (!payload) {
    redirect('/login');
  }

  return payload;
}
