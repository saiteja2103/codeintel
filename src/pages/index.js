import { useState } from 'react';

export default function Home() {
  const [Leetcodeusername, setLeetcodeUsername] = useState('');
  const [Codechefusername, setCodechefUsername] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setData(null);

  try {
    const [leetRes, chefRes] = await Promise.all([
      fetch(`/api/leetcode?username=${Leetcodeusername}`),
      fetch(`/api/codechef?username=${Codechefusername}`)
    ]);

    const [leetData, chefData] = await Promise.all([
      leetRes.json(),
      chefRes.json()
    ]);

    if (!leetRes.ok) {
      setError(leetData.error || 'Error fetching LeetCode data');
      return;
    }

    if (!chefRes.ok) {
      setError(chefData.error || 'Error fetching CodeChef data');
      return;
    }

    setData({
      leetcode: leetData,
      codechef: chefData
    });
  } catch (err) {
    console.error(err);
    setError('Something went wrong');
  }
};

  return (
    <div style={{ padding: '2rem' }}>
      <h1>LeetCode Profile Scraper</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter LeetCode username"
          value={Leetcodeusername}
          onChange={(e) => setLeetcodeUsername(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        /><br></br>
        <input
          type="text"
          placeholder="Enter CodeChef username"   
          value={Codechefusername}
          onChange={(e) => setCodechefUsername(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        /><br></br>
        <button type="submit" style={{ padding: '0.5rem' }}>Get Details</button>
      </form> 

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div style={{ marginTop: '2rem' }}>
            <div>
              <h2>LeetCode</h2>
              <h2>{Leetcodeusername}</h2>
              <ul>
                <li>Total Solved: {data.leetcode.totalSolved}</li>
                <li>Easy Solved: {data.leetcode.easySolved}</li>
                <li>Medium Solved: {data.leetcode.mediumSolved}</li>
                <li>Hard Solved: {data.leetcode.hardSolved}</li>
              </ul> 
            </div>
            <div>
              <h2>Codechef</h2>
              <h2>{Codechefusername}</h2>
              <ul>
              <li>Contest Rating: {data.codechef.rating}</li>
              </ul>
            </div>
        </div>

      )}
    </div>
  );
}
