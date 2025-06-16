// Common UI state types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Sort and filter types
export interface SortParams {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, unknown>;
}

// Form field types
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "select"
    | "textarea"
    | "checkbox";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

// Theme and UI types
export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export interface ThemeConfig {
  theme: Theme;
  primaryColor: string;
  fontFamily: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Modal and dialog types
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

// Notification types
export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  autoClose?: boolean;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  url?: string;
}

// Search and filter types
export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  facets?: Record<string, { value: string; count: number }[]>;
  suggestions?: string[];
}

// Date and time utilities
export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeSlot {
  start: string; // HH:mm format
  end: string; // HH:mm format
  label?: string;
}

// Generic CRUD operations
export interface CrudOperations<
  T,
  CreateData = Partial<T>,
  UpdateData = Partial<T>,
> {
  create: (data: CreateData) => Promise<T>;
  read: (id: string) => Promise<T | null>;
  update: (id: string, data: UpdateData) => Promise<T>;
  delete: (id: string) => Promise<boolean>;
  list: (
    params?: FilterParams & SortParams & PaginationParams
  ) => Promise<PaginatedResponse<T>>;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Environment types
export enum Environment {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

export interface AppConfig {
  environment: Environment;
  apiUrl: string;
  appName: string;
  version: string;
  features: {
    enableAnalytics: boolean;
    enableNotifications: boolean;
    enableRealtime: boolean;
  };
}

// Environment constants
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_SECRET_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY || "";
