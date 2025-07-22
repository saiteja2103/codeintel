import axios from 'axios';
import * as cheerio from 'cheerio';
import { use } from 'react';

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  try {
    // Example: GitHub scraping (can be replaced with LeetCode, HackerRank, etc.)
    const response = await axios.get(`https://www.codechef.com/users/${username}`);
    const $ = cheerio.load(response.data);

    const rating = $('.rating-number').text().trim();
    // const bio = $('div.p-note').text().trim();
    // const repos = $('a[href$="?tab=repositories"] span.Counter').text().trim();
    // const followers = $('a[href$="?tab=followers"] span.Counter').text().trim();
    // const following = $('a[href$="?tab=following"] span.Counter').text().trim();

    res.status(200).json({ rating });
  } catch (error) {
    res.status(500).json({ error: 'User not found or scraping failed' });
  }
}