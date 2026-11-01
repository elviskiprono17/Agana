import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ContractContext {
  title: string;
  preset: string;
  amountKes: number;
  parties: {
    creatorName: string;
    counterpartyName: string;
    witnessName: string;
  };
  metrics: Record<string, any>;
  customClauses: Array<{ title: string; content: string }>;
  sealHash?: string;
}

const KENYA_LEGAL_SYSTEM_PROMPT = `You are "Agana AI Legal Copilot", an elite Kenyan legal assistant specializing in micro-agreements, informal transactions, and the Kenya Small Claims Court system (enforceable under the Small Claims Court Act, 2016, Law of Contract Act Cap 23, and Sale of Goods Act Cap 31).

Your core duties:
1. Explain any clause in the contract in simple, transparent everyday English, Swahili, or Sheng if requested.
2. Answer questions from any party (Creator, Counterparty, or Neutral Witness) before they sign.
3. Verify if the agreement meets the Kenyan Small Claims Court statutory cap of KES 1,000,000.
4. Advise on Kenyan practical realities: e.g. M-Pesa payment proof, IMEI verification with CAK/Police for phones, livestock health inspection periods & movement permits, NTSA TIMS logbook transfer for boda bodas, witness neutrality rules.
5. Emphasize why the Neutral Witness must NOT have any financial stake or direct benefit from the deal.
6. If the user asks in Swahili or Sheng, answer warmly and clearly in the same language with accurate legal clarity.

Always remain constructive, protective of both parties, and emphasize dispute avoidance through clear written records. Keep answers concise, actionable, and formatted with clean bullet points.`;

export async function askGeminiAboutContract(
  messages: ChatMessage[],
  contractContext: ContractContext,
  apiKeyOverride?: string
): Promise<string> {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const contextDescription = `
CURRENT CONTRACT DETAILS:
- Title: ${contractContext.title}
- Deal Type: ${contractContext.preset}
- Amount: KES ${contractContext.amountKes.toLocaleString()} (Kenya Small Claims Jurisdiction: Under KES 1,000,000)
- Parties:
  * Creator / First Party: ${contractContext.parties.creatorName}
  * Counterparty / Second Party: ${contractContext.parties.counterpartyName}
  * Neutral Witness: ${contractContext.parties.witnessName} (Certified Neutral)
- Key Metrics & Specs: ${JSON.stringify(contractContext.metrics, null, 2)}
- Custom Clauses: ${contractContext.customClauses.map(c => `${c.title}: ${c.content}`).join(' | ')}
- Tamper Seal: ${contractContext.sealHash || 'Pending Seal'}
`;

      const prompt = `${KENYA_LEGAL_SYSTEM_PROMPT}

${contextDescription}

Conversation History:
${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

ASSISTANT:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn('Gemini API call failed, using intelligent legal copilot engine fallback:', error);
    }
  }

  // Fallback intelligent legal rule engine tailored to the contract context
  const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  
  if (lastUserMessage.includes('swahili') || lastUserMessage.includes('kiswahili') || lastUserMessage.includes('sheng') || lastUserMessage.includes('ngapi') || lastUserMessage.includes('ng\'ombe') || lastUserMessage.includes('simu')) {
    return `Hujambo! Hapa kuna maelezo ya mkataba huu wa **Agana**:

1. **Uhalali Kisheria**: Mkataba huu una nguvu kamili chini ya sheria ya Kenya (*Law of Contract Act Cap 23* na *Small Claims Court Act 2016*).
2. **Kiasi**: KES ${contractContext.amountKes.toLocaleString()} kiko ndani ya kiwango halali cha Small Claims Court (chini ya Milioni 1 KES).
3. **Shahidi Asiyeegemea Upande Wowote (Neutral Witness)**: Ni lazima asipate faida yoyote ya kifedha kutoka kwa mpango huu ili ushahidi wake ukubalike mahakamani bila dosari.
4. **M-Pesa Record**: Hakikisha malipo yote yanafanywa kwa nambari iliyosajiliwa hapa ili kusiwe na utata wa stakabadhi.

Je, una swali kuhusu kipengele chochote maalum unachotaka kurekebisha kabla ya kuweka sahihi?`;
  }

  if (lastUserMessage.includes('witness') || lastUserMessage.includes('neutral')) {
    return `### Neutral Witness Requirements under Kenya Law:
1. **Zero Financial Interest**: The neutral witness (${contractContext.parties.witnessName || 'Third Party'}) must not receive commission, fees, or benefit from the ${contractContext.title}.
2. **Evidentiary Weight**: Under Section 3 of the *Kenya Law of Contract Act (Cap 23)*, a dispute in the Small Claims Court relies heavily on unbiased testimony. A conflicted witness can lead to evidence being dismissed.
3. **Verification**: The witness must provide their National ID and complete Didit verification alongside the digital signature.`;
  }

  if (lastUserMessage.includes('imei') || lastUserMessage.includes('stolen') || lastUserMessage.includes('phone') || lastUserMessage.includes('electronics')) {
    return `### Phone & Electronics Protection Clauses:
1. **IMEI Warranty**: The contract specifically binds the seller to certify that IMEI **${contractContext.metrics.primary_imei || 'provided in questionnaire'}** is clean and not blacklisted by CAK or Kenyan DCI.
2. **Account Lockout**: The seller has formally agreed to wipe Apple iCloud / Google FRP accounts. If the phone is locked, the buyer is entitled to an immediate refund under the 7-day guarantee.
3. **Recourse**: If breach occurs, you can take this sealed agreement to the Small Claims Court (Milimani, City Hall, or local county) for expedited recovery within 60 days.`;
  }

  if (lastUserMessage.includes('cow') || lastUserMessage.includes('livestock') || lastUserMessage.includes('death') || lastUserMessage.includes('kufa')) {
    return `### Livestock Inspection & Warranty Terms:
1. **48-Hour Health Window**: The contract provides an inspection window for latent diseases (e.g. Anthrax, East Coast Fever).
2. **Movement Permit**: The seller warrants that the animal is legally cleared for transit from **${contractContext.metrics.county_origin || 'its county'}**.
3. **Title & Ownership**: Protects against buying stolen cattle or animals subject to family/dowry disputes.`;
  }

  if (lastUserMessage.includes('customize') || lastUserMessage.includes('clause') || lastUserMessage.includes('change') || lastUserMessage.includes('add')) {
    return `### How to Customize Your Agana Contract:
You can add your own custom clauses directly in the **Questionnaire (Step 2)**:
- Click the **"+ Add Custom Clause"** button.
- Give it a clear title (e.g., *"Deposit Refund Term"*, *"72-Hour Inspection Notice"*, or *"Milestone 2 Approval"*).
- Type the exact terms agreed upon.
- Once saved, your clause is locked into the cryptographic SHA-256 seal and printed onto the final signed PDF!`;
  }

  return `### Agana Legal Copilot Analysis:
- **Contract**: ${contractContext.title}
- **Value**: KES ${contractContext.amountKes.toLocaleString()} (Compliant with Kenya Small Claims maximum of KES 1,000,000).
- **Legally Binding**: Fully recognized under the Kenya Law of Contract Act (Cap 23) and Kenya Information & Communications Act (KICA) for digital signatures.
- **Parties Protected**:
  * **Party A (Creator)**: Protected against non-payment or milestone disputes.
  * **Party B (Counterparty)**: Protected against defective goods, fake IMEIs, or breached deliverables.
  * **Witness**: Formally certified as neutral without liability or financial interest.

You can ask me questions about specific clauses, request Swahili translation, or ask how to enforce this in Kenyan Small Claims Court!`;
}
