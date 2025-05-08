
// components/PlayerList.jsx
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function PlayerList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Replace with actual fetch logic from Google Sheets backend
    setPlayers([
      { name: 'Player 1', team: 'Team A' },
      { name: 'Player 2', team: 'Team B' },
      { name: 'Player 3', team: 'Team C' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-bold text-center mb-4">Available Players</h1>
      <div className="space-y-2">
        {players.map((player, index) => (
          <Card key={index} className="p-4">
            <CardContent className="flex justify-between">
              <span>{player.name}</span>
              <span className="text-gray-500">{player.team}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}