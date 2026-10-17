import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Campus,
  Domain,
  CAMPUS_LABELS,
  DOMAIN_LABELS,
  ALL_DOMAINS,
  ALL_CAMPUSES,
} from '@/lib/viteee-data';

export interface ReportRow {
  key: string;
  campus: string;
  course: string;
  category: string;
  closingRank: string;
  status: 'Secured' | 'Reach';
  isNew?: boolean;
}

export interface ReportInput {
  rank: number;
  actionType: 'analysis' | 'counselling';
  domains: Domain[];
  minCategory: number | null;
  campuses: Campus[];
  rows: ReportRow[];
  qrDataURL: string;
  shareUrl: string;
}

const SITE_URL = 'https://ranks.vhome.co.in';
const NEW_SITE_URL = 'https://viteee.malabarmatrix.in';
const INSTAGRAM_URL = 'https://www.instagram.com/malabar.matrix';
const STUDIO_URL = 'https://malabarmatrix.in';
const OG_IMAGE_PATH = '/hompage.png';

const formatList = <T extends string>(
  items: T[],
  total: number,
  labels: Record<T, string>,
  allLabel: string,
): string => {
  if (items.length === 0 || items.length === total) return allLabel;
  return items.map((i) => labels[i]).join(', ');
};

async function fetchImageAsDataURL(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateReport(data: ReportInput): Promise<void> {
  const ogImage = await fetchImageAsDataURL(OG_IMAGE_PATH);

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Brand stripe
  doc.setFillColor(255, 122, 89);
  doc.rect(0, 0, pageW, 6, 'F');

  // Random 8-char report ID (hex, uppercase)
  const reportId = Array.from(
    typeof crypto !== 'undefined' && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint8Array(4))
      : Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)),
  )
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 50);
  doc.text(`REF · ${reportId}`, margin, 12);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 30);
  doc.text('VITEEE Rank Predictor', margin, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(110, 110, 120);
  doc.text(
    data.actionType === 'counselling' ? 'Counselling Report' : 'Rank Analysis Report',
    margin,
    26,
  );

  // QR (top right)
  const qrSize = 32;
  const qrX = pageW - margin - qrSize;
  const qrY = 14;
  if (data.qrDataURL) {
    doc.addImage(data.qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 150);
  doc.text('Scan to recreate', qrX + qrSize / 2, qrY + qrSize + 3.5, {
    align: 'center',
  });

  // "Recreate this report" button under the QR — clickable link
  if (data.shareUrl) {
    const btnW = qrSize;
    const btnH = 7.5;
    const btnX = qrX;
    const btnY = qrY + qrSize + 5.5;
    doc.setFillColor(255, 122, 89);
    doc.roundedRect(btnX, btnY, btnW, btnH, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(40, 16, 32);
    doc.textWithLink(
      'Open Report',
      btnX + btnW / 2,
      btnY + btnH / 2 + 1.5,
      {
        url: data.shareUrl,
        align: 'center',
      },
    );
    doc.link(btnX, btnY, btnW, btnH, { url: data.shareUrl });
  }

  // Meta block
  let y = 38;
  doc.setDrawColor(220, 220, 225);
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageW - margin - qrSize - 4, y);
  y += 6;

  const metaLineH = 5.5;
  const labelColor: [number, number, number] = [120, 120, 130];
  const valueColor: [number, number, number] = [30, 30, 40];

  const drawMetaRow = (label: string, value: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...labelColor);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...valueColor);
    const wrapped = doc.splitTextToSize(value, pageW - margin - qrSize - 30);
    doc.text(wrapped, margin + 28, y);
    y += metaLineH * Math.max(1, wrapped.length);
  };

  drawMetaRow('Date', `${dateStr}, ${timeStr}`);
  drawMetaRow('Rank', `#${data.rank.toLocaleString('en-IN')}`);
  drawMetaRow(
    'Domains',
    formatList(data.domains, ALL_DOMAINS.length, DOMAIN_LABELS, 'All Domains'),
  );
  drawMetaRow(
    'Category',
    data.minCategory === null
      ? 'All Categories'
      : `Cat ${data.minCategory} and higher (Cat ${data.minCategory}–5)`,
  );
  drawMetaRow(
    'Campuses',
    formatList(data.campuses, ALL_CAMPUSES.length, CAMPUS_LABELS, 'All Eligible'),
  );

  y += 2;

  // Table
  if (data.actionType === 'counselling' && data.rows.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Campus', 'Course', 'Category', 'Closing Rank', 'Status']],
      body: data.rows.map((r, i) => [
        String(i + 1),
        r.campus + (r.isNew ? '  (New)' : ''),
        r.course,
        r.category,
        r.closingRank,
        r.status,
      ]),
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 2.4,
        textColor: [30, 30, 40],
        lineColor: [225, 225, 230],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [44, 28, 56],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [248, 248, 250] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 24 },
        3: { cellWidth: 18, halign: 'center' },
        4: { cellWidth: 24, halign: 'right' },
        5: { cellWidth: 22 },
      },
      didParseCell: (cellData) => {
        if (cellData.section === 'body' && cellData.column.index === 5) {
          const v = String(cellData.cell.raw ?? '');
          if (v === 'Secured') cellData.cell.styles.textColor = [22, 130, 90];
          if (v === 'Reach') cellData.cell.styles.textColor = [200, 120, 30];
        }
      },
      margin: { left: margin, right: margin },
    });
  } else if (data.actionType === 'counselling') {
    doc.setFontSize(10);
    doc.setTextColor(140, 140, 150);
    doc.text('No matches for the selected preferences.', margin, y + 8);
  }

  // Credits block — og image + clickable links. Lives right after the table,
  // and gets its own page if it would collide with the page footer.
  const lastY =
    (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable
      ?.finalY ?? y + 12;

  const imgW = 110;
  const imgH = imgW * (630 / 1200); // og image aspect ratio
  const linksH = 22;
  const creditsBlockH = imgH + linksH + 18; // padding included
  const creditsTop = lastY + 12;
  const footerReserve = 18;

  let cy: number;
  if (creditsTop + creditsBlockH > pageH - footerReserve) {
    doc.addPage();
    cy = 24;
  } else {
    cy = creditsTop;
  }

  // Section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 50);
  doc.text('Made for VITEEE aspirants', margin, cy);
  cy += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 130);
  doc.text(
    'Free mock tests, syllabus, and rank tools — no signup, no paywall.',
    margin,
    cy,
  );
  cy += 6;

  // OG image — centered
  if (ogImage) {
    const imgX = (pageW - imgW) / 2;
    try {
      doc.addImage(ogImage, 'PNG', imgX, cy, imgW, imgH);
      // make whole image clickable to the site
      doc.link(imgX, cy, imgW, imgH, { url: SITE_URL });
    } catch {
      // Skip the image if jsPDF rejects the format
    }
    cy += imgH + 8;
  }

  // Links row — three cells, evenly spaced
  const links: { label: string; value: string; url: string }[] = [
    { label: 'Website', value: 'ranks.vhome.co.in', url: SITE_URL },
    { label: 'Alternate', value: 'viteee.malabarmatrix.in', url: NEW_SITE_URL},
    { label: 'Instagram', value: '@malabar.matrix', url: INSTAGRAM_URL },
    { label: 'Studio', value: 'malabarmatrix.site', url: STUDIO_URL },
  ];

  const cellW = (pageW - margin * 2) / links.length;
  const cellH = 16;
  doc.setDrawColor(225, 225, 230);
  doc.setLineWidth(0.2);

  links.forEach((link, i) => {
    const x = margin + i * cellW;
    // Cell border
    doc.roundedRect(x + 2, cy, cellW - 4, cellH, 2, 2);

    // Label (small uppercase)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 150);
    doc.text(link.label.toUpperCase(), x + cellW / 2, cy + 5, { align: 'center' });

    // Value (bold, link-coloured)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(220, 90, 60);
    doc.textWithLink(link.value, x + cellW / 2, cy + 11, {
      url: link.url,
      align: 'center',
    });

    doc.link(x + 2, cy, cellW - 4, cellH, { url: link.url });
  });

  // Page footer (every page)
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(150, 150, 160);
    doc.text(
      'Unofficial — scraped public data, not from VIT. For understanding only.',
      margin,
      pageH - 7,
    );
    doc.text(`Page ${p} / ${pageCount}`, pageW - margin, pageH - 7, {
      align: 'right',
    });
    if (data.shareUrl) {
      doc.setTextColor(100, 100, 110);
      doc.textWithLink(data.shareUrl, margin, pageH - 11, { url: data.shareUrl });
    }
  }

  doc.save(
    `viteee-rank-${data.rank}-${data.actionType}-${now.toISOString().slice(0, 10)}.pdf`,
  );
}
