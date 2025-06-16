import * as z from "zod";

// Todo priority levels
export enum TodoPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export const TODO_PRIORITY_LABELS: Record<TodoPriority, string> = {
  [TodoPriority.LOW]: "Low",
  [TodoPriority.MEDIUM]: "Medium",
  [TodoPriority.HIGH]: "High",
};

export const TODO_PRIORITY_COLORS: Record<TodoPriority, string> = {
  [TodoPriority.LOW]: "bg-green-100 text-green-800",
  [TodoPriority.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [TodoPriority.HIGH]: "bg-red-100 text-red-800",
};

export const TODO_PRIORITY_ICONS: Record<TodoPriority, string> = {
  [TodoPriority.LOW]: "🔵",
  [TodoPriority.MEDIUM]: "🟡",
  [TodoPriority.HIGH]: "🔴",
};

// Todo status options
export enum TodoStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export const TODO_STATUS_LABELS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: "Pending",
  [TodoStatus.IN_PROGRESS]: "In Progress",
  [TodoStatus.COMPLETED]: "Completed",
  [TodoStatus.CANCELLED]: "Cancelled",
};

export const TODO_STATUS_COLORS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: "bg-gray-100 text-gray-800",
  [TodoStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [TodoStatus.COMPLETED]: "bg-green-100 text-green-800",
  [TodoStatus.CANCELLED]: "bg-red-100 text-red-800",
};

// Todo category options
export enum TodoCategory {
  WORK = "work",
  PERSONAL = "personal",
  SHOPPING = "shopping",
  HEALTH = "health",
  EDUCATION = "education",
  FINANCE = "finance",
  OTHER = "other",
}

export const TODO_CATEGORY_LABELS: Record<TodoCategory, string> = {
  [TodoCategory.WORK]: "Work",
  [TodoCategory.PERSONAL]: "Personal",
  [TodoCategory.SHOPPING]: "Shopping",
  [TodoCategory.HEALTH]: "Health",
  [TodoCategory.EDUCATION]: "Education",
  [TodoCategory.FINANCE]: "Finance",
  [TodoCategory.OTHER]: "Other",
};

export const TODO_CATEGORY_ICONS: Record<TodoCategory, string> = {
  [TodoCategory.WORK]: "💼",
  [TodoCategory.PERSONAL]: "👤",
  [TodoCategory.SHOPPING]: "🛒",
  [TodoCategory.HEALTH]: "🏥",
  [TodoCategory.EDUCATION]: "📚",
  [TodoCategory.FINANCE]: "💰",
  [TodoCategory.OTHER]: "📝",
};

// Form validation schemas
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  priority: z.nativeEnum(TodoPriority).default(TodoPriority.MEDIUM),
  category: z.nativeEnum(TodoCategory).default(TodoCategory.PERSONAL),
  dueDate: z.string().optional(),
  reminder: z.boolean().default(false),
  reminderDate: z.string().optional(),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  priority: z.nativeEnum(TodoPriority).optional(),
  category: z.nativeEnum(TodoCategory).optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().optional(),
  reminder: z.boolean().optional(),
  reminderDate: z.string().optional(),
});

export const todoFilterSchema = z.object({
  status: z.array(z.nativeEnum(TodoStatus)).optional(),
  priority: z.array(z.nativeEnum(TodoPriority)).optional(),
  category: z.array(z.nativeEnum(TodoCategory)).optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["created_at", "updated_at", "due_date", "priority", "title"])
    .default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// Inferred types from schemas
export type CreateTodoFormData = z.infer<typeof createTodoSchema>;
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;
export type TodoFilterParams = z.infer<typeof todoFilterSchema>;

// Extended Todo types with computed properties
export interface TodoWithStatus {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: TodoPriority;
  category: TodoCategory;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  // Computed properties
  status: TodoStatus;
  isOverdue: boolean;
  isDueSoon: boolean;
  daysUntilDue: number | null;
}

// Todo statistics
export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueSoon: number;
  byPriority: Record<TodoPriority, number>;
  byCategory: Record<TodoCategory, number>;
  completionRate: number;
}

// Helper functions
export const getTodoStatus = (todo: {
  completed: boolean;
  due_date: string | null;
}): TodoStatus => {
  if (todo.completed) return TodoStatus.COMPLETED;
  if (todo.due_date && new Date(todo.due_date) < new Date())
    return TodoStatus.PENDING;
  return TodoStatus.IN_PROGRESS;
};

export const isOverdue = (dueDate: string | null): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

export const isDueSoon = (
  dueDate: string | null,
  days: number = 3
): boolean => {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const daysDiff = Math.ceil(diff / (1000 * 3600 * 24));
  return daysDiff >= 0 && daysDiff <= days;
};

export const getDaysUntilDue = (dueDate: string | null): number | null => {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
};
