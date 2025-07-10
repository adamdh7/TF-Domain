// api/register.js
export default function handler(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Non obligatwa' });
  }

  // Simulasyon rezèvasyon domain lan
  const domain = `${name.toLowerCase()}.tf`;

  return res.status(200).json({
    success: true,
    domain,
    message: `Domèn ${domain} rezève avèk siksè!`
  });
    }
