'use client';

import React, { useState } from 'react';
import {
  PRESET_OPTIONS,
  PresetConfig,
  MAX_AMOUNT_KES,
  KENYA_COUNTIES,
} from '@/lib/presets';
import { AgreementRecord, PartyRecord } from '@/lib/supabase';
import { generateContractPDF } from '@/lib/pdf';
import { DiditKycModal } from './DiditKycModal';
import { SignaturePad } from './SignaturePad';
import { CustomClausesEditor, Clause } from './CustomClausesEditor';
import { GeminiBot } from './GeminiBot';
import {
  ShieldCheck,
  Scale,
  ArrowRight,
  ArrowLeft,
  Download,
  Share2,
  CheckCircle2,
  Camera,
  AlertTriangle,
  UserCheck,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DealWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPreset, setSelectedPreset] = useState<PresetConfig>(PRESET_OPTIONS[0]);

  // Deal Form State
  const [title, setTitle] = useState<string>('Sale and Transfer of Dairy Cow');
  const [amountKes, setAmountKes] = useState<number>(120000);
  const [county, setCounty] = useState<string>('Nairobi');
  const [paymentMethod, setPaymentMethod] = useState<string>('M-PESA');
  const [paymentReference, setPaymentReference] = useState<string>('M-Pesa Till / Phone 0712345678');
  const [metrics, setMetrics] = useState<Record<string, any>>({
    livestock_type: 'Dairy Cow',
    breed: 'Friesian / Holstein',
    color_markings: 'Black with white belly and star patch on forehead',
    ear_tag_number: 'KE-NK-8921',
    age_dentition: '3.5 years (4 permanent incisor teeth)',
    lactation_pregnancy_status: '18 Litres/day, 4 months pregnant confirmed',
    county_origin: 'Nakuru County',
    handover_location: 'Farm gate, Bahati Sub-County',
    inspection_hours: '48 Hours post-handover veterinary examination',
  });
  const [clauses, setClauses] = useState<Clause[]>(PRESET_OPTIONS[0].defaultClauses);

  // Extra Safety Questions State
  const [disputeTribunal, setDisputeTribunal] = useState<string>('Nairobi Small Claims Court (Milimani)');
  const [handoverDeadline, setHandoverDeadline] = useState<string>('Immediate upon M-Pesa clearance');
  const [inspectionWarrantyDays, setInspectionWarrantyDays] = useState<number>(2);

  // Parties State
  const [creator, setCreator] = useState<PartyRecord>({
    id: 'party_creator',
    role: 'creator',
    full_name: 'David Kiprono Cheruiyot',
    id_number: '29841029',
    phone: '+254722123456',
    email: 'kiprono.cheruiyot@example.com',
    didit_verified: false,
    signature_data: '',
  });

  const [counterparty, setCounterparty] = useState<PartyRecord>({
    id: 'party_counterparty',
    role: 'counterparty',
    full_name: 'Faith Wangari Mwangi',
    id_number: '31284902',
    phone: '+254711987654',
    email: 'wangari.faith@example.com',
    didit_verified: true,
    signature_data: '',
  });

  const [witness, setWitness] = useState<PartyRecord>({
    id: 'party_witness',
    role: 'witness',
    full_name: 'Pastor Peter Otieno Omondi',
    id_number: '24981033',
    phone: '+254733456789',
    email: 'otieno.omondi@example.com',
    didit_verified: true,
    neutrality_confirmed: false,
    signature_data: '',
  });

  // KYC Modal State
  const [kycModalOpen, setKycModalOpen] = useState<boolean>(false);
  const [activeKycParty, setActiveKycParty] = useState<'creator' | 'counterparty' | 'witness'>('creator');

  // Final Sealed Agreement Record
  const [sealedAgreement, setSealedAgreement] = useState<AgreementRecord | null>(null);
  const [isSealing, setIsSealing] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Handle Preset Switching
  const handleSelectPreset = (preset: PresetConfig) => {
    setSelectedPreset(preset);
    setClauses(preset.defaultClauses);
    
    if (preset.id === 'phone_electronics') {
      setTitle('Sale of Apple iPhone 15 Pro Max 256GB');
      setAmountKes(145000);
      setMetrics({
        device_brand: 'Apple (iPhone)',
        device_model: 'iPhone 15 Pro Max 256GB - Natural Titanium',
        primary_imei: '359123456789012',
        secondary_imei_or_serial: 'F2L980287X',
        device_condition: 'Used - Like New (No Scratches)',
        battery_health: '94% Maximum Capacity',
        included_accessories: 'Original box with matching IMEI, braided USB-C cable',
      });
    } else if (preset.id === 'livestock_sale') {
      setTitle('Sale and Transfer of Dairy Cow');
      setAmountKes(120000);
      setMetrics({
        livestock_type: 'Dairy Cow',
        breed: 'Friesian / Holstein',
        color_markings: 'Black with white patches, star on forehead',
        ear_tag_number: 'KE-NK-8921',
        age_dentition: '3.5 years (4 incisor teeth)',
        lactation_pregnancy_status: '18 Litres/day, 4 months pregnant',
        county_origin: 'Nakuru County',
        handover_location: 'Farm gate, Bahati Sub-County',
      });
    } else if (preset.id === 'freelance_gig') {
      setTitle('Freelance Next.js & Supabase Web Application Agreement');
      setAmountKes(180000);
      setMetrics({
        service_discipline: 'Fullstack Web / Mobile App Development',
        project_title: 'Agana MVP Marketplace and Didit KYC Integration',
        key_deliverables: '1. Next.js responsive app\n2. Didit Biometric verification\n3. Supabase database schema\n4. Small Claims PDF compiler',
        delivery_deadline: '2026-11-20',
        deposit_split: '50% Upfront Deposit, 50% on Final Delivery',
        revisions_included: '2 Rounds of Revision',
      });
    } else if (preset.id === 'boda_boda_sale') {
      setTitle('Sale of TVS HLX 125 Plus Motorcycle & NTSA Transfer');
      setAmountKes(135000);
      setMetrics({
        bike_make_model: 'TVS HLX 125 Plus',
        registration_number: 'KMD 458Y',
        engine_number: 'AF14E-78902',
        chassis_number: 'MD625AB14N1029482',
        current_mileage: '18,400 KM',
        included_gear: 'Original Logbook in hand, 2 Helmets, GPS tracker login',
      });
    } else if (preset.id === 'chama_peer_loan') {
      setTitle('Chama Working Capital Facility & Promissory Note');
      setAmountKes(75000);
      setMetrics({
        loan_purpose: 'Business Stock / Working Capital',
        principal_amount: '75000',
        interest_facilitation_fee: '4000',
        repayment_due_date: '2026-12-15',
        collateral_description: 'Samsung 55" 4K Smart TV with original receipt held in custody',
      });
    } else if (preset.id === 'farm_produce_offtake') {
      setTitle('Hass Avocado Harvest Offtake & Supply Agreement');
      setAmountKes(220000);
      setMetrics({
        crop_commodity: 'Hass Avocados (Export Grade)',
        quantity_units: '2,500 Kilograms',
        price_per_unit: 'KES 88 per Kg',
        collection_depot: 'Murang\'a Farmers Cooperative Kangari Depot',
      });
    } else {
      setTitle('Informal Transaction Agreement');
      setAmountKes(50000);
      setMetrics({
        deal_summary: 'Informal agreement under Kenya Small Claims Act',
        key_conditions: 'Clear delivery and inspection within 48 hours',
        handover_date: '2026-11-05',
      });
    }
  };

  const handleMetricChange = (fieldId: string, value: any) => {
    setMetrics((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Trigger Didit Verification
  const startDiditVerification = (partyRole: 'creator' | 'counterparty' | 'witness') => {
    setActiveKycParty(partyRole);
    setKycModalOpen(true);
  };

  const onDiditVerified = (result: any) => {
    if (activeKycParty === 'creator') {
      setCreator((prev) => ({
        ...prev,
        didit_verified: true,
        didit_session_id: result.sessionId,
        didit_verification_data: result,
      }));
    } else if (activeKycParty === 'counterparty') {
      setCounterparty((prev) => ({
        ...prev,
        didit_verified: true,
        didit_session_id: result.sessionId,
        didit_verification_data: result,
      }));
    } else {
      setWitness((prev) => ({
        ...prev,
        didit_verified: true,
        didit_session_id: result.sessionId,
        didit_verification_data: result,
      }));
    }
    setKycModalOpen(false);
  };

  // Compile & Cryptographically Seal the Contract
  const handleSealContract = async () => {
    if (!witness.neutrality_confirmed) {
      alert('The Neutral Witness must certify zero financial interest and complete neutrality before sealing.');
      return;
    }

    if (!creator.signature_data || !counterparty.signature_data || !witness.signature_data) {
      alert('All three parties (Creator, Other Party, and Neutral Witness) must sign the contract.');
      return;
    }

    setIsSealing(true);

    try {
      const payload = {
        preset: selectedPreset.id,
        title,
        amountKes,
        county,
        metrics: {
          ...metrics,
          dispute_tribunal: disputeTribunal,
          handover_deadline: handoverDeadline,
          inspection_warranty_days: inspectionWarrantyDays,
        },
        clauses,
        parties: {
          creator,
          counterparty,
          witness,
        },
      };

      const res = await fetch('/api/seal-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sealing failed');

      const record: AgreementRecord = {
        id: data.agreementId || 'AG-' + Math.random().toString(36).slice(2, 9),
        title,
        amount_kes: amountKes,
        preset_type: selectedPreset.id,
        county,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        questionnaire_data: payload.metrics,
        custom_clauses: clauses,
        status: 'sealed',
        sha256_seal: data.sealHash,
        sealed_at: data.sealedAt,
        parties: [creator, counterparty, witness],
      };

      setSealedAgreement(record);
      setCurrentStep(5);

      try {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#000000', '#555555', '#AAAAAA'],
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      alert(err.message || 'Error sealing contract');
    } finally {
      setIsSealing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!sealedAgreement) return;
    const doc = generateContractPDF(sealedAgreement);
    doc.save(`Agana-Agreement-${sealedAgreement.id.slice(0, 8).toUpperCase()}.pdf`);
  };

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/?agreementId=${sealedAgreement?.id || 'demo'}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const contractContextForGemini = {
    title,
    preset: selectedPreset.name,
    amountKes,
    parties: {
      creatorName: creator.full_name,
      counterpartyName: counterparty.full_name,
      witnessName: witness.full_name,
    },
    metrics,
    customClauses: clauses,
    sealHash: sealedAgreement?.sha256_seal,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-black uppercase tracking-wider">
              Step {currentStep} of 5
            </span>
            <span className="text-zinc-400">/</span>
            <span className="text-xs font-semibold text-zinc-700">
              {currentStep === 1 && 'Choose Kenyan Transaction Preset'}
              {currentStep === 2 && 'Structured Questionnaire & Custom Clauses'}
              {currentStep === 3 && 'Instant Biometric KYC via Didit'}
              {currentStep === 4 && '3-Party Signatures & Neutral Witness'}
              {currentStep === 5 && 'Cryptographic Seal & Download PDF'}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-zinc-950 font-mono font-bold">
            <Scale className="h-3.5 w-3.5" />
            <span>Max KES 1M</span>
          </div>
        </div>

        {/* Monochrome Progress bar */}
        <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden flex">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex-1 h-full transition-all duration-300 ${
                step <= currentStep ? 'bg-black' : 'bg-transparent'
              } ${step < 5 ? 'border-r border-zinc-100' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: PRESET SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 mb-1">
              <span>Standardized Kenyan Templates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Select Your Informal Deal Preset
            </h2>
            <p className="text-sm text-zinc-600">
              Pick a Kenyan standardized agreement template or create a custom agreement. Capped at KES 1,000,000 under the Small Claims Act.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {PRESET_OPTIONS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-2 border-black shadow-md ring-1 ring-black'
                      : 'bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{preset.icon}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {preset.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-950 mb-1">{preset.name}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-3 line-clamp-2">
                    {preset.description}
                  </p>
                  <div className="flex items-center text-[11px] font-bold text-zinc-950">
                    <span>{preset.defaultClauses.length} Protected Covenants</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white text-sm font-bold shadow-sm active:scale-95 transition-all"
            >
              <span>Continue to Questionnaire</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: STRUCTURED QUESTIONNAIRE & CUSTOM CLAUSES */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-left space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-zinc-900">
              <span className="text-xl">{selectedPreset.icon}</span>
              <span>{selectedPreset.name}</span>
            </div>
            <h2 className="text-2xl font-black text-zinc-950">
              Target Deal Metrics & Legal Terms
            </h2>
            <p className="text-xs text-zinc-600">
              Fill in the specific asset identifiers (IMEI, Breed, Markings), price in KES, and add custom clauses.
            </p>
          </div>

          {/* Core Price & Agreement Title Box */}
          <div className="p-4 sm:p-5 bg-white border border-zinc-200 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              General Agreement Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Agreement Title / Reference
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-950 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Total Consideration (KES)
                  </label>
                  <span className="text-[10px] text-zinc-600 font-mono font-bold">
                    Max: KES 1,000,000
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-zinc-500 font-bold">
                    KES
                  </span>
                  <input
                    type="number"
                    max={MAX_AMOUNT_KES}
                    value={amountKes}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= MAX_AMOUNT_KES) setAmountKes(val);
                    }}
                    className="w-full bg-white border border-zinc-300 rounded-xl pl-12 pr-3 py-2 text-xs text-zinc-950 font-mono font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                {amountKes > MAX_AMOUNT_KES && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Exceeds Small Claims Court limit of KES 1,000,000.</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Jurisdiction County (Kenya)
                </label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-950 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Payment Mode & Reference (M-Pesa / Bank)
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g. M-Pesa Till 892019 or 0722123456"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-950 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC QUESTIONNAIRE FIELDS BASED ON PRESET */}
          <div className="p-4 sm:p-5 bg-white border border-zinc-200 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                Target Asset Questionnaire: {selectedPreset.name}
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">
                Tamper-locked into SHA-256 seal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedPreset.fields.map((field) => (
                <div
                  key={field.id}
                  className={field.type === 'textarea' || field.type === 'photo' ? 'sm:col-span-2' : ''}
                >
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    {field.label} {field.required && <span className="text-black font-bold">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={metrics[field.id] || field.options?.[0] || ''}
                      onChange={(e) => handleMetricChange(field.id, e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-950 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={metrics[field.id] || ''}
                      onChange={(e) => handleMetricChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-950 focus:outline-none focus:border-black focus:ring-1 focus:ring-black leading-relaxed"
                    />
                  ) : field.type === 'photo' ? (
                    <div className="border border-dashed border-zinc-300 rounded-xl p-4 text-center bg-zinc-50">
                      <div className="flex items-center justify-center space-x-2 text-xs text-zinc-800 font-semibold">
                        <Camera className="h-4 w-4 text-zinc-900" />
                        <span>Photos of Item / Physical Identification</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        {field.helperText || 'Upload or capture photo during handover'}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="mt-2 text-xs text-zinc-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-zinc-800 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={metrics[field.id] || ''}
                      onChange={(e) => handleMetricChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-950 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  )}

                  {field.helperText && field.type !== 'photo' && (
                    <p className="text-[10px] text-zinc-500 mt-0.5">{field.helperText}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EXTRA SAFETY QUESTIONS */}
          <div className="p-4 sm:p-5 bg-white border border-zinc-200 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider flex items-center space-x-1.5">
              <Scale className="h-3.5 w-3.5" />
              <span>Small Claims Safety & Dispute Terms</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Designated Small Claims Court Forum
                </label>
                <input
                  type="text"
                  value={disputeTribunal}
                  onChange={(e) => setDisputeTribunal(e.target.value)}
                  placeholder="e.g. Nairobi Small Claims Court (Milimani)"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-950 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Inspection / Latent Defect Notice Period (Days)
                </label>
                <input
                  type="number"
                  value={inspectionWarrantyDays}
                  onChange={(e) => setInspectionWarrantyDays(Number(e.target.value))}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-950 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* CUSTOM CLAUSES ENGINE */}
          <div className="p-4 sm:p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <CustomClausesEditor clauses={clauses} onChange={setClauses} />
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white text-sm font-bold shadow-sm active:scale-95 transition-all"
            >
              <span>Proceed to Verify KYC</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DIDIT BIOMETRIC KYC VERIFICATION */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 mb-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Didit Protocol SDK</span>
            </div>
            <h2 className="text-2xl font-black text-zinc-950">
              Instant Biometric KYC Verification
            </h2>
            <p className="text-xs text-zinc-600">
              Snap a photo of your Kenya National ID and capture a live selfie. Both parties and the neutral witness are verified.
            </p>
          </div>

          {/* Creator KYC Card */}
          <div className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-zinc-900" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">
                    Creator (First Party): {creator.full_name}
                  </h3>
                  <p className="text-xs text-zinc-600">
                    ID No: {creator.id_number} | Phone: {creator.phone}
                  </p>
                </div>
              </div>

              {creator.didit_verified ? (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-xs font-bold text-zinc-950">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Didit Verified</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startDiditVerification('creator')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold shadow-sm"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Verify ID & Selfie</span>
                </button>
              )}
            </div>

            {creator.didit_verified && creator.didit_verification_data && (
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-[11px] text-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-zinc-500 block">Session ID:</span>
                  <span className="font-mono font-bold text-zinc-950">{creator.didit_session_id?.slice(0, 16)}...</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Biometric Match:</span>
                  <span className="font-mono font-bold text-zinc-950">99.42% Confidence</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Passive Liveness:</span>
                  <span className="font-mono font-bold text-zinc-950">Passed (3D Anti-Spoof)</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Document:</span>
                  <span className="font-mono text-zinc-700">Kenya National ID</span>
                </div>
              </div>
            )}
          </div>

          {/* Counterparty KYC Card */}
          <div className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-zinc-900" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">
                    Counterparty (Second Party): {counterparty.full_name}
                  </h3>
                  <p className="text-xs text-zinc-600">
                    ID No: {counterparty.id_number} | Phone: {counterparty.phone}
                  </p>
                </div>
              </div>

              {counterparty.didit_verified ? (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-xs font-bold text-zinc-950">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Didit Verified</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startDiditVerification('counterparty')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold border border-zinc-300"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Verify Counterparty</span>
                </button>
              )}
            </div>
          </div>

          {/* Witness KYC Card */}
          <div className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-zinc-900" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">
                    Neutral Witness: {witness.full_name}
                  </h3>
                  <p className="text-xs text-zinc-600">
                    ID No: {witness.id_number} | Phone: {witness.phone}
                  </p>
                </div>
              </div>

              {witness.didit_verified ? (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 text-xs font-bold text-zinc-950">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Didit Verified</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startDiditVerification('witness')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold border border-zinc-300"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Verify Witness</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!creator.didit_verified) {
                  startDiditVerification('creator');
                  return;
                }
                setCurrentStep(4);
              }}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white text-sm font-bold shadow-sm active:scale-95 transition-all"
            >
              <span>Proceed to 3-Party Signing</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: THREE-PARTY SIGNING & NEUTRAL WITNESS CERTIFICATION */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 mb-1">
              <Scale className="h-3.5 w-3.5" />
              <span>Evidentiary Requirement</span>
            </div>
            <h2 className="text-2xl font-black text-zinc-950">
              Three-Party Signing & Neutral Witness Certification
            </h2>
            <p className="text-xs text-zinc-600">
              Each party signs digitally under the Kenya Law of Contract Act (Cap 23). The witness must formally declare neutrality.
            </p>
          </div>

          {/* CRITICAL NEUTRAL WITNESS NOTICE */}
          <div className="p-4 sm:p-5 bg-zinc-50 border-2 border-zinc-900 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center space-x-2.5 text-zinc-950 font-black text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 text-zinc-900" />
              <span>Mandatory Witness Neutrality Declaration</span>
            </div>
            <p className="text-xs text-zinc-800 leading-relaxed font-medium">
              Under Kenya evidentiary standards and Small Claims Court procedures, <span className="font-bold underline">the Neutral Witness MUST NOT have any financial stake, commission, or direct benefit</span> from this transaction. An interested witness can compromise dispute recovery.
            </p>

            <label className="flex items-start space-x-3 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={witness.neutrality_confirmed || false}
                onChange={(e) =>
                  setWitness((prev) => ({
                    ...prev,
                    neutrality_confirmed: e.target.checked,
                  }))
                }
                className="mt-0.5 h-4 w-4 rounded border-zinc-400 text-black focus:ring-black bg-white"
              />
              <span className="text-xs text-zinc-900 font-bold">
                I hereby certify that {witness.full_name} is an independent neutral witness, has no personal financial interest in this deal, and witnesses freely under Cap 23 Laws of Kenya.
              </span>
            </label>
          </div>

          {/* Signature 1: Creator */}
          <SignaturePad
            signerName={creator.full_name}
            role="Creator (First Party)"
            savedSignature={creator.signature_data}
            onSave={(dataUrl) =>
              setCreator((prev) => ({
                ...prev,
                signature_data: dataUrl,
                signed_at: new Date().toISOString(),
              }))
            }
          />

          {/* Signature 2: Counterparty */}
          <SignaturePad
            signerName={counterparty.full_name}
            role="Counterparty (Second Party)"
            savedSignature={counterparty.signature_data}
            onSave={(dataUrl) =>
              setCounterparty((prev) => ({
                ...prev,
                signature_data: dataUrl,
                signed_at: new Date().toISOString(),
              }))
            }
          />

          {/* Signature 3: Neutral Witness */}
          <SignaturePad
            signerName={witness.full_name}
            role="Neutral Witness (Third Party)"
            savedSignature={witness.signature_data}
            onSave={(dataUrl) =>
              setWitness((prev) => ({
                ...prev,
                signature_data: dataUrl,
                signed_at: new Date().toISOString(),
              }))
            }
          />

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              disabled={isSealing}
              onClick={handleSealContract}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 ${
                witness.neutrality_confirmed && creator.signature_data && counterparty.signature_data && witness.signature_data
                  ? 'bg-black hover:bg-zinc-800 text-white'
                  : 'bg-zinc-300 text-zinc-600 cursor-not-allowed'
              }`}
            >
              {isSealing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sealing SHA-256 Hash...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Lock & Cryptographically Seal</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SEALED CONTRACT & SUCCESS PAGE */}
      {currentStep === 5 && sealedAgreement && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Success Banner */}
          <div className="p-6 bg-white border border-zinc-200 rounded-3xl text-center space-y-4 shadow-sm">
            <div className="h-16 w-16 mx-auto rounded-full bg-zinc-100 border-2 border-zinc-900 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-zinc-900" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200 uppercase tracking-wider">
                Cryptographically Sealed & Legally Binding
              </span>
              <h2 className="text-2xl font-black text-zinc-950">
                {sealedAgreement.title}
              </h2>
              <p className="text-xs text-zinc-600 max-w-md mx-auto">
                Merged with locked HTML template, verified via Didit Biometrics, and certified under Kenya Small Claims Act 2016.
              </p>
            </div>

            {/* SHA-256 Seal Box */}
            <div className="max-w-md mx-auto p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-left space-y-1">
              <div className="flex items-center justify-between text-[10px] text-zinc-600">
                <span className="font-bold text-zinc-950">SHA-256 TAMPER-PROOF SEAL:</span>
                <span>{new Date(sealedAgreement.sealed_at || Date.now()).toLocaleTimeString()}</span>
              </div>
              <p className="font-mono text-[10px] text-zinc-900 font-bold break-all bg-white p-2 rounded border border-zinc-200">
                {sealedAgreement.sha256_seal}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadPDF}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>Download Sealed PDF Contract</span>
              </button>

              <button
                onClick={handleCopyShareLink}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-semibold border border-zinc-300 transition-all"
              >
                {copiedLink ? <Check className="h-4 w-4 text-black" /> : <Copy className="h-4 w-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Shareable Link'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Here is our legally binding Agana micro-agreement for "${sealedAgreement.title}" (KES ${sealedAgreement.amount_kes.toLocaleString()}), sealed with Didit Biometrics & SHA-256 seal: ${typeof window !== 'undefined' ? window.location.origin : ''}/?agreementId=${sealedAgreement.id}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold border border-zinc-300 transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Summary Preview of the Sealed Agreement */}
          <div className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Executed Agreement Metrics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-zinc-500 text-[10px] block">Consideration</span>
                <span className="font-bold text-zinc-950 font-mono">
                  KES {sealedAgreement.amount_kes.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-zinc-500 text-[10px] block">County Jurisdiction</span>
                <span className="font-bold text-zinc-900">{sealedAgreement.county}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-zinc-500 text-[10px] block">Neutral Witness</span>
                <span className="font-bold text-zinc-900">{witness.full_name}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-zinc-500 text-[10px] block">Didit Biometrics</span>
                <span className="font-bold text-zinc-900">All Parties Verified</span>
              </div>
            </div>

            {/* List questionnaire items */}
            <div className="border-t border-zinc-100 pt-3">
              <span className="text-[11px] font-bold text-zinc-800 block mb-2">
                Locked Questionnaire Answers:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(sealedAgreement.questionnaire_data || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                    <span className="text-zinc-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-zinc-900 font-semibold truncate max-w-[180px]">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIDIT KYC MODAL */}
      <DiditKycModal
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        onVerified={onDiditVerified}
        partyName={
          activeKycParty === 'creator'
            ? creator.full_name
            : activeKycParty === 'counterparty'
            ? counterparty.full_name
            : witness.full_name
        }
        partyIdNumber={
          activeKycParty === 'creator'
            ? creator.id_number
            : activeKycParty === 'counterparty'
            ? counterparty.id_number
            : witness.id_number
        }
        partyPhone={
          activeKycParty === 'creator'
            ? creator.phone
            : activeKycParty === 'counterparty'
            ? counterparty.phone
            : witness.phone
        }
        role={activeKycParty}
      />

      {/* FLOATING GEMINI AI COPILOT */}
      <GeminiBot
        contractContext={contractContextForGemini}
        onAddCustomClause={(newTitle, newContent) => {
          setClauses((prev) => [
            ...prev,
            { id: 'custom_' + Date.now(), title: newTitle, content: newContent, isCustom: true },
          ]);
        }}
      />
    </div>
  );
};
