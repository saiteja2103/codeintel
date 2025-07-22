import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/scrape?username=${username}`);
      const json = await res.json();

      if (res.ok) {
        setData(json);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Code Profile Scraper</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem' }}>Scrape</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div style={{ marginTop: '2rem' }}>
          <h2>{data.name}</h2>
          <p>{data.bio}</p>
          <ul>
            <li>Repositories: {data.repos}</li>
            <li>Followers: {data.followers}</li>
            <li>Following: {data.following}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
