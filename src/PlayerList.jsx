import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const allPlayers = [
  { name: 'Player 1', team: 'Team A' },
  { name: 'Player 2', team: 'Team B' },
  { name: 'Player 3', team: 'Team C' },
  { name: 'Player 4', team: 'Team D' },
  { name: 'Player 5', team: 'Team E' },
  { name: 'Player 6', team: 'Team F' },
  { name: 'Player 7', team: 'Team G' },
  { name: 'Player 8', team: 'Team H' },
];

export default function PlayerList() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlayers = location.state?.selectedPlayers || [];
  const transferIndex = location.state?.transferIndex;

  const isPlayerSelected = (player) =>
    selectedPlayers.some((p) => p?.name === player.name);

  const handleSelect = (player) => {
    if (isPlayerSelected(player)) return;

    const newPlayers = [...selectedPlayers];
    newPlayers[transferIndex] = player;

    navigate('/home', { state: { updatedPlayers: newPlayers } });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Players</h2>
      <div className="grid grid-cols-2 gap-2">
        {allPlayers.map((player, idx) => (
          <Card
            key={idx}
            className={`p-4 cursor-pointer ${
              isPlayerSelected(player)
                ? 'bg-gray-200 cursor-not-allowed'
                : 'hover:bg-blue-100'
            }`}
            onClick={() => handleSelect(player)}
          >
            <p className="font-semibold">{player.name}</p>
            <p className="text-sm text-gray-600">{player.team}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
