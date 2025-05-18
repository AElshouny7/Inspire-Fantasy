// components/PlayerList.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

import { toast } from "sonner";

import { callBackend } from "@/lib/api";
import PlayerCard from "./PLayerCard";

export default function PlayerList() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlayers = location.state?.selectedPlayers || [];
  const transferIndex = location.state?.transferIndex ?? 0;
  const mode = location.state?.mode; // 'transfer' or 'add'
  const userId = localStorage.getItem("userId");

  const [allPlayers, setAllPlayers] = useState([]);
  const [filter, setFilter] = useState(location.state?.filter || "all"); // ✅ Correct

  useEffect(() => {
    async function fetchPlayers() {
      const res = await callBackend("viewAllPlayers");
      if (res.status === "success") {
        setAllPlayers(res.players);
        console.log("Fetched players:", res.players);
      } else {
        toast.error(res.message);
      }
    }

    // Automatically set filter based on index
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

    const outId = selectedPlayers[transferIndex]?.id;
    const inId = player.id;

    if (mode === "transfer") {
      toast.loading("Transferring player...", { duration: 100 });

      const response = await callBackend("transferPlayer", {
        userId,
        outId,
        inId,
      });

      if (response.status === "success") {
        const newPlayers = [...selectedPlayers];
        newPlayers[transferIndex] = player;

        toast.success(`Successfully transferred ${player.name} to your team!`);

        navigate("/home", { state: { updatedPlayers: newPlayers } });
      } else {
        toast.error(response.message);
      }
    } else {
      const isSub = transferIndex >= 5;
      const isGK = transferIndex === 4;

      toast.loading("Adding player...", { duration: 100 });

      const response = await callBackend("addPlayerToTeam", {
        userId,
        playerId: inId,
        isSub,
        isGK,
      });

      if (response.status === "success") {
        const newPlayers = [...selectedPlayers];
        newPlayers[transferIndex] = player;

        toast.success(`Successfully added ${player.name} to your team!`);

        navigate("/home", { state: { updatedPlayers: newPlayers } });
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Players</h2>

      <div
        className="grid grid-cols-3 gap-3"
        style={{ justifyItems: "center" }}
      >
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player} // ✅ missing before
            onClick={() => handleSelect(player)}
            isSelected={isPlayerSelected(player)}
            isCaptain={false}
            disabled={isPlayerSelected(player)}
          />
        ))}
      </div>
    </div>
  );
}
