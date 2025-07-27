export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      crops: {
        Row: {
          category: Database["public"]["Enums"]["crop_category"]
          created_at: string
          description: string | null
          expiry_date: string | null
          farmer_id: string
          harvest_date: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_organic: boolean | null
          location: string | null
          name: string
          price_per_unit: number
          quantity_available: number
          unit: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["crop_category"]
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id: string
          harvest_date?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_organic?: boolean | null
          location?: string | null
          name: string
          price_per_unit: number
          quantity_available?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["crop_category"]
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id?: string
          harvest_date?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_organic?: boolean | null
          location?: string | null
          name?: string
          price_per_unit?: number
          quantity_available?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      evaluations: {
        Row: {
          created_at: string
          education_score: number
          experience_score: number
          feedback: string | null
          id: string
          job_description_id: string | null
          overall_score: number
          recommendations: string[] | null
          resume_id: string
          skill_gaps: string[] | null
          skills_score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          education_score?: number
          experience_score?: number
          feedback?: string | null
          id?: string
          job_description_id?: string | null
          overall_score?: number
          recommendations?: string[] | null
          resume_id: string
          skill_gaps?: string[] | null
          skills_score?: number
          user_id: string
        }
        Update: {
          created_at?: string
          education_score?: number
          experience_score?: number
          feedback?: string | null
          id?: string
          job_description_id?: string | null
          overall_score?: number
          recommendations?: string[] | null
          resume_id?: string
          skill_gaps?: string[] | null
          skills_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_job_description_id_fkey"
            columns: ["job_description_id"]
            isOneToOne: false
            referencedRelation: "job_descriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      job_descriptions: {
        Row: {
          company: string | null
          created_at: string
          description: string
          experience_required: number | null
          id: string
          required_skills: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          description: string
          experience_required?: number | null
          id?: string
          required_skills?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string
          experience_required?: number | null
          id?: string
          required_skills?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          crop_id: string
          delivery_address: string
          delivery_date: string | null
          farmer_id: string
          id: string
          notes: string | null
          quantity: number
          status: Database["public"]["Enums"]["order_status"] | null
          total_price: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          crop_id: string
          delivery_address: string
          delivery_date?: string | null
          farmer_id: string
          id?: string
          notes?: string | null
          quantity: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_price: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          crop_id?: string
          delivery_address?: string
          delivery_date?: string | null
          farmer_id?: string
          id?: string
          notes?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          content: string | null
          created_at: string
          education: string | null
          experience_years: number | null
          file_name: string | null
          file_url: string | null
          id: string
          skills: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          education?: string | null
          experience_years?: number | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          skills?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          education?: string | null
          experience_years?: number | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          skills?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      crop_category:
        | "vegetables"
        | "fruits"
        | "grains"
        | "pulses"
        | "spices"
        | "dairy"
        | "other"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      user_type: "farmer" | "buyer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      crop_category: [
        "vegetables",
        "fruits",
        "grains",
        "pulses",
        "spices",
        "dairy",
        "other",
      ],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      user_type: ["farmer", "buyer", "admin"],
    },
  },
} as const
