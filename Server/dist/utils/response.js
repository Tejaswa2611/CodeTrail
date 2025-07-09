"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtils = void 0;
class ResponseUtils {
    static success(message, data) {
        return {
            success: true,
            message,
            data,
        };
    }
    static error(message, error) {
        return {
            success: false,
            message,
            error,
        };
    }
    static validationError(errors) {
        return {
            success: false,
            message: 'Validation failed',
            error: errors.join(', '),
        };
    }
}
exports.ResponseUtils = ResponseUtils;
