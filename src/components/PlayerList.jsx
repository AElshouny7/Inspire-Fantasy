import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { callBackend } from "@/lib/api";

export default function PlayerList() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlayers = location.state?.selectedPlayers || [];
  const transferIndex = location.state?.transferIndex;
  const userId = localStorage.getItem("userId");
  const mode = location.state?.mode; // 'transfer' or null

  const [filter, setFilter] = useState("all");
  const [allPlayers, setAllPlayers] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      const res = await callBackend("viewAllPlayers");
      if (res.status === "success") {
        setAllPlayers(res.players);
      }
    }
    fetchPlayers();
  }, []);

  const filteredPlayers = allPlayers.filter((p) => {
    if (filter === "gk") return p.isGK;
    if (filter === "outfield") return !p.isGK;
    return true;
  });

  const isPlayerSelected = (player) =>
    selectedPlayers.some((p) => p?.id === player.id);

  const handleSelect = async (player) => {
    if (isPlayerSelected(player)) return;

    const outId = selectedPlayers[transferIndex]?.id;
    const inId = player.id;

    // If in transfer mode
    if (mode === "transfer") {
      const response = await callBackend("transferPlayer", {
        userId,
        outId,
        inId,
      });

      if (response.status === "success") {
        const newPlayers = [...selectedPlayers];
        newPlayers[transferIndex] = player;
        navigate("/home", { state: { updatedPlayers: newPlayers } });
      } else {
        alert(response.message);
      }
      return;
    }

    // Otherwise, it's an add flow (initial team building)
    const newPlayers = [...selectedPlayers];

    // Decide where to add the new player
    if (transferIndex === 4) {
      // GK position
      await callBackend("addPlayerToTeam", {
        userId,
        playerId: inId,
        isSub: false,
        isGK: true,
      });
    } else if (transferIndex >= 5) {
      // Substitutes
      await callBackend("addPlayerToTeam", {
        userId,
        playerId: inId,
        isSub: true,
        isGK: false,
      });
    } else {
      // Outfield
      await callBackend("addPlayerToTeam", {
        userId,
        playerId: inId,
        isSub: false,
        isGK: false,
      });
    }

    newPlayers[transferIndex] = player;
    navigate("/home", { state: { updatedPlayers: newPlayers } });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Players</h2>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-1 rounded ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-1 rounded ${
            filter === "outfield" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("outfield")}
        >
          Outfield
        </button>
        <button
          className={`px-4 py-1 rounded ${
            filter === "gk" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("gk")}
        >
          Goalkeepers
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filteredPlayers.map((player) => (
          <Card
            key={player.id}
            className={`p-4 cursor-pointer ${
              isPlayerSelected(player)
                ? "bg-gray-200 cursor-not-allowed"
                : "hover:bg-blue-100"
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
