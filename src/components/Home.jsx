// components/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PlayerCard from "@/components/PlayerCard";
import { callBackend } from "@/lib/api";

const initialPlayers = Array(7).fill(null);

export default function Home() {
  const [players, setPlayers] = useState(initialPlayers);
  const [mode, setMode] = useState(null); // null, 'transfer', 'captain'
  const [captainIndex, setCaptainIndex] = useState(null);
  const [transferIndex, setTransferIndex] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [roundPoints, setRoundPoints] = useState(0);
  const [transfersUsed, setTransfersUsed] = useState(0);
  const [roundName, setRoundName] = useState("");

  const teamName = localStorage.getItem("teamName") || "";
  const userName = localStorage.getItem("name") || "";
  const userId = localStorage.getItem("userId")?.trim();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      const res = await callBackend("viewMyPlayers", { userId });
      if (res.status === "success") {
        toast.success("Fetched players successfully");

        const gkMain = res.players.find((p) => p.isGK && !p.isSub);
        const outfieldMain = res.players.filter((p) => !p.isGK && !p.isSub);
        const subs = res.players.filter((p) => p.isSub);

        const sortedPlayers = [
          ...outfieldMain.slice(0, 4), // 0–3 outfield
          gkMain || null,             // 4 GK
          ...subs.slice(0, 2),        // 5–6 subs
        ];

        while (sortedPlayers.length < 7) sortedPlayers.push(null);
        setPlayers(sortedPlayers);

        const captain = res.players.find((p) => p.isCaptain);
        setCaptainIndex(captain ? sortedPlayers.findIndex(p => p?.id === captain.id) : null);
        setTotalPoints(res.totalPoints || 0);
        setRoundPoints(res.roundPoints || 0);
        setTransfersUsed(res.transfersUsed || 0);
        setRoundName(res.round || "N/A");
      } else {
        toast.error(res.message);
      }
    }

    fetchData();
  }, [location.state?.updatedPlayers]);

  const handleCardClick = async (index) => {
    let filter = null;
    if ([0, 1, 2, 3].includes(index)) {
      filter = "outfield";
    } else if (index === 4) {
      filter = "gk";
    } else {
      filter = "all";
    }

    if (mode === "transfer") {
      setTransferIndex(index);
      navigate("/players", {
        state: {
          selectedPlayers: players,
          transferIndex: index,
          filter,
          mode: "transfer",
        },
      });
    } else if (mode === "captain") {
      const selectedCaptain = players[index];
      if (!selectedCaptain || !userId) return;

      const res = await callBackend("selectCaptain", {
        userId,
        captainId: selectedCaptain.id,
      });

      if (res.status === "success") {
        setCaptainIndex(index);
        toast.success("Captain updated successfully!");
      } else {
        toast.error("Error updating captain: " + res.message);
      }

      setMode(null);
    } else {
      setTransferIndex(index);
      navigate("/players", {
        state: {
          selectedPlayers: players,
          transferIndex: index,
          filter,
          mode: "add",
        },
      });
    }
  };

  const toggleMode = (selectedMode) => {
    setMode(mode === selectedMode ? null : selectedMode);
  };

  const captainName = players[captainIndex]?.name || "None";

  const renderPlayerCard = (player, index) => (
    <PlayerCard
      key={index}
      player={player}
      isCaptain={index === captainIndex}
      onClick={() => handleCardClick(index)}
      mode={mode}
    />
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex flex-col mb-4 text-sm text-gray-700">
        <div className="flex justify-between mb-1">
          <span>
            Total Points: {totalPoints} <br />
            Round Points: {roundPoints}
          </span>
          <span>Round: {roundName}</span>
          <span>Transfers Used: {transfersUsed}</span>
        </div>
        <div className="text-center font-semibold">
          Captain: <span className="text-blue-700">{captainName}</span>
        </div>
      </header>

      <h1 className="text-center text-xl font-bold mb-2">
        {userName} - {teamName}
      </h1>

      <div className="mb-4 space-y-4">
        {/* First row */}
        <div className="grid grid-cols-2 gap-2">
          {players.slice(0, 2).map((player, index) => renderPlayerCard(player, index))}
        </div>

        {/* Second row */}
        <div className="grid grid-cols-2 gap-2">
          {players.slice(2, 4).map((player, index) => renderPlayerCard(player, index + 2))}
        </div>

        {/* Centered GK card */}
        <div className="flex justify-center">
          {renderPlayerCard(players[4], 4)}
        </div>

        {/* Subs */}
        <div>
          <p className="font-semibold mb-2">Subs:</p>
          <div className="grid grid-cols-2 gap-2">
            {players.slice(5, 7).map((player, index) => renderPlayerCard(player, index + 5))}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <Button
          variant={mode === "captain" ? "default" : "outline"}
          onClick={() => toggleMode("captain")}
        >
          Select Captain
        </Button>
        <Button
          variant={mode === "transfer" ? "default" : "outline"}
          onClick={() => toggleMode("transfer")}
        >
          Transfer
        </Button>
        <Button onClick={() => navigate("/leaderboard")}>Leaderboard</Button>
      </div>
    </div>
  );
}
