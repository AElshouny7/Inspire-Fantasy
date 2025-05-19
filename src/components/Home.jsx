// components/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PlayerCard from "@/components/PlayerCard";
import { callBackend } from "@/lib/api";
import pitch from "@/assets/pitch.jpg";
import bench from "@/assets/bench.png";
import inspireman from "@/assets/inspire man.png";

const initialPlayers = Array(7).fill(null);

export default function Home() {
  const [players, setPlayers] = useState(initialPlayers);
  const [mode, setMode] = useState(null);
  const [captainIndex, setCaptainIndex] = useState(null);
  const [transferIndex, setTransferIndex] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [roundPoints, setRoundPoints] = useState(0);
  const [transfersUsed, setTransfersUsed] = useState(0);
  const [roundName, setRoundName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  const teamName = localStorage.getItem("teamName") || "";
  const userName = localStorage.getItem("name") || "";
  const userId = localStorage.getItem("userId")?.trim();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      setLoading(true);
      const res = await callBackend("viewMyPlayers", { userId });
      if (res.status === "success") {
        const { sorted, captainIndex } = sortPlayers(res.players);
        setPlayers(sorted);
        setCaptainIndex(captainIndex);

        setTotalPoints(res.totalPoints || 0);
        setRoundPoints(res.roundPoints || 0);
        setTransfersUsed(res.transfersUsed || 0);
        setRoundName(res.round || "N/A");
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    }

    fetchData();
  }, [location.state?.updatedPlayers]);

  function sortPlayers(players) {
    const safe = players.filter((p) => p && typeof p === "object");
    const sorted = Array(7).fill(null);

    const outfieldMain = safe.filter((p) => !p.isGK && !p.isSub);
    const gkMain = safe.find((p) => p.isGK && !p.isSub);
    const subs = safe.filter((p) => p.isSub);

    outfieldMain.forEach((p, i) => {
      if (i < 4) sorted[i] = p;
    });
    sorted[4] = gkMain || null;
    subs.forEach((p, i) => {
      if (i < 2) sorted[5 + i] = p;
    });

    const captainId = safe.find((p) => p.isCaptain)?.id;
    const captainIndex = sorted.findIndex((p) => p?.id === captainId);

    return { sorted, captainIndex };
  }

  const isSub = (index) => index === 5 || index === 6;
  const isOutfield = (index) => index >= 0 && index <= 3;

  const handleCardClick = async (index) => {
    const selectedPlayer = players[index];

    if (!selectedPlayer && mode === null) {
      setIsNavigating(true);
      navigate("/players", {
        state: {
          selectedPlayers: players,
          transferIndex: index,
          isNew: true,
          filter: index === 4 ? "gk" : "outfield",
        },
      });
      return;
    }

    if (!selectedPlayer || !mode) return;

    if (mode === "captain") {
      if (isSub(index)) return;
      setLoading(true);
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
      setLoading(false);
      setMode(null);
    } else if (mode === "transfer") {
      if (transferIndex === null) {
        setIsNavigating(true);
        navigate("/players", {
          state: {
            selectedPlayers: players,
            transferIndex: index,
            filter: index === 4 ? "gk" : "outfield",
            mode: "transfer",
          },
        });
      } else if (isSub(transferIndex) && isOutfield(index)) {
        const updated = [...players];
        [updated[transferIndex], updated[index]] = [
          updated[index],
          updated[transferIndex],
        ];
        setPlayers(updated);
        toast.success("Substitution successful");
        setTransferIndex(null);
      }
    } else if (mode === "substitute") {
      if (!isSub(index)) {
        setTransferIndex(index);
      } else if (transferIndex !== null) {
        const playerOutId = players[transferIndex]?.id;
        const subInId = players[index]?.id;

        const res = await callBackend("substitutePlayer", {
          userId,
          playerOutId,
          subInId,
        });

        if (res.status === "success") {
          const updated = [...players];
          [updated[transferIndex], updated[index]] = [
            updated[index],
            updated[transferIndex],
          ];
          setPlayers(updated);
          toast.success("Substitution successful!");
        } else {
          toast.error(res.message);
        }

        setTransferIndex(null);
        setMode(null);
      }
    }
  };

  const toggleMode = (selectedMode) => {
    setMode((prev) => (prev === selectedMode ? null : selectedMode));
    setTransferIndex(null);
  };

  const isCardClickable = (index) => {
    if (mode === null && !players[index]) return true;
    if (mode === "captain") return !isSub(index);
    if (mode === "transfer") return true;
    if (mode === "substitute") {
      if (transferIndex === null) return !isSub(index);
      else return isSub(index);
    }
    return false;
  };

  const isHighlighted = (index) => {
    if (mode === "transfer" && isSub(transferIndex)) {
      return isOutfield(index);
    }
    if (mode === "substitute" && transferIndex !== null) {
      return isSub(index);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 relative overflow-hidden">
      {(loading || isNavigating) && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
          <img
            src={inspireman}
            alt="Loading..."
            className="w-50 h-50 mb-4 animate-bounce"
          />
          <p className="text-yellow-400 text-lg">Loading...</p>
        </div>
      )}

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
          Captain:{" "}
          <span className="text-yellow-400">
            {players[captainIndex]?.name || "None"}
          </span>
        </div>
      </header>

      <h1 className="text-center text-xl font-bold mb-4">
        {userName} - {teamName}
      </h1>

      <div
        className="relative w-full max-w-2xl mx-auto p-4 rounded-xl space-y-4 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${pitch})` }}
      >
        <div
          className="grid grid-cols-2 gap-2"
          style={{ justifyItems: "center" }}
        >
          {[0, 1].map((i) => (
            <PlayerCard
              key={i}
              player={
                players[i]
                  ? {
                      ...players[i],
                      roundPoints:
                        i === captainIndex
                          ? (players[i].roundPoints || 0) * 2
                          : players[i].roundPoints,
                      totalPoints:
                        i === captainIndex
                          ? (players[i].totalPoints || 0) * 2
                          : players[i].totalPoints,
                    }
                  : null
              }
              onClick={() => handleCardClick(i)}
              isSelected={isHighlighted(i)}
              isCaptain={i === captainIndex}
              disabled={!isCardClickable(i)}
            />
          ))}
        </div>
        <div
          className="grid grid-cols-2 gap-2"
          style={{ justifyItems: "center" }}
        >
          {[2, 3].map((i) => (
            <PlayerCard
              key={i}
              player={
                players[i]
                  ? {
                      ...players[i],
                      roundPoints:
                        i === captainIndex
                          ? (players[i].roundPoints || 0) * 2
                          : players[i].roundPoints,
                      totalPoints:
                        i === captainIndex
                          ? (players[i].totalPoints || 0) * 2
                          : players[i].totalPoints,
                    }
                  : null
              }
              onClick={() => handleCardClick(i)}
              isSelected={isHighlighted(i)}
              isCaptain={i === captainIndex}
              disabled={!isCardClickable(i)}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <PlayerCard
            player={
              players[4]
                ? {
                    ...players[4],
                    roundPoints:
                      4 === captainIndex
                        ? (players[4].roundPoints || 0) * 2
                        : players[4].roundPoints,
                    totalPoints:
                      4 === captainIndex
                        ? (players[4].totalPoints || 0) * 2
                        : players[4].totalPoints,
                  }
                : null
            }
            onClick={() => handleCardClick(4)}
            isSelected={isHighlighted(4)}
            isCaptain={4 === captainIndex}
            disabled={!isCardClickable(4)}
          />
        </div>
      </div>

      <div
        className="mt-4"
        style={{
          backgroundImage: `url(${bench})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          backgroundSize: "contain",
          paddingBottom: "10%",
          borderRadius: "10%",
        }}
      >
        <p className="text-center font-semibold mb-2">Substitutes</p>
        <div
          className="grid grid-cols-2 gap-2 max-w-xs mx-auto"
          style={{ justifyItems: "center" }}
        >
          {[5, 6].map((i) => (
            <PlayerCard
              key={i}
              player={players[i]}
              onClick={() => handleCardClick(i)}
              isSelected={i === transferIndex}
              isCaptain={i === captainIndex}
              disabled={!isCardClickable(i)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between flex-wrap gap-2 mt-6">
        <Button
          onClick={() => toggleMode("captain")}
          className={`hover:bg-gray-200 text-black ${
            mode === "captain" ? "bg-[#ffce11]" : "bg-white"
          }`}
        >
          Select Captain
        </Button>
        <Button
          onClick={() => toggleMode("transfer")}
          className={`hover:bg-gray-200 text-black ${
            mode === "transfer" ? "bg-[#ffce11]" : "bg-white"
          }`}
        >
          Transfer
        </Button>
        <Button
          onClick={() => toggleMode("substitute")}
          className={`hover:bg-gray-200 text-black ${
            mode === "substitute" ? "bg-[#ffce11]" : "bg-white"
          }`}
        >
          Substitute
        </Button>
        <Button
          onClick={() => navigate("/leaderboard")}
          className="bg-white text-black hover:bg-gray-200"
        >
          Leaderboard
        </Button>
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
// import bench from "@/assets/bench.png";
// import inspireman from "@/assets/inspire man.png";

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
//   const [loading, setLoading] = useState(true);
//   const [isNavigating, setIsNavigating] = useState(false);

//   const teamName = localStorage.getItem("teamName") || "";
//   const userName = localStorage.getItem("name") || "";
//   const userId = localStorage.getItem("userId")?.trim();

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     async function fetchData() {
//       if (!userId) return;

//       setLoading(true);
//       const res = await callBackend("viewMyPlayers", { userId });
//       if (res.status === "success") {
//         const { sorted, captainIndex } = sortPlayers(res.players);
//         setPlayers(sorted);
//         setCaptainIndex(captainIndex);
//         setTotalPoints(res.totalPoints || 0);
//         setRoundPoints(res.roundPoints || 0);
//         setTransfersUsed(res.transfersUsed || 0);
//         setRoundName(res.round || "N/A");
//       } else {
//         toast.error(res.message);
//       }
//       setLoading(false);
//     }

//     fetchData();
//   }, [location.state?.updatedPlayers]);

//   function sortPlayers(players) {
//     const safe = players.filter((p) => p && typeof p === "object");
//     const sorted = Array(7).fill(null);

//     const outfieldMain = safe.filter((p) => !p.isGK && !p.isSub);
//     const gkMain = safe.find((p) => p.isGK && !p.isSub);
//     const subs = safe.filter((p) => p.isSub);

//     outfieldMain.forEach((p, i) => {
//       if (i < 4) sorted[i] = p;
//     });
//     sorted[4] = gkMain || null;
//     subs.forEach((p, i) => {
//       if (i < 2) sorted[5 + i] = p;
//     });

//     const captainId = safe.find((p) => p.isCaptain)?.id;
//     const captainIndex = sorted.findIndex((p) => p?.id === captainId);

//     return { sorted, captainIndex };
//   }

//   const isSub = (index) => index === 5 || index === 6;
//   const isOutfield = (index) => index >= 0 && index <= 3;

//   const handleCardClick = async (index) => {
//     const selectedPlayer = players[index];

//     if (!selectedPlayer && mode === null) {
//       setIsNavigating(true);
//       navigate("/players", {
//         state: {
//           selectedPlayers: players,
//           transferIndex: index,
//           isNew: true,
//           filter: index === 4 ? "gk" : "outfield",
//         },
//       });
//       return;
//     }

//     if (!selectedPlayer || !mode) return;

//     if (mode === "captain") {
//       if (isSub(index)) return;
//       setLoading(true);
//       try {
//         const res = await callBackend("selectCaptain", {
//           userId,
//           captainId: selectedPlayer.id,
//         });
//         if (res.status === "success") {
//           setCaptainIndex(index);
//           toast.success("Captain updated!");
//         } else {
//           toast.error(res.message);
//         }
//       } catch (err) {
//         toast.error("Failed to update captain.");
//       } finally {
//         setMode(null);
//         setLoading(false);
//       }
//     } else if (mode === "transfer") {
//       if (isSub(index)) {
//         setTransferIndex(index);
//       } else if (isOutfield(index)) {
//         if (transferIndex === null) {
//           setIsNavigating(true);
//           navigate("/players", {
//             state: {
//               selectedPlayers: players,
//               transferIndex: index,
//               filter: index === 4 ? "gk" : "outfield",
//               mode: "transfer",
//             },
//           });
//         } else if (isSub(transferIndex)) {
//           const updated = [...players];
//           [updated[transferIndex], updated[index]] = [
//             updated[index],
//             updated[transferIndex],
//           ];
//           setPlayers(updated);
//           toast.success("Substitution successful");
//           setTransferIndex(null);
//         }
//       }
//     } else if (mode === "substitute") {
//       if (!isSub(index)) {
//         setTransferIndex(index);
//       } else if (transferIndex !== null) {
//         const playerOutId = players[transferIndex]?.id;
//         const subInId = players[index]?.id;

//         setLoading(true);
//         const res = await callBackend("substitutePlayer", {
//           userId,
//           playerOutId,
//           subInId,
//         });

//         if (res.status === "success") {
//           const updated = [...players];
//           [updated[transferIndex], updated[index]] = [
//             updated[index],
//             updated[transferIndex],
//           ];
//           setPlayers(updated);
//           toast.success("Substitution successful!");
//         } else {
//           toast.error(res.message);
//         }

//         setTransferIndex(null);
//         setMode(null);
//         setLoading(false);
//       }
//     }
//   };

//   const toggleMode = (selectedMode) => {
//     setMode((prev) => (prev === selectedMode ? null : selectedMode));
//     setTransferIndex(null);
//   };

//   const isCardClickable = (index) => {
//     if (mode === null && !players[index]) return true;
//     if (mode === "captain") return !isSub(index);
//     if (mode === "transfer") {
//       if (transferIndex === null) return true;
//       if (isSub(transferIndex)) return isOutfield(index);
//     }
//     if (mode === "substitute") {
//       if (transferIndex === null) return !isSub(index);
//       else return isSub(index);
//     }
//     return false;
//   };

//   const isHighlighted = (index) => {
//     if (mode === "transfer" && isSub(transferIndex)) {
//       return isOutfield(index);
//     }
//     if (mode === "substitute" && transferIndex !== null) {
//       return isSub(index);
//     }
//     return false;
//   };

//   return (
//     <div className="min-h-screen bg-black text-white p-4 relative overflow-hidden">
//       {(loading || isNavigating) && (
//         <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
//           <img
//             src={inspireman}
//             alt="Loading..."
//             className="w-50 h-50 mb-4 animate-bounce"
//           />
//           <p className="text-yellow-400 text-lg">Loading...</p>
//         </div>
//       )}

//       <header className="flex flex-col mb-4 text-sm">
//         <div className="flex justify-between mb-1">
//           <span>
//             Total Points: {totalPoints} <br />
//             Round Points: {roundPoints}
//           </span>
//           <span>Round: {roundName}</span>
//           <span>Transfers Used: {transfersUsed}</span>
//         </div>
//         <div className="text-center font-semibold">
//           Captain:{" "}
//           <span className="text-yellow-400">
//             {players[captainIndex]?.name || "None"}
//           </span>
//         </div>
//       </header>

//       <h1 className="text-center text-xl font-bold mb-4">
//         {userName} - {teamName}
//       </h1>

//       <div
//         className="relative w-full max-w-2xl mx-auto p-4 rounded-xl space-y-4 bg-no-repeat bg-cover bg-center"
//         style={{ backgroundImage: `url(${pitch})` }}
//       >
//         <div className="grid grid-cols-2 gap-2" style={{ justifyItems: "center" }}>
//           {[0, 1].map((i) => (
//             <PlayerCard
//               key={i}
//               player={players[i]}
//               onClick={() => handleCardClick(i)}
//               isSelected={isHighlighted(i)}
//               isCaptain={i === captainIndex}
//               disabled={!isCardClickable(i)}
//             />
//           ))}
//         </div>
//         <div className="grid grid-cols-2 gap-2" style={{ justifyItems: "center" }}>
//           {[2, 3].map((i) => (
//             <PlayerCard
//               key={i}
//               player={players[i]}
//               onClick={() => handleCardClick(i)}
//               isSelected={isHighlighted(i)}
//               isCaptain={i === captainIndex}
//               disabled={!isCardClickable(i)}
//             />
//           ))}
//         </div>
//         <div className="flex justify-center">
//           <PlayerCard
//             player={players[4]}
//             onClick={() => handleCardClick(4)}
//             isSelected={isHighlighted(4)}
//             isCaptain={4 === captainIndex}
//             disabled={!isCardClickable(4)}
//           />
//         </div>
//       </div>

//       <div
//         className="mt-4"
//         style={{
//           backgroundImage: `url(${bench})`,
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "bottom center",
//           backgroundSize: "contain",
//           paddingBottom: "10%",
//           borderRadius: "10%",
//         }}
//       >
//         <p className="text-center font-semibold mb-2">Substitutes</p>
//         <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto" style={{ justifyItems: "center" }}>
//           {[5, 6].map((i) => (
//             <PlayerCard
//               key={i}
//               player={players[i]}
//               onClick={() => handleCardClick(i)}
//               isSelected={i === transferIndex}
//               isCaptain={i === captainIndex}
//               disabled={!isCardClickable(i)}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-between flex-wrap gap-2 mt-6">
//         <Button
//           onClick={() => toggleMode("captain")}
//           className={`hover:bg-gray-200 text-black ${mode === "captain" ? "bg-[#ffce11]" : "bg-white"}`}
//         >
//           Select Captain
//         </Button>
//         <Button
//           onClick={() => toggleMode("transfer")}
//           className={`hover:bg-gray-200 text-black ${mode === "transfer" ? "bg-[#ffce11]" : "bg-white"}`}
//         >
//           Transfer
//         </Button>
//         <Button
//           onClick={() => toggleMode("substitute")}
//           className={`hover:bg-gray-200 text-black ${mode === "substitute" ? "bg-[#ffce11]" : "bg-white"}`}
//         >
//           Substitute
//         </Button>
//         <Button
//           onClick={() => navigate("/leaderboard")}
//           className="bg-white text-black hover:bg-gray-200"
//         >
//           Leaderboard
//         </Button>
//       </div>
//     </div>
//   );
// }
