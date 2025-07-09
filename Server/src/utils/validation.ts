import Joi from 'joi';
import { UserRegistration, UserLogin, RefreshTokenRequest } from '../types';

export const validateUserRegistration = (data: any): Joi.ValidationResult<UserRegistration> => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .lowercase()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required',
            }),
        password: Joi.string()
            .min(5)
            .required()
            .messages({
                'string.min': 'Password must be at least 5 characters long',
                'any.required': 'Password is required',
            }),
        firstName: Joi.string()
            .min(2)
            .max(50)
            .pattern(/^[a-zA-Z\s]+$/)
            .required()
            .messages({
                'string.min': 'First name must be at least 2 characters long',
                'string.max': 'First name cannot exceed 50 characters',
                'string.pattern.base': 'First name can only contain letters and spaces',
                'any.required': 'First name is required',
            }),
        lastName: Joi.string()
            .min(2)
            .max(50)
            .pattern(/^[a-zA-Z\s]+$/)
            .optional()
            .allow('')
            .messages({
                'string.min': 'Last name must be at least 2 characters long',
                'string.max': 'Last name cannot exceed 50 characters',
                'string.pattern.base': 'Last name can only contain letters and spaces',
            }),
    });

    return schema.validate(data, { abortEarly: false });
};

export const validateUserLogin = (data: any): Joi.ValidationResult<UserLogin> => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .lowercase()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required',
            }),
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required',
            }),
    });

    return schema.validate(data, { abortEarly: false });
};

export const validateRefreshToken = (data: any): Joi.ValidationResult<RefreshTokenRequest> => {
    const schema = Joi.object({
        refreshToken: Joi.string()
            .required()
            .messages({
                'any.required': 'Refresh token is required',
            }),
    });

    return schema.validate(data, { abortEarly: false });
};
