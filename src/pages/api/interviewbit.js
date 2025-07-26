import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  try {
    const url = `https://www.interviewbit.com/profile/${username}`;
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(html);
    console.log($);
    let totalScore = '';
    let coins = '';
    let streak = '';
    let problems = '';

    // Debug: log the first .profile-daily-goal_title and its parent
    const firstTitle = $('.profile-daily-goal_title').first();
    console.log('First Title:', firstTitle.text());
    console.log('Parent HTML:', firstTitle.parent().html());

    $('.profile-daily-goal_title').each((i, el) => {
      const title = $(el).text().trim();
      const value = $(el).parent().find('.profile-daily-goal_details').text().trim();
      if (title === 'Total Score') totalScore = value;
      if (title === 'Coins') coins = value;
      if (title === 'Streak') streak = value;
      if (title === 'Problems') problems = value;
    });

    res.status(200).json({
      totalScore,
      coins,
      streak,
      problems,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch InterviewBit data' });
  }
}
