import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { generateChecklist, generateLetter } from './content-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildSuccessionPdf(record) {
  const [letter, checklist] = await Promise.all([
    generateLetter(record),
    generateChecklist(record)
  ]);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const margin = 48;
  const lineHeight = 15;
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let cursorY = height - margin;

  page.drawRectangle({
    x: 0,
    y: height - 86,
    width,
    height: 86,
    color: rgb(0.07, 0.15, 0.31)
  });

  page.drawText(process.env.PDF_BRAND_NAME || 'JVN LAB', {
    x: margin,
    y: height - 42,
    size: 20,
    font: boldFont,
    color: rgb(1, 1, 1)
  });

  page.drawText('Dossier de succession', {
    x: margin,
    y: height - 64,
    size: 12,
    font: regularFont,
    color: rgb(0.9, 0.93, 1)
  });

  cursorY = height - 110;

  cursorY = drawSectionTitle(page, '1. Recapitulatif structure', cursorY, margin, boldFont);
  const recapLines = buildRecapLines(record);
  cursorY = drawBulletLines(page, recapLines, cursorY, margin, regularFont, boldFont, lineHeight);

  cursorY -= 8;
  cursorY = drawSectionTitle(page, '2. Lettre d accompagnement IA', cursorY, margin, boldFont);
  cursorY = drawWrappedParagraphs(page, letter.content.split('\n'), cursorY, margin, width - margin * 2, regularFont, 11, lineHeight);
  cursorY -= 4;
  page.drawText(`Source du contenu: ${letter.source}`, {
    x: margin,
    y: cursorY,
    size: 9,
    font: regularFont,
    color: rgb(0.45, 0.45, 0.45)
  });

  cursorY -= 24;
  cursorY = drawSectionTitle(page, '3. Checklist personnalisee IA', cursorY, margin, boldFont);
  const checklistLines = checklist.items.map((item, index) => `[ ] ${index + 1}. ${item}`);
  cursorY = drawWrappedParagraphs(page, checklistLines, cursorY, margin, width - margin * 2, regularFont, 11, lineHeight);
  cursorY -= 4;
  page.drawText(`Source du contenu: ${checklist.source}`, {
    x: margin,
    y: cursorY,
    size: 9,
    font: regularFont,
    color: rgb(0.45, 0.45, 0.45)
  });

  const bytes = await pdfDoc.save();
  const fileName = buildFileName(record);
  const outputDir = path.resolve(__dirname, '..', '..', process.env.PDF_OUTPUT_DIR || 'storage/pdfs');
  const filePath = path.join(outputDir, fileName);
  await mkdir(outputDir, { recursive: true });
  await writeFile(filePath, bytes);

  return { fileName, filePath };
}

function buildRecapLines(record) {
  const heirs = record.heirs.length
    ? record.heirs.map((heir) => `${fullName(heir)} - ${heir.relationship || 'Lien non precise'}`).join('; ')
    : 'Aucun heredier renseigne';

  const assets = record.assets.length
    ? record.assets
        .map((asset) => `${asset.type || 'Bien'}${asset.description ? `: ${asset.description}` : ''}${typeof asset.value === 'number' ? ` (${formatCurrency(asset.value)})` : ''}`)
        .join('; ')
    : 'Aucun actif renseigne';

  return [
    `Defunt: ${fullName(record.deceased)}`,
    `Date de deces: ${record.deceased?.dateOfDeath || 'Non renseignee'}`,
    `Declarant: ${fullName(record.declarant)}`,
    `Coordonnees declarant: ${record.declarant?.email || 'Email non renseigne'} / ${record.declarant?.phone || 'Telephone non renseigne'}`,
    `Heritiers: ${heirs}`,
    `Actifs: ${assets}`
  ];
}

function buildFileName(record) {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const safeName = String(record.deceased?.lastName || 'NomDefunt').replace(/[^a-zA-Z0-9_-]/g, '');
  return `succession_${safeName}_${date}.pdf`;
}

function drawSectionTitle(page, title, cursorY, margin, font) {
  page.drawText(title, {
    x: margin,
    y: cursorY,
    size: 14,
    font,
    color: rgb(0.07, 0.15, 0.31)
  });

  return cursorY - 20;
}

function drawBulletLines(page, lines, cursorY, margin, regularFont, boldFont, lineHeight) {
  for (const line of lines) {
    page.drawText('•', {
      x: margin,
      y: cursorY,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    cursorY = drawWrappedLine(page, line, cursorY, margin + 14, 595.28 - (margin * 2) - 14, regularFont, 11, lineHeight);
    cursorY -= 2;
  }

  return cursorY;
}

function drawWrappedParagraphs(page, paragraphs, cursorY, x, maxWidth, font, fontSize, lineHeight) {
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      cursorY -= lineHeight;
      continue;
    }

    cursorY = drawWrappedLine(page, paragraph, cursorY, x, maxWidth, font, fontSize, lineHeight);
  }

  return cursorY;
}

function drawWrappedLine(page, text, cursorY, x, maxWidth, font, fontSize, lineHeight) {
  const words = text.split(/\s+/);
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    const candidateWidth = font.widthOfTextAtSize(candidate, fontSize);

    if (candidateWidth <= maxWidth) {
      line = candidate;
      continue;
    }

    page.drawText(line, { x, y: cursorY, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
    cursorY -= lineHeight;
    line = word;
  }

  if (line) {
    page.drawText(line, { x, y: cursorY, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
    cursorY -= lineHeight;
  }

  return cursorY;
}

function fullName(person = {}) {
  return [person.firstName, person.lastName].filter(Boolean).join(' ').trim() || 'Nom non renseigne';
}

function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}
