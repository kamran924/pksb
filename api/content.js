import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../db');

// Ensure db directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

function getDataPath(type) {
  return path.join(dbPath, `${type}.json`);
}

function readData(type) {
  try {
    const data = fs.readFileSync(getDataPath(type), 'utf8');
    return JSON.parse(data);
  } catch {
    return type === 'about' ? {} : [];
  }
}

function writeData(type, data) {
  fs.writeFileSync(getDataPath(type), JSON.stringify(data, null, 2));
}

function generateId() {
  return Date.now().toString();
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, id } = req.query;

  if (!type) return res.status(400).json({ error: 'Missing type parameter' });

  // GET: fetch all items
  if (req.method === 'GET') {
    const data = readData(type);
    return res.status(200).json(data);
  }

  // POST: add or update
  if (req.method === 'POST') {
    const data = readData(type);
    const item = req.body;
    
    if (!item.id) item.id = generateId();

    if (Array.isArray(data)) {
      const index = data.findIndex(i => i.id === item.id);
      if (index > -1) {
        data[index] = item;
      } else {
        data.push(item);
      }
    } else {
      data[item.id || item.name] = item;
    }

    writeData(type, data);
    return res.status(200).json(item);
  }

  // DELETE: remove item
  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'Missing id parameter' });
    
    const data = readData(type);
    
    if (Array.isArray(data)) {
      const filtered = data.filter(i => i.id !== id);
      writeData(type, filtered);
    }

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}