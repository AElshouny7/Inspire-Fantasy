// components/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const initialPlayers = Array(7).fill(null);

export default function Home() {
  const [players, setPlayers] = useState(initialPlayers);
  const [mode, setMode] = useState(null); // null, 'transfer', 'captain'
  const [captainIndex, setCaptainIndex] = useState(null);
  const [transferIndex, setTransferIndex] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.updatedPlayers) {
      setPlayers(location.state.updatedPlayers);
    }
  }, [location.state]);

  const handleCardClick = (index) => {
    if (mode === 'transfer') {
      setTransferIndex(index);
      navigate('/players', { state: { selectedPlayers: players, transferIndex: index } });
    } else if (mode === 'captain') {
      setCaptainIndex(index);
      setMode(null);
    } else {
      setTransferIndex(index);
      navigate('/players', { state: { selectedPlayers: players, transferIndex: index } });
    }
  };

  const toggleMode = (selectedMode) => {
    setMode(mode === selectedMode ? null : selectedMode);
  };

  const captainName = players[captainIndex]?.name || 'None';

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex flex-col mb-4 text-sm text-gray-700">
        <div className="flex justify-between mb-1">
          <span>Total Points: 0</span>
          <span>Round Points: 0</span>
          <span>Round: 1</span>
        </div>
        <div className="text-center font-semibold">
          Captain: <span className="text-blue-700">{captainName}</span>
        </div>
      </header>

      <h1 className="text-center text-xl font-bold mb-2">User Name - Team Name</h1>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {players.map((player, index) => (
          <Card
            key={index}
            className={`h-24 flex items-center justify-center cursor-pointer border-2 ${
              mode === 'captain' || mode === 'transfer' ? 'border-blue-400' : 'border-dashed border-gray-300'
            } ${index === captainIndex ? 'bg-yellow-100' : ''}`}
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

      <div className="flex justify-between gap-2">
        <Button variant={mode === 'captain' ? 'default' : 'outline'} onClick={() => toggleMode('captain')}>
          Select Captain
        </Button>
        <Button variant={mode === 'transfer' ? 'default' : 'outline'} onClick={() => toggleMode('transfer')}>
          Transfer
        </Button>
        <Button>Next</Button>
      </div>
    </div>
  );
}
