import axios from 'axios';

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        query,
        variables: { username },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const userData = response.data.data.matchedUser;

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = userData.submitStatsGlobal.acSubmissionNum;

    res.status(200).json({
      username: userData.username,
      totalSolved: stats[0].count,
      easySolved: stats[1].count,
      mediumSolved: stats[2].count,
      hardSolved: stats[3].count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from LeetCode' });
  }
}
