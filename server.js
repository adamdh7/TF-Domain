// api/register.js

export default async function handler(req, res) {
  const name = req.query.name?.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (!name || name.length < 3 || name.length > 32) {
    return res.status(400).json({
      success: false,
      message: ' (Max 3-32 Ex--> Tergene).'
    });
  }

  // Similasyon ke domèn lan disponib
  return res.status(200).json({ success: true });
}
