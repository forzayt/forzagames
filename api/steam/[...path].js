export default async function handler(req, res) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path;
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  const searchParams = url.searchParams;
  searchParams.delete('path'); 
  
  const targetUrl = `https://store.steampowered.com/${pathString}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).send(text);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from Steam', details: error.message });
  }
}
