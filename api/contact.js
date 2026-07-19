// POST /api/contact — receives the footer contact form and emails it on.
//
// Mirrors the asxstills endpoint contract: always responds 200 with
// { delivered: boolean } so the client can distinguish "sent" from
// "accepted but email isn't configured". Non-2xx is reserved for real errors.
//
// Required env vars (set in Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   API key from resend.com. Without it, delivered:false.
//   CONTACT_TO       destination address. Falls back to CONTACT_FROM's owner.
//   CONTACT_FROM     verified sender, e.g. "site@yourdomain.com".
//                    Resend requires a domain you've verified.

const MAX_MESSAGE = 500;
const MAX_NAME = 100;
const MAX_EMAIL = 200;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'invalid json' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'invalid body' });
  }

  // Honeypot: real users never fill this, bots usually do.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return res.status(200).json({ delivered: true });
  }

  const name = String(body.name ?? '').trim().slice(0, MAX_NAME);
  const email = String(body.email ?? '').trim().slice(0, MAX_EMAIL);
  const message = String(body.message ?? '').trim().slice(0, MAX_MESSAGE);

  if (!message) {
    return res.status(400).json({ error: 'message required' });
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;

  // Not configured yet — accept the message but tell the client the truth
  // rather than showing a success state for mail that went nowhere.
  if (!apiKey || !to || !from) {
    console.warn('contact: email not configured, dropping message');
    return res.status(200).json({ delivered: false });
  }

  const text = [
    `From: ${name || '(no name given)'}`,
    `Email: ${email || '(no email given)'}`,
    '',
    message,
  ].join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Site message from ${name || 'anonymous'}`,
        text,
        ...(email ? { reply_to: email } : {}),
      }),
    });

    if (!r.ok) {
      // Log status only — the response body can echo back the key.
      console.error('contact: resend responded', r.status);
      return res.status(502).json({ error: 'send failed' });
    }

    return res.status(200).json({ delivered: true });
  } catch (err) {
    console.error('contact: send threw', err && err.message);
    return res.status(502).json({ error: 'send failed' });
  }
};
