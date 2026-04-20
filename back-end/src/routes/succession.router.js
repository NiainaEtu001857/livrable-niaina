import { Router } from 'express';
import { buildSuccessionPdf } from '../services/pdf-service.js';
import { sendSuccessionEmail } from '../services/email-service.js';

export const successionRouter = Router();

const successions = new Map();

successionRouter.post('/', async (req, res) => {
  try {
    const record = normalizeSuccessionPayload(req.body);
    successions.set(record.id, record);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

successionRouter.post('/:id/pay', async (req, res) => {
  const record = successions.get(req.params.id);

  if (!record) {
    return res.status(404).json({ error: 'Succession record not found.' });
  }

  record.paid = true;
  const pdfResult = await buildSuccessionPdf(record);
  record.pdf = pdfResult;

  let email = { skipped: true };
  if (record.clientEmail) {
    email = await sendSuccessionEmail(record, pdfResult.filePath);
  }

  res.json({
    message: 'Payment confirmed. PDF generated.',
    downloadUrl: `/api/succession/${record.id}/pdf`,
    email
  });
});

successionRouter.get('/:id/pdf', async (req, res) => {
  const record = successions.get(req.params.id);

  if (!record) {
    return res.status(404).json({ error: 'Succession record not found.' });
  }

  if (!record.paid) {
    return res.status(403).json({ error: 'Payment required before downloading the PDF.' });
  }

  if (!record.pdf) {
    record.pdf = await buildSuccessionPdf(record);
  }

  res.download(record.pdf.filePath, record.pdf.fileName);
});

successionRouter.get('/:id', (req, res) => {
  const record = successions.get(req.params.id);

  if (!record) {
    return res.status(404).json({ error: 'Succession record not found.' });
  }

  res.json(record);
});

function normalizeSuccessionPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid JSON payload.');
  }

  const id = String(payload.id || '').trim();
  const deceasedLastName = String(payload?.deceased?.lastName || '').trim();

  if (!id) {
    throw new Error('Field "id" is required.');
  }

  if (!deceasedLastName) {
    throw new Error('Field "deceased.lastName" is required.');
  }

  return {
    id,
    paid: Boolean(payload.paid),
    clientEmail: payload.clientEmail ? String(payload.clientEmail).trim() : '',
    declarant: payload.declarant || {},
    deceased: payload.deceased || {},
    heirs: Array.isArray(payload.heirs) ? payload.heirs : [],
    assets: Array.isArray(payload.assets) ? payload.assets : [],
    context: payload.context || {}
  };
}
