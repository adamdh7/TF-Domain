// api/register.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { domain, code } = req.body || {};
  if (!domain || !code) {
    return res.status(400).json({ success: false, error: 'Domain or code missing' });
  }

  try {
    // Nettoyage du nom
    const safe = domain.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    const filename = `${safe}.html`;

    // Génération du HTML complet
    const fullHtml = `
<!DOCTYPE html>
<html lang="ht">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${safe}.tf</title>
</head>
<body>
${code}
</body>
</html>`;

    // Chemin vers public/domain
    const dir = path.join(process.cwd(), 'public', 'domain');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Écriture du fichier
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, fullHtml, 'utf8');

    return res.status(200).json({
      success: true,
      domain: `${safe}.tf`,
      url: `/domain/${filename}`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
