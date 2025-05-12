// components/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      const res = await callBackend("viewMyPlayers", { userId });
      if (res.status === "success") {
        setPlayers(res.players);
        setCaptainIndex(res.players.findIndex((p) => p.isCaptain));
        setTotalPoints(res.totalPoints || 0);
        setRoundPoints(res.roundPoints || 0);
        setRoundName(res.round || "N/A");
        setTeamName(res.teamName || "");
        setUserName(res.name || "");
      }
    }

    fetchData();
  }, [location.state?.updatedPlayers]);

  const handleCardClick = (index) => {
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
        state: { selectedPlayers: players, transferIndex: index, filter },
      });
    } else if (mode === "captain") {
      setCaptainIndex(index);
      setMode(null);
    } else {
      setTransferIndex(index);
      navigate("/players", {
        state: { selectedPlayers: players, transferIndex: index, filter },
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
          <span>
            Total Points: {totalPoints} <br />
            Round Points: {roundPoints}
          </span>
          <span>Round: {roundName}</span> <br />
          <span>Transfer: 0 </span>
        </div>
        <div className="text-center font-semibold">
          Captain: <span className="text-blue-700">{captainName}</span>
        </div>
      </header>

      <h1 className="text-center text-xl font-bold mb-2">
        {userName} – {teamName}
      </h1>

      <div className="mb-4 space-y-4">
        {/* First row */}
        <div className="grid grid-cols-2 gap-2">
          {players.slice(0, 2).map((player, index) => (
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
                <span>
                  {player.name} <br /> {player.team} <br /> {player.roundPoints}{" "}
                </span>
              ) : (
                <span className="text-2xl text-gray-400">+</span>
              )}
            </Card>
          ))}
        </div>

        {/* Second row */}
        <div className="grid grid-cols-2 gap-2">
          {players.slice(2, 4).map((player, index) => {
            const actualIndex = index + 2;
            return (
              <Card
                key={actualIndex}
                className={`h-24 flex items-center justify-center cursor-pointer border-2 ${
                  mode === "captain" || mode === "transfer"
                    ? "border-blue-400"
                    : "border-dashed border-gray-300"
                } ${actualIndex === captainIndex ? "bg-yellow-100" : ""}`}
                onClick={() => handleCardClick(actualIndex)}
              >
                {player ? (
                  <span>
                    {player.name} <br /> {player.team} <br />{" "}
                    {player.roundPoints}{" "}
                  </span>
                ) : (
                  <span className="text-2xl text-gray-400">+</span>
                )}
              </Card>
            );
          })}
        </div>

        {/* Centered 5th card */}
        <div className="flex justify-center">
          {players[4] && (
            <Card
              className={`h-24 w-1/2 flex items-center justify-center cursor-pointer border-2 ${
                mode === "captain" || mode === "transfer"
                  ? "border-blue-400"
                  : "border-dashed border-gray-300"
              } ${4 === captainIndex ? "bg-yellow-100" : ""}`}
              onClick={() => handleCardClick(4)}
            >
              <span>
                {player[4].name} <br /> {player[4].team} <br />{" "}
                {player[4].roundPoints}{" "}
              </span>
            </Card>
          )}
          {!players[4] && (
            <Card
              className={`h-24 w-1/2 flex items-center justify-center cursor-pointer border-2 ${
                mode === "captain" || mode === "transfer"
                  ? "border-blue-400"
                  : "border-dashed border-gray-300"
              } ${4 === captainIndex ? "bg-yellow-100" : ""}`}
              onClick={() => handleCardClick(4)}
            >
              <span className="text-2xl text-gray-400">+</span>
            </Card>
          )}
        </div>

        {/* Subs section */}
        <div>
          <p className="font-semibold mb-2">Subs:</p>
          <div className="grid grid-cols-2 gap-2">
            {players.slice(5, 7).map((player, index) => {
              const actualIndex = index + 5;
              return (
                <Card
                  key={actualIndex}
                  className={`h-24 flex items-center justify-center cursor-pointer border-2 ${
                    mode === "captain" || mode === "transfer"
                      ? "border-blue-400"
                      : "border-dashed border-gray-300"
                  } ${actualIndex === captainIndex ? "bg-yellow-100" : ""}`}
                  onClick={() => handleCardClick(actualIndex)}
                >
                  {player ? (
                    <span>
                      {player.name} <br /> {player.team} <br />{" "}
                      {player.roundPoints}{" "}
                    </span>
                  ) : (
                    <span className="text-2xl text-gray-400">+</span>
                  )}
                </Card>
              );
            })}
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
