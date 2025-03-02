'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useAuthStore } from '@/store/auth-store';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface DashboardData {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  recentTasks: Task[];
}

export default function DashboardPage() {
  const router = useRouter();
  // Use individual selectors to avoid infinite loops
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication - the middleware will handle redirects, but we still check here as a backup
    if (!isAuthenticated || !user) {
      console.log('Dashboard page: Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    // Fetch dashboard data
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data.dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Loading...</h2>
          <p className="text-gray-500">
            Please wait while we load your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

        {error ? (
          <div className="relative mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-medium text-gray-900">
                  Tasks Overview
                </h3>
                <div className="mt-2 text-3xl font-semibold">
                  {dashboardData?.totalTasks || 0}
                </div>
                <div className="mt-1 text-sm text-gray-500">Total tasks</div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-medium text-gray-900">Pending</h3>
                <div className="mt-2 text-3xl font-semibold">
                  {dashboardData?.pendingTasks || 0}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Tasks to complete
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-medium text-gray-900">Completed</h3>
                <div className="mt-2 text-3xl font-semibold">
                  {dashboardData?.completedTasks || 0}
                </div>
                <div className="mt-1 text-sm text-gray-500">Finished tasks</div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">Recent Tasks</h2>
              {dashboardData?.recentTasks &&
              dashboardData.recentTasks.length > 0 ? (
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {dashboardData.recentTasks.map((task) => (
                      <li key={task.id}>
                        <div className="px-4 py-4">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-sm font-medium text-indigo-600">
                              {task.title}
                            </p>
                            <div className="ml-2 flex flex-shrink-0">
                              <p
                                className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                  task.status === 'Completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {task.status}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {task.priority} Priority
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                {task.status === 'Completed'
                                  ? 'Completed on '
                                  : 'Due on '}
                                {task.dueDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">No recent tasks found.</p>
              )}
            </div>

            <div className="mt-8 rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">
                Your Account Information
              </h2>
              <p className="mb-2 text-gray-600">
                Email: <span className="font-medium">{user?.email}</span>
              </p>
              <p className="text-gray-600">
                User ID: <span className="font-medium">{user?.id}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
