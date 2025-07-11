// api/register.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { domain, code } = req.body || {};
  if (!domain || !code) {
    return res.status(400).json({ success: false, error: 'Domain or code missing' });
  }

  try {
    // Nettoyage du nom de domaine
    const safe = domain.toLowerCase().replace(/[^a-z0-9-_]/g, '');

    // Génération du lien dynamique
    const dynamicUrl = `/view?domain=${encodeURIComponent(safe)}&code=${encodeURIComponent(code)}`;

    return res.status(200).json({
      success: true,
      domain: `${safe}.tf`,
      url: dynamicUrl
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
        }
