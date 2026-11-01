import { NextRequest, NextResponse } from 'next/server';
import { createDiditSession, DiditVerificationRequest } from '@/lib/didit';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DiditVerificationRequest & { agreementId?: string };
    
    if (!body.fullName || !body.idNumber || !body.phone) {
      return NextResponse.json(
        { error: 'Full name, National ID number, and Phone number are required for Didit KYC verification.' },
        { status: 400 }
      );
    }

    const verification = await createDiditSession(body);

    // If agreementId is provided, update party record in Supabase
    if (body.agreementId) {
      try {
        await supabase
          .from('parties')
          .update({
            didit_verified: verification.verified,
            didit_session_id: verification.sessionId,
            didit_verification_data: verification,
          })
          .eq('agreement_id', body.agreementId)
          .eq('role', body.partyRole);
      } catch (err) {
        console.warn('Could not update party in Supabase:', err);
      }
    }

    return NextResponse.json({
      success: true,
      verification,
    });
  } catch (error: any) {
    console.error('Didit KYC error:', error);
    return NextResponse.json(
      { error: error.message || 'KYC verification failed' },
      { status: 500 }
    );
  }
}
