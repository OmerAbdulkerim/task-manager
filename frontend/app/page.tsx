import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Manage Your Tasks Efficiently
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
              A simple and intuitive task management application to help you
              stay organized and productive.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/register">
                <Button className="rounded-md px-8 py-3 text-base font-medium shadow">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="ml-3 rounded-md px-8 py-3 text-base font-medium"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="text-lg font-medium text-gray-900">
                  Easy Task Creation
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Create tasks quickly and organize them with custom categories
                  and priorities.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="text-lg font-medium text-gray-900">
                  Track Progress
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Monitor your progress with visual indicators and completion
                  statistics.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="text-lg font-medium text-gray-900">
                  Collaborate
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Share tasks with team members and collaborate effectively on
                  projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2025 TaskManager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
