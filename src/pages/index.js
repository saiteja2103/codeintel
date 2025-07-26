import { useState } from 'react';

export default function Home() {
  const [Leetcodeusername, setLeetcodeUsername] = useState('');
  const [Codechefusername, setCodechefUsername] = useState('');
  const [Hackerrankusername, setHackerrankUsername] = useState('');
  const [Interviewbitusername, setInterviewbitUsername] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setData(null);

  if (!Leetcodeusername || !Codechefusername || !Hackerrankusername || !Interviewbitusername) {
    setError('Please enter all usernames.');
    return;
  }

  try {
    const [leetRes, chefRes, hackRes, interviewRes] = await Promise.all([
      fetch(`/api/leetcode?username=${Leetcodeusername}`),
      fetch(`/api/codechef?username=${Codechefusername}`),
      fetch(`/api/hackerrank?username=${Hackerrankusername}`),
      fetch(`/api/interviewbit?username=${Interviewbitusername}`)
    ]);

    const [leetData, chefData, hackData, interviewData] = await Promise.all([
      leetRes.json(),
      chefRes.json(),
      hackRes.json(),
      interviewRes.json()
    ]);
    console.log(leetData, chefData, hackData, interviewData);
    if (!leetRes.ok) {
      setError(leetData.error || 'Error fetching LeetCode data');
      return;
    }
    if (!chefRes.ok) {
      setError(chefData.error || 'Error fetching CodeChef data');
      return;
    }
    if (!hackRes.ok) {
      setError(hackData.error || 'Error fetching HackerRank data');
      return;
    }
    if (!interviewRes.ok) {
      setError(interviewData.error || 'Error fetching InterviewBit data');
      return;
    }

    setData({
      leetcode: leetData,
      codechef: chefData,
      hackerrank: hackData,
      interviewbit: interviewData
    });
  } catch (err) {
    console.error(err);
    setError('Something went wrong');
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Coding Profile Intel</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="leetcode-username" className="block text-gray-700 font-semibold mb-2">LeetCode Username</label>
          <input
            id="leetcode-username"
            type="text"
            placeholder="Enter LeetCode username"
            value={Leetcodeusername}
            onChange={(e) => setLeetcodeUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="codechef-username" className="block text-gray-700 font-semibold mb-2">CodeChef Username</label>
          <input
            id="codechef-username"
            type="text"
            placeholder="Enter CodeChef username"
            value={Codechefusername}
            onChange={(e) => setCodechefUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="hackerrank-username" className="block text-gray-700 font-semibold mb-2">HackerRank Username</label>
          <input
            id="hackerrank-username"
            type="text"
            placeholder="Enter HackerRank username"
            value={Hackerrankusername}
            onChange={(e) => setHackerrankUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 bg-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="interviewbit-username" className="block text-gray-700 font-semibold mb-2">InterviewBit Username</label>
          <input
            id="interviewbit-username"
            type="text"
            placeholder="Enter InterviewBit username"
            value={Interviewbitusername}
            onChange={(e) => setInterviewbitUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 bg-white"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Get Details</button>
      </form>

      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

      {data && (
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 mt-6 text-gray-900">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">LeetCode</h2>
            <h3 className="text-lg text-gray-600 mb-2">{Leetcodeusername}</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Total Solved: <span className="font-medium">{data.leetcode.totalSolved}</span></li>
              <li>Easy Solved: <span className="font-medium">{data.leetcode.easySolved}</span></li>
              <li>Medium Solved: <span className="font-medium">{data.leetcode.mediumSolved}</span></li>
              <li>Hard Solved: <span className="font-medium">{data.leetcode.hardSolved}</span></li>
            </ul>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">CodeChef</h2>
            <h3 className="text-lg text-gray-600 mb-2">{Codechefusername}</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Contest Rating: <span className="font-medium">{data.codechef.rating}</span></li>
            </ul>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">HackerRank</h2>
            <h3 className="text-lg text-gray-600 mb-2">{Hackerrankusername}</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Algorithm Score: <span className="font-medium">{data.hackerrank.algorithm_score}</span></li>
              <li>Algorithm Rank: <span className="font-medium">{data.hackerrank.algorithm_rank}</span></li>
              <li>Data Structures Score: <span className="font-medium">{data.hackerrank.data_structures_score}</span></li>
              <li>Data Structures Rank: <span className="font-medium">{data.hackerrank.data_structures_rank}</span></li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">InterviewBit</h2>
            <h3 className="text-lg text-gray-600 mb-2">{Interviewbitusername}</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Total Score: <span className="font-medium">{data.interviewbit.totalScore}</span></li>
              <li>Coins: <span className="font-medium">{data.interviewbit.coins}</span></li>
              <li>Streak: <span className="font-medium">{data.interviewbit.streak}</span></li>
              <li>Problems: <span className="font-medium">{data.interviewbit.problems}</span></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
