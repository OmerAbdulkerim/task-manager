'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useAuthStore } from '@/store/auth-store';
import {
  User,
  Role,
  fetchUsers,
  fetchRoles,
  deleteUser,
} from '@/lib/user-service';
import { UserCard } from '@/components/user-management/user-card';
import { CreateUserDialog } from '@/components/user-management/create-user-dialog';
import { EditUserDialog } from '@/components/user-management/edit-user-dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';

export default function UsersManagementPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Check if user is admin (roleId === '1')
    if (user.role?.id !== 1) {
      router.push('/dashboard');
      return;
    }

    // Fetch users and roles
    async function loadData() {
      try {
        setLoading(true);
        const [usersData, rolesData] = await Promise.all([
          fetchUsers(),
          fetchRoles(),
        ]);

        setUsers(usersData);
        setRoles(rolesData);
        setError('');
      } catch (err: any) {
        console.error('Error loading users data:', err);
        setError('Failed to load users. Please try again later.');

        // If authentication error, redirect to login
        if (err.message && err.message.includes('Authentication required')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated, user, router]);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = async () => {
    try {
      setLoading(true);
      const usersData = await fetchUsers();
      setUsers(usersData);
      setError('');
    } catch (err: any) {
      console.error('Error refreshing users:', err);
      setError('Failed to refresh users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdated = async () => {
    try {
      setLoading(true);
      const usersData = await fetchUsers();
      setUsers(usersData);
      setError('');
    } catch (err: any) {
      console.error('Error refreshing users:', err);
      setError('Failed to refresh users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !users.length) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Loading...</h2>
          <p className="text-gray-500">Please wait while we load user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4 flex items-center gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <h1 className="text-3xl font-bold">User Management</h1>
            </div>
            <div className="mt-4 md:mt-0">
              <CreateUserDialog
                roles={roles}
                onUserCreated={handleUserCreated}
              />
            </div>
          </div>
        </div>

        {/* Display error message if there is one */}
        {error && (
          <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* User list */}
        <h2 className="mb-4 text-xl font-semibold">All Users</h2>

        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading users...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((_user) => (
              <UserCard
                key={_user.id}
                user={_user}
                currentUserId={user?.id || ''}
                roles={roles}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </main>

      <EditUserDialog
        user={editingUser}
        roles={roles}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}
