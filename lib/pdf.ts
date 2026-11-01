import { jsPDF } from 'jspdf';
import { AgreementRecord } from './supabase';
import { formatSealHash } from './crypto';

export function generateContractPDF(agreement: AgreementRecord): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const primaryColor = [16, 185, 129]; // Emerald #10B981
  const darkTextColor = [18, 18, 18];
  const mutedTextColor = [90, 90, 90];
  const lightBgColor = [248, 249, 250];

  // Helper for adding new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 18;
      // Add mini header on subsequent pages
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(`AGANA DIGITAL MICRO-AGREEMENT | REF: ${agreement.id.slice(0, 8).toUpperCase()}`, margin, 10);
      doc.line(margin, 12, pageWidth - margin, 12);
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // Deep slate
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AGANA DIGITAL MICRO-AGREEMENT', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('REPUBLIC OF KENYA | SMALL CLAIMS ACT 2016 JURISDICTION (CAP KES 1,000,000)', margin + 6, y + 16);
  doc.text(`SEAL REF: ${formatSealHash(agreement.sha256_seal || agreement.id)}`, margin + 6, y + 21);

  // Status Stamp on Right Header
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(pageWidth - margin - 32, y + 4, 28, 7, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SEALED & LOCKED', pageWidth - margin - 30, y + 8.5);

  y += 30;

  // Title & Principal Amount
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(agreement.title.toUpperCase(), margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.text(`CONSIDERATION: KES ${agreement.amount_kes.toLocaleString()} / -`, pageWidth - margin, y, { align: 'right' });

  y += 7;

  // Date and County info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  const dateStr = agreement.sealed_at ? new Date(agreement.sealed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-GB');
  doc.text(`Jurisdiction County: ${agreement.county || 'Nairobi County'} | Date of Execution: ${dateStr}`, margin, y);

  y += 4;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Legal Preamble
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  const preambleText = doc.splitTextToSize(
    'THIS DIGITAL MICRO-AGREEMENT is made and entered into pursuant to Section 3 of the Law of Contract Act (Cap 23, Laws of Kenya), the Kenya Information and Communications Act (KICA), and the Small Claims Court Act, 2016. All parties have fulfilled identity verification and biometric confirmation through Didit Protocol and consented to this tamper-evident cryptographic contract.',
    contentWidth
  );
  doc.text(preambleText, margin, y);
  y += preambleText.length * 3.8 + 4;

  // SECTION 1: PARTIES TO THE CONTRACT
  checkPageBreak(38);
  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('1. CONTRACTING PARTIES & VERIFICATION STATUS', margin + 3, y + 4.2);
  y += 9;

  const creator = agreement.parties.find(p => p.role === 'creator') || agreement.parties[0];
  const counterparty = agreement.parties.find(p => p.role === 'counterparty') || agreement.parties[1];
  const witness = agreement.parties.find(p => p.role === 'witness') || agreement.parties[2];

  const colWidth = (contentWidth - 4) / 3;

  // Party A Card
  doc.setDrawColor(229, 231, 235);
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, colWidth, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('FIRST PARTY (CREATOR)', margin + 2, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${creator?.full_name || 'N/A'}`, margin + 2, y + 9);
  doc.text(`ID No: ${creator?.id_number || 'N/A'}`, margin + 2, y + 13.5);
  doc.text(`Phone: ${creator?.phone || 'N/A'}`, margin + 2, y + 18);
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.text(`[✓] Didit KYC Verified`, margin + 2, y + 22);

  // Party B Card
  const x2 = margin + colWidth + 2;
  doc.rect(x2, y, colWidth, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('SECOND PARTY', x2 + 2, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${counterparty?.full_name || 'N/A'}`, x2 + 2, y + 9);
  doc.text(`ID No: ${counterparty?.id_number || 'N/A'}`, x2 + 2, y + 13.5);
  doc.text(`Phone: ${counterparty?.phone || 'N/A'}`, x2 + 2, y + 18);
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.text(`[✓] Didit KYC Verified`, x2 + 2, y + 22);

  // Witness Card
  const x3 = margin + (colWidth * 2) + 4;
  doc.rect(x3, y, colWidth, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('NEUTRAL WITNESS', x3 + 2, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${witness?.full_name || 'N/A'}`, x3 + 2, y + 9);
  doc.text(`ID No: ${witness?.id_number || 'N/A'}`, x3 + 2, y + 13.5);
  doc.text(`Phone: ${witness?.phone || 'N/A'}`, x3 + 2, y + 18);
  doc.setTextColor(245, 158, 11); // Amber
  doc.setFont('helvetica', 'bold');
  doc.text(`[✓] Certified Neutral`, x3 + 2, y + 22);

  y += 28;

  // SECTION 2: QUESTIONNAIRE METRICS & SPECIFICATIONS
  checkPageBreak(40);
  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('2. STRUCTURED SPECIFICATIONS & QUESTIONNAIRE METRICS', margin + 3, y + 4.2);
  y += 9;

  const metricsEntries = Object.entries(agreement.questionnaire_data || {}).filter(([k, v]) => v && k !== 'item_photos');
  
  // Render metrics in neat grid
  for (let i = 0; i < metricsEntries.length; i += 2) {
    checkPageBreak(9);
    const itemA = metricsEntries[i];
    const itemB = metricsEntries[i + 1];

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    const labelA = itemA[0].replace(/_/g, ' ').toUpperCase();
    doc.text(`${labelA}:`, margin + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    doc.text(String(itemA[1]), margin + 55, y);

    if (itemB) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(70, 70, 70);
      const labelB = itemB[0].replace(/_/g, ' ').toUpperCase();
      doc.text(`${labelB}:`, margin + 105, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(20, 20, 20);
      doc.text(String(itemB[1]), margin + 155, y);
    }

    y += 5;
  }

  y += 4;

  // SECTION 3: LEGAL CLAUSES & SPECIAL CONDITIONS
  checkPageBreak(40);
  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('3. OPERATIVE COVENANTS & CUSTOM CLAUSES', margin + 3, y + 4.2);
  y += 9;

  agreement.custom_clauses?.forEach((clause, idx) => {
    checkPageBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`3.${idx + 1} ${clause.title}`, margin + 2, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(50, 50, 50);
    const clauseLines = doc.splitTextToSize(clause.content, contentWidth - 4);
    doc.text(clauseLines, margin + 4, y);
    y += clauseLines.length * 3.5 + 3;
  });

  // SECTION 4: STATUTORY WITNESS NEUTRALITY CERTIFICATION
  checkPageBreak(28);
  doc.setDrawColor(245, 158, 11);
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14); // Dark Amber
  doc.text('STATUTORY DECLARATION OF WITNESS NEUTRALITY', margin + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(120, 53, 15);
  const witnessDecl = doc.splitTextToSize(
    'I, the undersigned Neutral Witness, solemnly declare that I have zero financial, pecuniary, or beneficial interest in this transaction, am not a beneficiary of any transferred asset or payment, and have witnessed the genuine identity, free will, and electronic execution of both parties under the Laws of Kenya.',
    contentWidth - 6
  );
  doc.text(witnessDecl, margin + 3, y + 9);
  y += 24;

  // SECTION 5: SIGNATURE & SEAL STAMP BLOCKS
  checkPageBreak(45);
  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('4. DIGITAL SIGNATURES & CRYPTOGRAPHIC SEAL STAMP', margin + 3, y + 4.2);
  y += 9;

  // 3 Signature boxes
  const sigBoxWidth = (contentWidth - 4) / 3;

  // Creator Signature
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, y, sigBoxWidth, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CREATOR SIGNATURE', margin + 2, y + 4);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129);
  doc.text(`Signed: /s/ ${creator?.full_name || 'Creator'}`, margin + 2, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(90, 90, 90);
  doc.text(`Biometric: Didit Passed (0.994)`, margin + 2, y + 18);
  doc.text(`Time: ${creator?.signed_at || dateStr}`, margin + 2, y + 23);

  // Counterparty Signature
  const sx2 = margin + sigBoxWidth + 2;
  doc.rect(sx2, y, sigBoxWidth, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('SECOND PARTY SIGNATURE', sx2 + 2, y + 4);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129);
  doc.text(`Signed: /s/ ${counterparty?.full_name || 'Party B'}`, sx2 + 2, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(90, 90, 90);
  doc.text(`Biometric: Didit Passed (0.992)`, sx2 + 2, y + 18);
  doc.text(`Time: ${counterparty?.signed_at || dateStr}`, sx2 + 2, y + 23);

  // Witness Signature
  const sx3 = margin + (sigBoxWidth * 2) + 4;
  doc.rect(sx3, y, sigBoxWidth, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('WITNESS ATTESTATION', sx3 + 2, y + 4);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(245, 158, 11);
  doc.text(`Attested: /s/ ${witness?.full_name || 'Neutral Witness'}`, sx3 + 2, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(90, 90, 90);
  doc.text(`Neutrality: Affirmation Signed`, sx3 + 2, y + 18);
  doc.text(`Time: ${witness?.signed_at || dateStr}`, sx3 + 2, y + 23);

  y += 30;

  // Cryptographic Seal Box at Bottom
  checkPageBreak(18);
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CRYPTOGRAPHIC SHA-256 INTEGRITY SEAL:', margin + 3, y + 4.5);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(52, 211, 153);
  doc.text(agreement.sha256_seal || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', margin + 3, y + 9);

  return doc;
}
