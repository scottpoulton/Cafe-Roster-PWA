export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: 'manager' | 'staff'
          hourly_rate: number | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          role: 'manager' | 'staff'
          hourly_rate?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'manager' | 'staff'
          hourly_rate?: number | null
          created_at?: string
        }
      }
      shifts: {
        Row: {
          id: string
          employee_id: string
          date: string
          start_time: string
          end_time: string
          status: 'draft' | 'published'
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          date: string
          start_time: string
          end_time: string
          status?: 'draft' | 'published'
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          date?: string
          start_time?: string
          end_time?: string
          status?: 'draft' | 'published'
          created_at?: string
        }
      }
      timesheets: {
        Row: {
          id: string
          employee_id: string
          shift_id: string | null
          clock_in: string
          clock_out: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          shift_id?: string | null
          clock_in: string
          clock_out?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          shift_id?: string | null
          clock_in?: string
          clock_out?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
    }
  }
}