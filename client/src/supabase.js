import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gyttwfymmowfrvgvvgda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dHR3ZnltbW93ZnJ2Z3Z2Z2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzc2MTIsImV4cCI6MjA5MjYxMzYxMn0.lY5e1wt1j78OQrFha8dO-iP3O2ZupyW7XPPegC8zboQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
