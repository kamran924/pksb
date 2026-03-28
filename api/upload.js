import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, data } = req.body;

    if (!filename || !data) {
      return res.status(400).json({ error: 'Missing filename or data' });
    }

    // Generate unique filename with timestamp
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    const uniqueFilename = `${name}_${Date.now()}${ext}`;
    const filepath = path.join(imagesDir, uniqueFilename);

    // Convert base64 to buffer and save
    const buffer = Buffer.from(data.split(',')[1], 'base64');
    fs.writeFileSync(filepath, buffer);

    // Return relative path for use in HTML
    const relativePath = `/images/${uniqueFilename}`;
    return res.status(200).json({ success: true, path: relativePath });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
