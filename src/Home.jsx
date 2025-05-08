
// components/Home.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const initialPlayers = Array(7).fill(null);

export default function Home() {
  const [players, setPlayers] = useState(initialPlayers);

  const handleCardClick = (index) => {
    // logic to select a player (e.g., open modal or redirect)
    console.log(`Add player to position ${index}`);
  };

    // fetched from Google Sheets backend
  return (
    <div className="min-h-screen bg-gray-100 p-4"> 
      <header className="flex justify-between items-center mb-4 text-sm text-gray-700">
        <span>Total Points: 0</span> 
        <span>Round Points: 0</span>
        <span>Round: Quarter</span>
      </header>
      <h1 className="text-center text-xl font-bold mb-2">User Name - Team Name</h1>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {players.map((player, index) => (
          <Card
            key={index}
            className="h-24 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300"
            onClick={() => handleCardClick(index)}
          >
            {player ? (
              <span>{player.name}</span>
            ) : (
              <span className="text-2xl text-gray-400">+</span>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline">Select Captain</Button>
        <Button>Next</Button>
      </div>
    </div>
  );
}