// Database schema types for Supabase
export type Database = {
    public: {
        Tables: {
            todos: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    completed: boolean
                    priority: 'low' | 'medium' | 'high'
                    due_date: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    completed?: boolean
                    priority?: 'low' | 'medium' | 'high'
                    due_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    completed?: boolean
                    priority?: 'low' | 'medium' | 'high'
                    due_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

// Helper types for database operations
export type Todo = Database['public']['Tables']['todos']['Row']
export type TodoInsert = Database['public']['Tables']['todos']['Insert']
export type TodoUpdate = Database['public']['Tables']['todos']['Update'] 