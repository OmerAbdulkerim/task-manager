import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'access_secret',
);

/**
 * Get user information and some sample dashboard data
 *
 * @remarks
 * This function is a protected route. It requires authentication.
 * The authentication is done by verifying the access token in the request cookies.
 *
 * @param request - The request object
 * @returns The dashboard data
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((cookie) => {
        const [name, ...value] = cookie.split('=');
        return [name, value.join('=')];
      }),
    );

    const accessToken = cookies['accessToken'];

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify the token
    const verified = await jwtVerify(accessToken, JWT_SECRET);
    const payload = verified.payload;

    return NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
      },
      dashboardData: {
        totalTasks: 12,
        pendingTasks: 5,
        completedTasks: 7,
        recentTasks: [
          {
            id: '1',
            title: 'Complete project proposal',
            status: 'Completed',
            priority: 'High',
            dueDate: 'March 1, 2025',
          },
          {
            id: '2',
            title: 'Prepare presentation slides',
            status: 'In Progress',
            priority: 'Medium',
            dueDate: 'March 10, 2025',
          },
        ],
      },
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 },
    );
  }
}
