const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO  = process.env.GITHUB_REPO;
const BRANCH       = process.env.GITHUB_BRANCH || 'main';

async function getFile(type) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/db/${type}.json?ref=${BRANCH}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
  });

  if (res.status === 404) return { data: type === 'about' ? {} : [], sha: null };
  if (!res.ok) throw new Error(`GitHub read error: ${res.status}`);

  const file = await res.json();
  return {
    data: JSON.parse(Buffer.from(file.content, 'base64').toString('utf8')),
    sha: file.sha
  };
}

async function writeFile(type, data, sha) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/db/${type}.json`;
  const body = {
    message: `Update ${type}.json via admin dashboard`,
    content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
    branch: BRANCH,
    ...(sha && { sha })
  };

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error(`GitHub write error: ${res.status} — ${await res.text()}`);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, id } = req.query;
  if (!type) return res.status(400).json({ error: 'Missing type parameter' });

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({ error: 'Missing GITHUB_TOKEN or GITHUB_REPO environment variables' });
  }

  try {
    if (req.method === 'GET') {
      const { data } = await getFile(type);
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { data, sha } = await getFile(type);
      const item = req.body;

      if (type === 'about') {
        const { id: _id, ...sections } = item;
        const newData = { ...data, ...sections };
        await writeFile(type, newData, sha);
        return res.status(200).json(newData);
      }

      if (!item.id) item.id = Date.now().toString();
      const arr = Array.isArray(data) ? [...data] : [];
      const index = arr.findIndex(i => i.id === item.id);
      if (index > -1) arr[index] = item;
      else arr.push(item);

      await writeFile(type, arr, sha);
      return res.status(200).json(item);
    }

    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'Missing id parameter' });
      const { data, sha } = await getFile(type);
      if (Array.isArray(data)) {
        await writeFile(type, data.filter(i => i.id !== id), sha);
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Content API error:', err);
    return res.status(500).json({ error: err.message });
  }
}