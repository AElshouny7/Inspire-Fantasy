// components/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PlayerCard from "@/components/PlayerCard";
import { callBackend } from "@/lib/api";
import pitch from "@/assets/pitch.jpg";

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
          ...outfieldMain.slice(0, 4),
          gkMain || null,
          ...subs.slice(0, 2),
        ];

        while (sortedPlayers.length < 7) sortedPlayers.push(null);
        setPlayers(sortedPlayers);

        setCaptainIndex(res.players.findIndex((p) => p.isCaptain));
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

  const isSub = (index) => index === 5 || index === 6;
  const isOutfield = (index) => index >= 0 && index <= 3;

  const handleCardClick = async (index) => {
    const selectedPlayer = players[index];
    if (!selectedPlayer) return;

    if (!mode) return;

    if (mode === "captain") {
      if (isSub(index)) return;
      const res = await callBackend("selectCaptain", {
        userId,
        captainId: selectedPlayer.id,
      });
      if (res.status === "success") {
        setCaptainIndex(index);
        toast.success("Captain updated!");
      } else {
        toast.error(res.message);
      }
      setMode(null);
    }

    else if (mode === "transfer") {
      if (isSub(index)) {
        setTransferIndex(index); // select sub first
      } else if (isOutfield(index)) {
        if (transferIndex === null) {
          // initiate transfer
          navigate("/players", {
            state: {
              selectedPlayers: players,
              transferIndex: index,
              filter: index === 4 ? "gk" : "outfield",
              mode: "transfer",
            },
          });
        } else if (isSub(transferIndex)) {
          // Swap sub and outfield player
          const updated = [...players];
          [updated[transferIndex], updated[index]] = [updated[index], updated[transferIndex]];
          setPlayers(updated);
          toast.success("Substitution successful");
          setTransferIndex(null);
        }
      }
    }
  };

  const toggleMode = (selectedMode) => {
    setMode((prev) => (prev === selectedMode ? null : selectedMode));
    setTransferIndex(null);
  };

  const isCardClickable = (index) => {
    if (mode === "captain") return !isSub(index);
    if (mode === "transfer") {
      if (transferIndex === null) return true;
      if (isSub(transferIndex)) return isOutfield(index);
    }
    return false;
  };

  const isHighlighted = (index) => {
    if (mode === "transfer" && isSub(transferIndex)) {
      return isOutfield(index);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex flex-col mb-4 text-sm">
        <div className="flex justify-between mb-1">
          <span>
            Total Points: {totalPoints} <br />
            Round Points: {roundPoints}
          </span>
          <span>Round: {roundName}</span>
          <span>Transfers Used: {transfersUsed}</span>
        </div>
        <div className="text-center font-semibold">
          Captain: <span className="text-yellow-400">{players[captainIndex]?.name || "None"}</span>
        </div>
      </header>

      <h1 className="text-center text-xl font-bold mb-4">
        {userName} - {teamName}
      </h1>

      {/* Pitch Background */}
      <div
        className="relative w-full max-w-2xl mx-auto p-4 rounded-xl space-y-4 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${pitch})` }}
      >
        <div className="grid grid-cols-2 gap-2" style={{ justifyItems: "center" }}>
          {[0, 1].map((i) => (
            <PlayerCard
              key={i}
              player={players[i]}
              onClick={() => handleCardClick(i)}
              isSelected={isHighlighted(i)}
              isCaptain={i === captainIndex}
              disabled={!isCardClickable(i)}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2" style={{ justifyItems: "center" }}>
          {[2, 3].map((i) => (
            <PlayerCard
              key={i}
              player={players[i]}
              onClick={() => handleCardClick(i)}
              isSelected={isHighlighted(i)}
              isCaptain={i === captainIndex}
              disabled={!isCardClickable(i)}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <PlayerCard
            player={players[4]}
            onClick={() => handleCardClick(4)}
            isSelected={isHighlighted(4)}
            isCaptain={4 === captainIndex}
            disabled={!isCardClickable(4)}
          />
        </div>
      </div>

      {/* Subs outside pitch */}
      <div className="mt-4">
        <p className="text-center font-semibold mb-2">Substitutes</p>
        <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto" style={{ justifyItems: "center" }}>
          {[5, 6].map((i) => (
            <PlayerCard
              key={i}
              player={players[i]}
              onClick={() => handleCardClick(i)}
              isSelected={i === transferIndex}
              isCaptain={i === captainIndex}
              disabled={mode !== "transfer"}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between gap-2 mt-6">
        <Button
          variant={mode === "captain" ? "default" : "outline"}
          onClick={() => toggleMode("captain")}
          className="bg-white text-black hover:bg-gray-200"
        >
          Select Captain
        </Button>
        <Button
          variant={mode === "transfer" ? "default" : "outline"}
          onClick={() => toggleMode("transfer")}
          className="bg-white text-black hover:bg-gray-200"
          >
          Transfer
        </Button>
        <Button onClick={() => navigate("/leaderboard")}>Leaderboard</Button>
      </div>
    </div>
  );
}




// // components/Home.jsx
// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import PlayerCard from "@/components/PlayerCard";
// import { callBackend } from "@/lib/api";
// import pitch from "@/assets/pitch.jpg";

// const initialPlayers = Array(7).fill(null);

// export default function Home() {
//   const [players, setPlayers] = useState(initialPlayers);
//   const [mode, setMode] = useState(null);
//   const [captainIndex, setCaptainIndex] = useState(null);
//   const [transferIndex, setTransferIndex] = useState(null);
//   const [totalPoints, setTotalPoints] = useState(0);
//   const [roundPoints, setRoundPoints] = useState(0);
//   const [transfersUsed, setTransfersUsed] = useState(0);
//   const [roundName, setRoundName] = useState("");

//   const teamName = localStorage.getItem("teamName") || "";
//   const userName = localStorage.getItem("name") || "";

//   const navigate = useNavigate();
//   const location = useLocation();
//   const userId = localStorage.getItem("userId")?.trim();

//   useEffect(() => {
//     async function fetchData() {
//       if (!userId) return;

//       const res = await callBackend("viewMyPlayers", { userId });
//       if (res.status === "success") {
//         toast.success("Fetched players successfully");

//         const gkMain = res.players.find((p) => p.isGK && !p.isSub);
//         const outfieldMain = res.players.filter((p) => !p.isGK && !p.isSub);
//         const subs = res.players.filter((p) => p.isSub);

//         const sortedPlayers = [
//           ...outfieldMain.slice(0, 4), // 0–3
//           gkMain || null,             // 4
//           ...subs.slice(0, 2),        // 5–6
//         ];

//         while (sortedPlayers.length < 7) sortedPlayers.push(null);
//         setPlayers(sortedPlayers);

//         setCaptainIndex(res.players.findIndex((p) => p.isCaptain));
//         setTotalPoints(res.totalPoints || 0);
//         setRoundPoints(res.roundPoints || 0);
//         setTransfersUsed(res.transfersUsed || 0);
//         setRoundName(res.round || "N/A");
//       } else {
//         toast.error(res.message);
//       }
//     }

//     fetchData();
//   }, [location.state?.updatedPlayers]);

//   const handleCardClick = async (index) => {
//     let filter = null;
//     if ([0, 1, 2, 3].includes(index)) filter = "outfield";
//     else if (index === 4) filter = "gk";
//     else filter = "all";

//     if (mode === "transfer") {
//       setTransferIndex(index);
//       navigate("/players", {
//         state: {
//           selectedPlayers: players,
//           transferIndex: index,
//           filter,
//           mode: "transfer",
//         },
//       });
//     } else if (mode === "captain") {
//       const selectedCaptain = players[index];
//       if (!selectedCaptain || !userId) return;

//       const res = await callBackend("selectCaptain", {
//         userId,
//         captainId: selectedCaptain.id,
//       });

//       if (res.status === "success") {
//         setCaptainIndex(index);
//         toast.success("Captain updated successfully!");
//       } else {
//         toast.error("Error updating captain: " + res.message);
//       }

//       setMode(null);
//     } else {
//       setTransferIndex(index);
//       navigate("/players", {
//         state: {
//           selectedPlayers: players,
//           transferIndex: index,
//           filter,
//           mode: "add",
//         },
//       });
//     }
//   };

//   const toggleMode = (selectedMode) => {
//     setMode(mode === selectedMode ? null : selectedMode);
//   };

//   const captainName = players[captainIndex]?.name || "None";

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <header className="flex flex-col mb-4 text-sm text-gray-700">
//         <div className="flex justify-between mb-1">
//           <span>
//             Total Points: {totalPoints} <br />
//             Round Points: {roundPoints}
//           </span>
//           <span>Round: {roundName}</span>
//           <span>Transfers Used: {transfersUsed}</span>
//         </div>
//         <div className="text-center font-semibold">
//           Captain: <span className="text-blue-700">{captainName}</span>
//         </div>
//       </header>

//       <h1 className="text-center text-xl font-bold mb-2">
//         {userName} - {teamName}
//       </h1>

//       {/* Player Cards on Pitch Background */}
//       <div
//         className="relative w-full max-w-2xl mx-auto p-4 rounded-xl space-y-4"
//         style={{
//           backgroundImage: `url(${pitch})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         {/* First row */}
//         <div className="grid grid-cols-2 gap-2">
//           {players.slice(0, 2).map((player, index) => (
//             <PlayerCard
//               key={index}
//               player={player}
//               onClick={() => handleCardClick(index)}
//               isSelected={mode !== null}
//               isCaptain={index === captainIndex}
//             />
//           ))}
//         </div>

//         {/* Second row */}
//         <div className="grid grid-cols-2 gap-2">
//           {players.slice(2, 4).map((player, index) => (
//             <PlayerCard
//               key={index + 2}
//               player={player}
//               onClick={() => handleCardClick(index + 2)}
//               isSelected={mode !== null}
//               isCaptain={index + 2 === captainIndex}
//             />
//           ))}
//         </div>

//         {/* Goalkeeper */}
//         <div className="flex justify-center">
//           <PlayerCard
//             player={players[4]}
//             onClick={() => handleCardClick(4)}
//             isSelected={mode !== null}
//             isCaptain={4 === captainIndex}
//           />
//         </div>

//         {/* Substitutes */}
//         <div>
//           <p className="text-white text-center font-semibold mb-1">Subs</p>
//           <div className="grid grid-cols-2 gap-2">
//             {players.slice(5, 7).map((player, index) => (
//               <PlayerCard
//                 key={index + 5}
//                 player={player}
//                 onClick={() => handleCardClick(index + 5)}
//                 isSelected={mode !== null}
//                 isCaptain={index + 5 === captainIndex}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex justify-between gap-2 mt-4">
//         <Button
//           variant={mode === "captain" ? "default" : "outline"}
//           onClick={() => toggleMode("captain")}
//         >
//           Select Captain
//         </Button>
//         <Button
//           variant={mode === "transfer" ? "default" : "outline"}
//           onClick={() => toggleMode("transfer")}
//         >
//           Transfer
//         </Button>
//         <Button onClick={() => navigate("/leaderboard")}>Leaderboard</Button>
//       </div>
//     </div>
//   );
// }