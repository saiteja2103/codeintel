import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeTrackScore(username, track) {
  const url = `https://www.hackerrank.com/leaderboard?filter=${username}&filter_on=hacker&page=1&track=${track}&type=practice`;

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(html);
    const rows = $('.ui-table .table-row-wrapper');

    for (let i = 0; i < rows.length; i++) {
      const row = $(rows[i]);
      const hacker = row.find('.table-row-column.ellipsis.hacker').text().trim();
      const rank = row.find('.table-row-column.ellipsis.rank span').attr('data-balloon')?.trim();
      const score = row.find('.table-row-column.ellipsis.score').text().trim();
      if (hacker.toLowerCase() === username.toLowerCase()) {
        return { username: hacker, rank, score };
      }
    }
    return null;
  } catch (err) {
    throw new Error('Failed to fetch or parse leaderboard');
  }
}

export default async function handler(req, res) {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }
  try {
    const [algorithmsData, dataStructuresData] = await Promise.all([
      scrapeTrackScore(username, 'algorithms'),
      scrapeTrackScore(username, 'data-structures')
    ]);
    if (!algorithmsData && !dataStructuresData) {
      return res.status(404).json({ error: 'User not found on both tracks' });
    }
    return res.json({
      username,
      algorithm_score: algorithmsData?.score || 'N/A',
      algorithm_rank: algorithmsData?.rank || 'N/A',
      data_structures_score: dataStructuresData?.score || 'N/A',
      data_structures_rank: dataStructuresData?.rank || 'N/A'
    });
  } catch (err) {
    console.error('Scraping error:', err.message);
    return res.status(500).json({ error: 'Scraping failed', message: err.message });
  }
}
