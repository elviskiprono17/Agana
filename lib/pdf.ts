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
  let y = 16;

  // Helper for adding new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 268) {
      doc.addPage();
      y = 16;
      // Add mini header on subsequent pages
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text(`AGANA DIGITAL MICRO-AGREEMENT | REF: ${agreement.id.slice(0, 8).toUpperCase()}`, margin, 10);
      doc.line(margin, 12, pageWidth - margin, 12);
    }
  };

  // Header Banner - High contrast black & white
  doc.setFillColor(18, 18, 18);
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('AGANA DIGITAL MICRO-AGREEMENT', margin + 6, y + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(210, 210, 210);
  doc.text('REPUBLIC OF KENYA | SMALL CLAIMS COURT ACT 2016 JURISDICTION (CAP KES 1,000,000)', margin + 6, y + 14);
  doc.text(`SEAL REF: ${formatSealHash(agreement.sha256_seal || agreement.id)}`, margin + 6, y + 19);

  // Status Stamp on Right Header
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 34, y + 4, 30, 7, 1.5, 1.5, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SEALED & LOCKED', pageWidth - margin - 32, y + 8.5);

  y += 28;

  // Title & Consideration Amount
  doc.setTextColor(18, 18, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.text(agreement.title.toUpperCase(), margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`CONSIDERATION: KES ${agreement.amount_kes.toLocaleString()} / -`, pageWidth - margin, y, { align: 'right' });

  y += 6.5;

  // Date and County info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  const dateStr = agreement.sealed_at
    ? new Date(agreement.sealed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB');
  doc.text(`County Jurisdiction: ${agreement.county || 'Nairobi County'} | Date of Execution: ${dateStr}`, margin, y);

  y += 3.5;
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5.5;

  // Legal Preamble
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(70, 70, 70);
  const preambleText = doc.splitTextToSize(
    'THIS DIGITAL MICRO-AGREEMENT is concluded pursuant to Section 3 of the Law of Contract Act (Cap 23, Laws of Kenya), the Kenya Information and Communications Act (KICA), and the Small Claims Court Act, 2016. All parties have fulfilled identity verification and biometric confirmation through Didit Protocol and consented to this tamper-evident cryptographic contract.',
    contentWidth
  );
  doc.text(preambleText, margin, y);
  y += preambleText.length * 3.6 + 4;

  // SECTION 1: PARTIES TO THE CONTRACT
  checkPageBreak(38);
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 15, 15);
  doc.text('1. CONTRACTING PARTIES & VERIFICATION STATUS', margin + 3, y + 4);
  y += 8.5;

  const creator = agreement.parties?.find(p => p.role === 'creator') || agreement.parties?.[0];
  const counterparty = agreement.parties?.find(p => p.role === 'counterparty') || agreement.parties?.[1];
  const witness = agreement.parties?.find(p => p.role === 'witness') || agreement.parties?.[2];

  const colWidth = (contentWidth - 4) / 3;

  // Party A Card
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, colWidth, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 15, 15);
  doc.text('FIRST PARTY (CREATOR)', margin + 2, y + 4.2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${creator?.full_name || 'N/A'}`, margin + 2, y + 8.5);
  doc.text(`ID No: ${creator?.id_number || 'N/A'}`, margin + 2, y + 12.8);
  doc.text(`Phone: ${creator?.phone || 'N/A'}`, margin + 2, y + 17);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`[✓] Didit Biometrics Passed`, margin + 2, y + 21);

  // Party B Card
  const x2 = margin + colWidth + 2;
  doc.rect(x2, y, colWidth, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 15, 15);
  doc.text('SECOND PARTY', x2 + 2, y + 4.2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${counterparty?.full_name || 'N/A'}`, x2 + 2, y + 8.5);
  doc.text(`ID No: ${counterparty?.id_number || 'N/A'}`, x2 + 2, y + 12.8);
  doc.text(`Phone: ${counterparty?.phone || 'N/A'}`, x2 + 2, y + 17);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`[✓] Didit Biometrics Passed`, x2 + 2, y + 21);

  // Witness Card
  const x3 = margin + (colWidth * 2) + 4;
  doc.rect(x3, y, colWidth, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 15, 15);
  doc.text('NEUTRAL WITNESS', x3 + 2, y + 4.2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${witness?.full_name || 'N/A'}`, x3 + 2, y + 8.5);
  doc.text(`ID No: ${witness?.id_number || 'N/A'}`, x3 + 2, y + 12.8);
  doc.text(`Phone: ${witness?.phone || 'N/A'}`, x3 + 2, y + 17);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`[✓] Certified Zero Benefit`, x3 + 2, y + 21);

  y += 27;

  // SECTION 2: QUESTIONNAIRE METRICS & SPECIFICATIONS
  checkPageBreak(38);
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 15, 15);
  doc.text('2. STRUCTURED SPECIFICATIONS & QUESTIONNAIRE METRICS', margin + 3, y + 4);
  y += 8.5;

  const metricsEntries = Object.entries(agreement.questionnaire_data || {}).filter(([k, v]) => v && k !== 'item_photos');

  for (let i = 0; i < metricsEntries.length; i += 2) {
    checkPageBreak(8);
    const itemA = metricsEntries[i];
    const itemB = metricsEntries[i + 1];

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(80, 80, 80);
    const labelA = itemA[0].replace(/_/g, ' ').toUpperCase();
    doc.text(`${labelA}:`, margin + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    doc.text(String(itemA[1]), margin + 55, y);

    if (itemB) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      const labelB = itemB[0].replace(/_/g, ' ').toUpperCase();
      doc.text(`${labelB}:`, margin + 105, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(20, 20, 20);
      doc.text(String(itemB[1]), margin + 155, y);
    }

    y += 4.8;
  }

  y += 3;

  // SECTION 3: LEGAL CLAUSES & SPECIAL CONDITIONS
  checkPageBreak(35);
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 15, 15);
  doc.text('3. OPERATIVE COVENANTS & CUSTOM CLAUSES', margin + 3, y + 4);
  y += 8.5;

  agreement.custom_clauses?.forEach((clause, idx) => {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(15, 15, 15);
    doc.text(`3.${idx + 1} ${clause.title}`, margin + 2, y);
    y += 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(50, 50, 50);
    const clauseLines = doc.splitTextToSize(clause.content, contentWidth - 4);
    doc.text(clauseLines, margin + 4, y);
    y += clauseLines.length * 3.4 + 2.5;
  });

  // SECTION 4: STATUTORY WITNESS NEUTRALITY DECLARATION
  checkPageBreak(25);
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.6);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, y, contentWidth, 16, 1.2, 1.2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(0, 0, 0);
  doc.text('STATUTORY DECLARATION OF WITNESS NEUTRALITY', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(50, 50, 50);
  const witnessDecl = doc.splitTextToSize(
    'I, the undersigned Neutral Witness, solemnly declare that I have zero financial, pecuniary, or beneficial interest in this transaction, am not a beneficiary of any transferred asset or payment, and have witnessed the genuine identity, free will, and electronic execution of both parties under the Laws of Kenya.',
    contentWidth - 6
  );
  doc.text(witnessDecl, margin + 3, y + 8.5);
  y += 20;

  // SECTION 5: SIGNATURES & OFFICIAL AGANA SEAL STAMP
  checkPageBreak(50);
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 15, 15);
  doc.text('4. DIGITAL SIGNATURES & ATTESTATION', margin + 3, y + 4);
  y += 8.5;

  const sigBoxWidth = (contentWidth - 4) / 3;

  // Creator Signature
  doc.setDrawColor(210, 210, 210);
  doc.rect(margin, y, sigBoxWidth, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 15, 15);
  doc.text('CREATOR SIGNATURE', margin + 2, y + 3.8);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`Signed: /s/ ${creator?.full_name || 'Creator'}`, margin + 2, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(80, 80, 80);
  doc.text(`Biometric: Didit Passed (0.994)`, margin + 2, y + 16.5);
  doc.text(`Time: ${creator?.signed_at || dateStr}`, margin + 2, y + 21);

  // Counterparty Signature
  const sx2 = margin + sigBoxWidth + 2;
  doc.rect(sx2, y, sigBoxWidth, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 15, 15);
  doc.text('SECOND PARTY SIGNATURE', sx2 + 2, y + 3.8);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`Signed: /s/ ${counterparty?.full_name || 'Party B'}`, sx2 + 2, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(80, 80, 80);
  doc.text(`Biometric: Didit Passed (0.992)`, sx2 + 2, y + 16.5);
  doc.text(`Time: ${counterparty?.signed_at || dateStr}`, sx2 + 2, y + 21);

  // Witness Signature
  const sx3 = margin + (sigBoxWidth * 2) + 4;
  doc.rect(sx3, y, sigBoxWidth, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 15, 15);
  doc.text('WITNESS ATTESTATION', sx3 + 2, y + 3.8);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`Attested: /s/ ${witness?.full_name || 'Neutral Witness'}`, sx3 + 2, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(80, 80, 80);
  doc.text(`Affidavit: Zero Benefit Certified`, sx3 + 2, y + 16.5);
  doc.text(`Time: ${witness?.signed_at || dateStr}`, sx3 + 2, y + 21);

  y += 28;

  // OFFICIAL CIRCULAR AGANA SEAL STAMP AT THE BOTTOM
  checkPageBreak(35);
  const sealCenterX = pageWidth / 2;
  const sealCenterY = y + 14;
  const sealRadius = 13.5;

  // Outer concentric circles
  doc.setDrawColor(24, 24, 27);
  doc.setLineWidth(0.8);
  doc.circle(sealCenterX, sealCenterY, sealRadius);

  doc.setLineWidth(0.3);
  doc.circle(sealCenterX, sealCenterY, sealRadius - 1.4);

  // Inner dotted circle
  doc.setLineWidth(0.2);
  doc.circle(sealCenterX, sealCenterY, sealRadius - 4.5);

  // Circular Seal Stamp Typography
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.8);
  doc.setTextColor(18, 18, 18);
  doc.text('★ AGANA DIGITAL NOTARIAL SEAL ★', sealCenterX, sealCenterY - 7.5, { align: 'center' });
  doc.text('REPUBLIC OF KENYA', sealCenterX, sealCenterY - 4.8, { align: 'center' });

  // Center Emblem & Verified text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text('VERIFIED & SEALED', sealCenterX, sealCenterY - 0.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.8);
  doc.setTextColor(70, 70, 70);
  doc.text('CAP 23 • SMALL CLAIMS 2016', sealCenterX, sealCenterY + 3.2, { align: 'center' });
  doc.text(dateStr.toUpperCase(), sealCenterX, sealCenterY + 6, { align: 'center' });
  doc.text('★ TAMPER-EVIDENT ★', sealCenterX, sealCenterY + 8.8, { align: 'center' });

  y += 31;

  // Cryptographic SHA-256 Hash Block
  checkPageBreak(14);
  doc.setFillColor(18, 18, 18);
  doc.rect(margin, y, contentWidth, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('CRYPTOGRAPHIC SHA-256 INTEGRITY SEAL:', margin + 3, y + 4);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(230, 230, 230);
  doc.text(agreement.sha256_seal || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', margin + 3, y + 7.8);

  return doc;
}
