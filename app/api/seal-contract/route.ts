import { NextRequest, NextResponse } from 'next/server';
import { sealContractPayload } from '@/lib/crypto';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agreementId,
      preset,
      title,
      amountKes,
      county,
      parties,
      metrics,
      clauses,
      contractHtml,
    } = body;

    if (!title || !parties) {
      return NextResponse.json({ error: 'Missing required contract fields' }, { status: 400 });
    }

    if (amountKes > 1000000) {
      return NextResponse.json(
        { error: 'Amount exceeds Kenya Small Claims Court ceiling of KES 1,000,000' },
        { status: 400 }
      );
    }

    // Generate cryptographic SHA-256 seal
    const sealData = await sealContractPayload({
      agreementId: agreementId || 'temp-' + Date.now(),
      preset: preset || 'custom_agreement',
      title,
      amountKes: Number(amountKes) || 0,
      parties: {
        creator: parties.creator,
        counterparty: parties.counterparty,
        witness: parties.witness,
      },
      metrics: metrics || {},
      clauses: clauses || [],
      lockedAt: new Date().toISOString(),
    });

    // Update in Supabase
    let savedId = agreementId;
    try {
      if (agreementId) {
        await supabase
          .from('agreements')
          .update({
            status: 'sealed',
            sha256_seal: sealData.sealHash,
            sealed_at: sealData.sealedAt,
            contract_html: contractHtml,
            parties: [parties.creator, parties.counterparty, parties.witness],
          })
          .eq('id', agreementId);
      } else {
        const { data } = await supabase
          .from('agreements')
          .insert({
            preset_type: preset,
            title,
            amount_kes: amountKes,
            county: county || 'Nairobi',
            questionnaire_data: metrics,
            custom_clauses: clauses,
            status: 'sealed',
            sha256_seal: sealData.sealHash,
            sealed_at: sealData.sealedAt,
            contract_html: contractHtml,
            parties: [parties.creator, parties.counterparty, parties.witness],
          })
          .select('id')
          .single();
        if (data?.id) savedId = data.id;
      }
    } catch (dbErr) {
      console.warn('Supabase agreement update warning:', dbErr);
    }

    return NextResponse.json({
      success: true,
      agreementId: savedId,
      sealHash: sealData.sealHash,
      formattedSeal: sealData.formattedSeal,
      sealedAt: sealData.sealedAt,
    });
  } catch (error: any) {
    console.error('Contract sealing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seal contract' },
      { status: 500 }
    );
  }
}
