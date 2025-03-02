'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { userSchema, UserFormValues } from '@/lib/validation';
import { CreateUserDto, UpdateUserDto, User, Role } from '@/lib/user-service';

interface UserFormProps {
  user?: User;
  roles: Role[];
  onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<void>;
  onCancel: () => void;
}

export function UserForm({ user, roles, onSubmit, onCancel }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!user;

  // Create the appropriate schema based on whether we're editing or creating
  const formSchema = isEditing
    ? userSchema.extend({
        password: z.string().min(8).max(100).optional().or(z.literal('')),
      })
    : userSchema;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: user
      ? {
          email: user.email,
          name: user.name || '',
          roleId: user.roleId,
        }
      : {
          email: '',
          password: '',
          name: '',
          roleId: roles.length > 0 ? roles[0].id : 2,
        },
  });

  // Set form values when user changes
  useEffect(() => {
    if (user) {
      setValue('email', user.email);
      setValue('name', user.name || '');
      setValue('roleId', user.roleId);
    }
  }, [user, setValue]);

  const onFormSubmit = async (data: UserFormValues) => {
    try {
      setIsSubmitting(true);

      // When editing, only include password if it was provided
      if (isEditing && (!data.password || data.password === '')) {
        const { password, ...restData } = data;
        await onSubmit(restData);
      } else {
        await onSubmit(data);
      }
    } catch (error) {
      console.error('Error submitting user form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register('email')}
          placeholder="user@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          {isEditing ? 'Password (leave blank to keep current)' : 'Password'}
        </Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder={isEditing ? '••••••••' : 'Enter password'}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} placeholder="John Doe" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="roleId">Role</Label>
        <Select
          defaultValue={
            String(user?.roleId) || String(roles.length > 0 ? roles[0].id : '')
          }
          onValueChange={(value) => setValue('roleId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={String(role.id)}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.roleId && (
          <p className="text-sm text-red-500">{errors.roleId.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
