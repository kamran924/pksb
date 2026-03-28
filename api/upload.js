const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO  = process.env.GITHUB_REPO;
const BRANCH       = process.env.GITHUB_BRANCH || 'main';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({ error: 'Missing GITHUB_TOKEN or GITHUB_REPO environment variables' });
  }

  try {
    const { filename, data } = req.body;
    if (!filename || !data) return res.status(400).json({ error: 'Missing filename or data' });

    const ext = filename.slice(filename.lastIndexOf('.'));
    const name = filename.slice(0, filename.lastIndexOf('.'));
    const uniqueFilename = `${name}_${Date.now()}${ext}`;
    const base64Content = data.includes(',') ? data.split(',')[1] : data;

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/images/${uniqueFilename}`;
    const githubRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Upload image ${uniqueFilename}`,
        content: base64Content,
        branch: BRANCH
      })
    });

    if (!githubRes.ok) throw new Error(`GitHub upload error: ${githubRes.status}`);

    return res.status(200).json({ success: true, path: `/images/${uniqueFilename}` });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message });
  }
}
