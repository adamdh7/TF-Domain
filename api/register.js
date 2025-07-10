// api/register.js

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Non' });
  }

  try {
    let body = '';

    // Resevwa done an
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { name, code } = JSON.parse(body);

      if (!name || !code) {
        return res.status(400).json({ error: 'Ex--TF-Stream.' });
      }

      const safeName = name.toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const filename = `${safeName}.html`;
      const filePath = path.join(process.cwd(), 'public', 'domains', filename);

      // Kreye folder si li pa egziste
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      // Sove kòd la
      fs.writeFileSync(filePath, code, 'utf8');

      return res.status(200).json({
        success: true,
        domain: `${safeName}.tf`,
        url: `https://tf-domain.vercel.app/domains/${filename}`
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erè sèvè.' });
  }
        }
