import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const leaderboardData = [
  { username: 'Zain', total: 201, rounds: [71, 65, 65] },
  { username: 'Shouny', total: 189, rounds: [70, 60, 59] },
  { username: 'Gasser', total: 142, rounds: [40, 50, 52] },
];

export default function Leaderboard() {
  const navigate = useNavigate();

  const sorted = [...leaderboardData].sort((a, b) => b.total - a.total);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <Card className="p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="p-2">Username</th>
              <th className="p-2">Total Points</th>
              <th className="p-2">Round 1</th>
              <th className="p-2">Round 2</th>
              <th className="p-2">Round 3</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((user, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="p-2">{user.username}</td>
                <td className="p-2 font-bold">{user.total}</td>
                <td className="p-2">{user.rounds[0]}</td>
                <td className="p-2">{user.rounds[1]}</td>
                <td className="p-2">{user.rounds[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Button onClick={() => navigate('/home')}>Back to Home</Button>
    </div>
  );
}
