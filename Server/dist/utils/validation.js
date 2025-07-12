"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRefreshToken = exports.validateUserLogin = exports.validateUserRegistration = void 0;
const joi_1 = __importDefault(require("joi"));
const validateUserRegistration = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .lowercase()
            .required()
            .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),
        password: joi_1.default.string()
            .required()
            .messages({
            'any.required': 'Password is required',
        }),
        firstName: joi_1.default.string()
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
        lastName: joi_1.default.string()
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
exports.validateUserRegistration = validateUserRegistration;
const validateUserLogin = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .lowercase()
            .required()
            .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),
        password: joi_1.default.string()
            .required()
            .messages({
            'any.required': 'Password is required',
        }),
    });
    return schema.validate(data, { abortEarly: false });
};
exports.validateUserLogin = validateUserLogin;
const validateRefreshToken = (data) => {
    const schema = joi_1.default.object({
        refreshToken: joi_1.default.string()
            .required()
            .messages({
            'any.required': 'Refresh token is required',
        }),
    });
    return schema.validate(data, { abortEarly: false });
};
exports.validateRefreshToken = validateRefreshToken;
