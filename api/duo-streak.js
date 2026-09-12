// Vercel Serverless Function — /api/duo-streak
// Acts as a server-side proxy for the Duolingo API to bypass CORS restrictions.
// Deployed automatically by Vercel when the file exists in /api directory.

export default async function handler(req, res) {
  // Allow cross-origin requests from the frontend
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const username = req.query?.username || 'aswin.rar'
  const duoUrl = `https://www.duolingo.com/2017-06-30/users?username=${encodeURIComponent(username)}&fields=streak,learningLanguage,name,totalXp`

  try {
    const response = await fetch(duoUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
      // 8-second timeout
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'Duolingo API returned non-OK status', status: response.status })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (err) {
    return res.status(502).json({ error: 'Failed to fetch from Duolingo', detail: err?.message })
  }
}
