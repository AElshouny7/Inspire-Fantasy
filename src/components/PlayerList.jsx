// components/PlayerList.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PlayerCard from "@/components/PlayerCard";
import { callBackend } from "@/lib/api";
import inspireMan from "@/assets/inspire man.png"; // for loading image

export default function PlayerList() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlayers = location.state?.selectedPlayers || [];
  const transferIndex = location.state?.transferIndex ?? 0;
  const mode = location.state?.mode; // 'transfer' or null (add)
  const userId = localStorage.getItem("userId");

  const [allPlayers, setAllPlayers] = useState([]);
  const [filter, setFilter] = useState(location.state?.filter || "all");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // for clicking cards

  useEffect(() => {
    async function fetchPlayers() {
      setIsLoading(true);
      const res = await callBackend("viewAllPlayers");
      if (res.status === "success") {
        setAllPlayers(res.players);
        console.log("Fetched players:", res.players);
      } else {
        toast.error(res.message);
      }
      setIsLoading(false);
    }

    if (transferIndex <= 3) setFilter("outfield");
    else if (transferIndex === 4) setFilter("gk");
    else setFilter("all");

    fetchPlayers();
  }, []);

  const filteredPlayers = allPlayers
    .filter((player) => {
      if (filter === "gk") return player.isGK === true;
      if (filter === "outfield") return player.isGK === false;
      return true;
    })
    .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

  const isPlayerSelected = (player) =>
    selectedPlayers.some((p) => p?.id === player.id);

  const handleSelect = async (player) => {
    if (!userId || isPlayerSelected(player)) return;

    setActionLoading(true);
    const outId = selectedPlayers[transferIndex]?.id;
    const inId = player.id;

    if (mode === "transfer") {
      const transferLoad = toast.loading("Transferring player...");

      const response = await callBackend("transferPlayer", {
        userId,
        outId,
        inId,
      });

      if (response.status === "success") {
        const newPlayers = [...selectedPlayers];
        newPlayers[transferIndex] = player;

        toast.dismiss(transferLoad);
        toast.success(`Transferred ${player.name} to your team!`);

        navigate("/home", { state: { updatedPlayers: newPlayers } });
      } else {
        toast.dismiss(transferLoad);
        toast.error(response.message);
      }
    } else {
      const isSub = transferIndex >= 5;
      const isGK = transferIndex === 4;

      const addLoad = toast.loading("Adding player...");

      const response = await callBackend("addPlayerToTeam", {
        userId,
        playerId: inId,
        isSub,
        isGK,
      });

      if (response.status === "success") {
        const newPlayers = [...selectedPlayers];
        newPlayers[transferIndex] = player;

        toast.dismiss(addLoad);
        toast.success(`Added ${player.name} to your team!`);

        navigate("/home", { state: { updatedPlayers: newPlayers } });
      } else {
        toast.dismiss(addLoad);
        toast.error(response.message);
      }
    }

    setActionLoading(false);
  };

  return (
    <div className="relative p-4 min-h-screen bg-black text-white">
      <h2 className="text-xl font-bold mb-4">All Players</h2>

      <div className="grid grid-cols-3 gap-3 justify-items-center">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onClick={() => handleSelect(player)}
            isSelected={isPlayerSelected(player)}
            isCaptain={false}
            disabled={isPlayerSelected(player)}
          />
        ))}
      </div>

      {(isLoading || actionLoading) && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
          <img
            src={inspireMan}
            alt="Loading"
            className="w-50 h-50 mb-4 animate-bounce"
          />
          <p className="text-yellow-400 text-lg font-semibold animate-pulse">
            Loading...
          </p>
        </div>
      )}
    </div>
  );
}
