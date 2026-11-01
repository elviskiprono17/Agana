# AGANA 🇰🇪
### Legally Binding Micro-Agreements with Instant Biometric KYC for Kenya & Global Scale

> **Agana** simplifies informal transactions in Kenya's economy by creating tamper-evident digital micro-agreements enforceable under the **Kenya Small Claims Court Act (2016)** (statutory jurisdiction up to **KES 1,000,000**) and the **Law of Contract Act (Cap 23)**.

---

## 🚀 Key Features

1. **Target Presets for Kenya's Economy**:
   - 🐄 **Cow / Livestock Purchase**: Breed, coat color, ear tag / brand ID, dentition (age), lactation/pregnancy status, movement permits & 48hr health warranty.
   - 📱 **Phone & Electronics Sale**: Primary 15-digit IMEI (*#06#) validation, secondary serials, battery health %, cosmetic grade, iCloud / Google FRP account release warranty, 7-day hardware guarantee.
   - 💻 **Freelance & Skilled Gig Work**: Milestone deliverables, deposit split, turnaround time, IP assignment on final M-Pesa clearance, revision caps.
   - 🏍️ **Boda Boda & Motorcycle Sale**: Registration plate, chassis VIN, engine number, NTSA TIMS logbook transfer obligations, pre-handover traffic fine indemnity.
   - 🤝 **Chama & Peer-to-Peer Loans**: Principal loan sum, facilitation fee, repayment due dates, collateral pledge custody, expedited default recovery.
   - 🥑 **Farm Produce Offtake**: Commodity, units (kg/bags), quality grade, certified weighing point, instant settlement.
   - 📝 **Custom Informal Transactions**: Freeform covenants with statutory protection.

2. **Kenya Small Claims Ceiling Enforcer**:
   - Hard capped at **KES 1,000,000** aligned with the Kenyan Small Claims Act 2016 to guarantee fast 60-day summary dispute resolution with zero advocate fee restrictions.

3. **Didit Biometric KYC**:
   - ID photo capture (Kenya National ID / Passport) + live selfie with passive 3D liveness detection.
   - Extracts and verifies identity credentials with anti-spoofing and face match confidence scoring (99.4%).

4. **Three-Party Digital Signing & Neutral Witness Guarantee**:
   - Digital signatures for **Creator (Party A)**, **Counterparty (Party B)**, and **Neutral Witness**.
   - Mandatory statutory declaration: *The witness has zero financial benefit or personal interest in the transaction*, safeguarding evidentiary weight in Kenyan courts.

5. **Cryptographic SHA-256 Seal & Locked HTML / PDF Engine**:
   - Deterministically hashes questionnaire metrics, party identities, and contract covenants into an immutable SHA-256 seal.
   - Downloads a formatted legal contract PDF with the official Republic of Kenya header, seal stamp, and Didit verification badge.

6. **Gemini AI Legal Copilot**:
   - Floating interactive assistant accessible before and after signing.
   - Explains clauses in plain English, **Swahili**, or **Sheng**.
   - Answers questions regarding Small Claims Court enforcement, M-Pesa records, and dispute recourse.

7. **Creator Custom Clauses Engine**:
   - Creators can define custom clauses and covenants alongside preset protections.

---

## 🛠️ Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (Minimalist Black and White Light Theme)
- **Database**: Supabase (Project: `Agana`)
- **Identity & KYC**: Didit Protocol SDK
- **AI Engine**: Google Gemini AI (`@google/generative-ai` & fallback legal copilot)
- **PDF Generation**: `jspdf` vector legal layout engine
- **Deployment**: Vercel ready

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xsvczotxvqkbtlitpqtv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_DIDIT_CLIENT_ID=agana-kenya-mvp
DIDIT_CLIENT_SECRET=your-didit-secret
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Deploy to Vercel
```bash
vercel --prod
```
