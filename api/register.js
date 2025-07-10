import fs from 'fs/promises';

export async function POST(req) {
  try {
    const body = await req.json();
    const { domain, code } = body;

    if (!domain || !code) {
      return new Response(JSON.stringify({ error: 'Domain or code missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const safeDomain = domain.replace(/[^a-zA-Z0-9_-]/g, '');
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${safeDomain}.tf</title>
</head>
<body>
${code}
</body>
</html>`;

    const filePath = `./domain/${safeDomain}.html`;
    await fs.writeFile(filePath, fullHtml);

    return new Response(JSON.stringify({ success: true, url: `/domain/${safeDomain}.html` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('❌ API Error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
