import nodemailer from 'nodemailer';

export async function sendSuccessionEmail(record, attachmentPath) {
  if (!process.env.SMTP_HOST || !process.env.EMAIL_FROM) {
    return {
      skipped: true,
      reason: 'SMTP configuration is missing.'
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      : undefined
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: record.clientEmail,
    subject: `Votre dossier de succession - ${record.deceased?.lastName || record.id}`,
    text: [
      'Bonjour,',
      '',
      'Votre PDF de succession est pret et joint a cet email.',
      '',
      'Cordialement,',
      process.env.PDF_BRAND_NAME || 'JVN LAB'
    ].join('\n'),
    attachments: [
      {
        filename: record.pdf?.fileName || undefined,
        path: attachmentPath
      }
    ]
  });

  return {
    skipped: false,
    messageId: info.messageId
  };
}
