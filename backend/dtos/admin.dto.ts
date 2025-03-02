import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

/**
 * DTO for creating a new user
 */
export class CreateUserDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsNumber({}, { message: 'Role ID must be a number' })
    @IsNotEmpty({ message: 'Role ID is required' })
    roleId: number;
}

/**
 * DTO for updating a user
 */
export class UpdateUserDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsOptional()
    email?: string;

    @IsString({ message: 'Password must be a string' })
    @IsOptional()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password?: string;

    @IsNumber({}, { message: 'Role ID must be a number' })
    @IsOptional()
    roleId?: number;
}
