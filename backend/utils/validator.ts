import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObject = plainToClass(dtoClass, req.body);
        const errors: ValidationError[] = await validate(dtoObject);

        if (errors.length > 0) {
            const errorMessages = errors.map((error: ValidationError) => {
                return {
                    property: error.property,
                    constraints: error.constraints
                        ? Object.values(error.constraints)
                        : ['Invalid value'],
                };
            });

            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errorMessages,
            });
            return;
        }

        // Add validated object to request
        req.body = dtoObject;
        next();
    };
}
