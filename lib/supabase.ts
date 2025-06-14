import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Environment constants
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_SECRET_KEY = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY || ""

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SECRET_KEY) 