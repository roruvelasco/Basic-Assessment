/**
 * Services Module Exports
 */
export { default as api } from './api';
export { authService } from './authService';
export { geolocationService, isValidIPAddress } from './geolocationService';
export { historyService } from './historyService';

// Re-export types
export type { LoginCredentials, LoginResponse, IUser } from './authService';
