// server.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const cors = require('cors');

const app = express();

// Limit body size pou evite upload twò lou
app.use(cors());
app.use(express.json({ limit: '500kb' }));

// Simple request logger for /api
app.use('/api', (req, res, next) => {
  console.log(`[API] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Helper: sanitize domain name -> lowercase, allow letters/numbers/hyphen only
function sanitizeDomain(raw) {
  if (!raw) return '';
  let d = String(raw).toLowerCase().trim();
  // Replace spaces and invalid chars with '-'
  d = d.replace(/[^a-z0-9-]/g, '-');
  // Remove leading/trailing hyphens
  d = d.replace(/^-+|-+$/g, '');
  // Limit length (63 is common max for subdomain labels)
  if (d.length > 63) d = d.slice(0, 63);
  return d;
}

// --- API routes (FIRST) ---
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

/**
 * POST /api/register
 * body: { domain: "lavie", code: "<!doctype html>..." }
 * saves to sites/<domain>/index.html and returns URL
 */
app.post('/api/register', async (req, res) => {
  try {
    const { domain: rawDomain, code } = req.body || {};
    if (!rawDomain || !code) return res.status(400).json({ success: false, error: 'domain or code missing' });

    const domain = sanitizeDomain(rawDomain);
    if (!domain) return res.status(400).json({ success: false, error: 'domain invalid after sanitization' });

    // Optional: refuse very short domain names
    if (domain.length < 2) return res.status(400).json({ success: false, error: 'domain too short' });

    // Prepare site dir
    const sitesRoot = path.join(__dirname, 'sites');
    const siteDir = path.join(sitesRoot, domain);

    // Create root folder if missing
    if (!fsSync.existsSync(sitesRoot)) {
      await fs.mkdir(sitesRoot, { recursive: true });
    }

    // If site already exists, we can either reject or overwrite. Here we overwrite.
    await fs.mkdir(siteDir, { recursive: true });

    // Write index.html (overwrite)
    const indexPath = path.join(siteDir, 'index.html');

    // You might want to sanitize/validate the HTML further in prod (XSS, JS limits, etc.)
    await fs.writeFile(indexPath, code, { encoding: 'utf8' });

    // Build public URL. We serve sites under /d/<domain>/ so final URL ends with '/'
    const host = req.headers.host || `localhost:${process.env.PORT || 3000}`;
    const url = `http://${host}/d/${domain}/`; // trailing slash helps serving index.html

    return res.json({ success: true, domain: `${domain}.tf`, url });
  } catch (err) {
    console.error('Error in /api/register:', err);
    return res.status(500).json({ success: false, error: 'internal_server_error' });
  }
});

// Serve user sites at /d/<domain>/  -> maps to sites/<domain>/index.html
app.use('/d', express.static(path.join(__dirname, 'sites'), {
  index: 'index.html',
  extensions: ['html']
}));

// Serve other static files (your main index, client assets, etc.)
app.use(express.static(path.join(__dirname)));

// SPA fallback (dernye santans)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
