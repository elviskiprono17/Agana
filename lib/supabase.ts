import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xsvczotxvqkbtlitpqtv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzdmN6b3R4dnFrYnRsaXRwcXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0ODgxMTMsImV4cCI6MjEwOTA2NDExM30.r_7m5DVr5Hvr-LxHYG0-uE4VEuu8vt9FkfpAcPRBPis';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AgreementRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
  preset_type: string;
  title: string;
  amount_kes: number;
  payment_method?: string;
  payment_reference?: string;
  county?: string;
  questionnaire_data: Record<string, any>;
  custom_clauses: Array<{ id: string; title: string; content: string }>;
  status: 'draft' | 'verifying_creator' | 'pending_signatures' | 'sealed' | 'completed';
  sha256_seal?: string;
  sealed_at?: string;
  contract_html?: string;
  parties: PartyRecord[];
}

export interface PartyRecord {
  id: string;
  role: 'creator' | 'counterparty' | 'witness';
  full_name: string;
  id_number: string;
  phone: string;
  email?: string;
  didit_verified?: boolean;
  didit_session_id?: string;
  didit_verification_data?: Record<string, any>;
  signature_data?: string;
  signed_at?: string;
  neutrality_confirmed?: boolean;
}
