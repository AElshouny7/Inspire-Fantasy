// components/PlayerList.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

import { toast } from "sonner";

import { callBackend } from "@/lib/api";

export default function PlayerList() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlayers = location.state?.selectedPlayers || [];
  const transferIndex = location.state?.transferIndex;
  const mode = location.state?.mode; // 'transfer' or 'add'
  const userId = localStorage.getItem("userId");

  const [allPlayers, setAllPlayers] = useState([]);
  const [filter, setFilter] = useState("all"); // "all", "gk", "outfield"

  useEffect(() => {
    async function fetchPlayers() {
      const res = await callBackend("viewAllPlayers");
      if (res.status === "success") {
        console.log(res.players);
        setAllPlayers(res.players);
      } else {
        toast.error(res.message);
      }
    }

    fetchPlayers();
  }, []);

  const filteredPlayers = allPlayers.filter((player) => {
    if (filter === "gk") return player.position === "GK";
    if (filter === "outfield") return player.position !== "GK";
    return true;
  });

  const isPlayerSelected = (player) =>
    selectedPlayers.some((p) => p?.id === player.id);

  const handleSelect = async (player) => {
    if (!userId || isPlayerSelected(player)) return;

    const outId = selectedPlayers[transferIndex]?.id;
    const inId = player.id;

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
        toast.error(response.message);
      }
    } else {
      // Add mode: use position to determine GK/Sub/Outfield
      const isSub = transferIndex >= 5;
      const isGK = transferIndex === 4;

      const response = await callBackend("addPlayerToTeam", {
        userId,
        playerId: inId,
        isSub,
        isGK,
      });

      if (response.status === "success") {
        const newPlayers = [...selectedPlayers];
        newPlayers[transferIndex] = player;
        navigate("/home", { state: { updatedPlayers: newPlayers } });
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Players</h2>

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
