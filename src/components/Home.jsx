// components/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { callBackend } from "@/lib/api";

const initialPlayers = Array(7).fill(null);

export default function Home() {
  const [players, setPlayers] = useState(initialPlayers);
  const [mode, setMode] = useState(null); // null, 'transfer', 'captain'
  const [captainIndex, setCaptainIndex] = useState(null);
  const [transferIndex, setTransferIndex] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [roundPoints, setRoundPoints] = useState(0);
  const [roundName, setRoundName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    async function fetchPlayers() {
      const res = await callBackend("viewMyPlayers", { userId });
      if (res.status === "success") {
        setPlayers(res.players);
        const captainIdx = res.players.findIndex((p) => p.isCaptain);
        setCaptainIndex(captainIdx);
        setRoundName(res.round);
        setTotalPoints(res.totalPoints);
        setRoundPoints(res.roundPoints);
        setTeamName(res.teamName);
        setUserName(res.name);
      }
    }

    fetchPlayers();
  }, []);

  const handleCardClick = async (index) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    if (mode === "transfer") {
      setTransferIndex(index);
      navigate("/players", {
        state: {
          selectedPlayers: players,
          transferIndex: index,
          mode: "transfer",
        },
      });
    } else if (mode === "captain") {
      setCaptainIndex(index);
      setMode(null);
      await callBackend("selectCaptain", {
        userId,
        captainId: players[index].id,
      });
    } else {
      setTransferIndex(index);
      navigate("/players", {
        state: {
          selectedPlayers: players,
          transferIndex: index,
          mode: null, // explicitly set null
        },
      });
    }
  };

  const toggleMode = (selectedMode) => {
    setMode(mode === selectedMode ? null : selectedMode);
  };

  const captainName = players[captainIndex]?.name || "None";

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex flex-col mb-4 text-sm text-gray-700">
        <div className="flex justify-between mb-1">
          <span>Total Points: {totalPoints}</span>
          <span>Round Points: {roundPoints}</span>
          <span>Round: {roundName}</span>
        </div>
        <div className="text-center font-semibold">
          Captain: <span className="text-blue-700">{captainName}</span>
        </div>
      </header>

      <h1 className="text-center text-xl font-bold mb-2">
        {userName} – {teamName}
      </h1>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {players.map((player, index) => (
          <Card
            key={index}
            className={`h-24 flex items-center justify-center cursor-pointer border-2 ${
              mode === "captain" || mode === "transfer"
                ? "border-blue-400"
                : "border-dashed border-gray-300"
            } ${index === captainIndex ? "bg-yellow-100" : ""}`}
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
        <Button>Next</Button>
      </div>
    </div>
  );
}
