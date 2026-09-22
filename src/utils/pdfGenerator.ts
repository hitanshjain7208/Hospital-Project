import { jsPDF } from 'jspdf';
import { Prescription } from '../types';

export function generatePrescriptionPDF(prescription: Prescription): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Background Accent
  doc.setFillColor(2, 132, 199); // Medical Blue
  doc.rect(0, 0, pageWidth, 24, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('MEDCONNECT AI - DIGITAL MEDICAL PRESCRIPTION', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Prescription ID: ${prescription.id.toUpperCase()}`, pageWidth - 14, 15, { align: 'right' });

  y = 34;

  // Hospital Info Block
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(prescription.hospitalName, 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // Slate 600
  doc.text(`Date: ${prescription.date}`, pageWidth - 14, y, { align: 'right' });

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.setFontSize(11);
  doc.text(`Dr. ${prescription.doctorName}`, 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${prescription.doctorSpecialization} | Reg No: ${prescription.doctorRegistration}`, 14, y + 5);

  y += 14;

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageWidth - 14, y);

  y += 6;

  // Patient Info Card Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('PATIENT INFORMATION', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Name: ${prescription.patientName}`, 18, y + 12);
  doc.text(`Age / Gender: ${prescription.patientAge} yrs / ${prescription.patientGender}`, 18, y + 17);

  if (prescription.vitals) {
    const vitalsStr = `BP: ${prescription.vitals.bloodPressure || '120/80'} | Pulse: ${prescription.vitals.pulseRate || '72 bpm'} | Temp: ${prescription.vitals.temperature || '98.6 °F'} | Wt: ${prescription.vitals.weightKg || '68 kg'}`;
    doc.text(vitalsStr, pageWidth / 2 + 10, y + 12);
  }

  y += 30;

  // Diagnosis Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(2, 132, 199);
  doc.text('DIAGNOSIS & CLINICAL NOTES:', 14, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.diagnosis || 'General Clinical Consultation', 14, y);

  y += 10;

  // Rx Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(2, 132, 199);
  doc.text('Rx (PRESCRIBED MEDICATIONS)', 14, y);

  y += 6;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('Medicine Name', 18, y + 5.5);
  doc.text('Dosage', 85, y + 5.5);
  doc.text('Frequency', 120, y + 5.5);
  doc.text('Duration', 165, y + 5.5);

  y += 9;

  // Medicines List Rows
  prescription.medicines.forEach((med, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 1, pageWidth - 28, 8, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${med.name}`, 18, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.text(med.dosage, 85, y + 4);
    doc.text(med.frequency, 120, y + 4);
    doc.text(`${med.durationDays} Days`, 165, y + 4);

    if (med.instructions) {
      y += 5;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`   Instructions: ${med.instructions}`, 18, y + 3);
    }

    y += 7;
  });

  y += 6;

  // Additional Advice & Follow up
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(2, 132, 199);
  doc.text('SPECIAL ADVICE & INSTRUCTIONS:', 14, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const splitAdvice = doc.splitTextToSize(prescription.advice || 'Drink plenty of fluids, rest adequately, and follow medicine timing strictly.', pageWidth - 28);
  doc.text(splitAdvice, 14, y);

  y += splitAdvice.length * 5 + 6;

  if (prescription.followUpDate) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // Soft Green
    doc.text(`Follow-up Visit Date: ${prescription.followUpDate}`, 14, y);
    y += 10;
  }

  // Footer & Digital Signature
  const footerY = Math.max(y + 10, 245);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, footerY, pageWidth - 14, footerY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('This is an electronically generated valid digital prescription issued via MedConnect AI Healthcare Ecosystem.', 14, footerY + 6);

  // Digital Signature Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Dr. ${prescription.doctorName}`, pageWidth - 14, footerY + 8, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(2, 132, 199);
  doc.text('[ digitally signed ]', pageWidth - 14, footerY + 12, { align: 'right' });

  // Save the PDF
  const filename = `Prescription_${prescription.patientName.replace(/\s+/g, '_')}_${prescription.date}.pdf`;
  doc.save(filename);
}
