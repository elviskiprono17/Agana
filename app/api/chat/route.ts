import { NextRequest, NextResponse } from 'next/server';
import { askGeminiAboutContract, ChatMessage, ContractContext } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, contractContext, apiKey } = body as {
      messages: ChatMessage[];
      contractContext: ContractContext;
      apiKey?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const reply = await askGeminiAboutContract(messages, contractContext, apiKey);
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Gemini chat route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing legal chat' },
      { status: 500 }
    );
  }
}
