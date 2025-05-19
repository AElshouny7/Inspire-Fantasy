// components/PlayerCard.jsx
import teamLogo from "@/assets/inspire man.png"; 
import ayman from "@/assets/P23 - Mohamed Ayman.jpg"; 


export default function PlayerCard({ player, onClick, isSelected, isCaptain, disabled }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        relative w-28 h-40 rounded-2xl p-2 flex flex-col justify-center items-center 
        text-white cursor-pointer shadow-xl border-2 transition-transform duration-300
        bg-gradient-to-b from-black via-gray-900 to-black
        ${isSelected ? "border-yellow-400 scale-105" : "border-white/10 hover:border-yellow-400"}
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      `}
    >
      {player ? (
        <>
          {/* Inspire Man logo top-left */}
          <img src={teamLogo}
          alt="InspireMan"
          className="absolute top-1 left-1 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none select-none" 
          />

          {/* Captain Star top-right */}
          {isCaptain && (
            <div className="absolute top-1 right-1">
              <span className="text-yellow-400 text-lg">★</span>
            </div>
          )}

          {/* Player image */}
          <img
            src={ayman} // Replace with player.imageUrl fetch from backend
            alt={player.name}
            className="w-16 h-16 rounded-full object-cover mb-1"
          />

          {/* Player Name */}
          <div className="text-xs text-yellow-400 text-center font-semibold mb-1">
            {player.name}
          </div>

          {/* Bottom Row Info */}
          <div className="absolute bottom-1 left-1 text-[10px] text-white text-left leading-tight">
            <div className="wrap-text max-w-xs whitespace-normal break-words">{player.team}</div>
            <div className="text-gray-400 italic">{player.isGK ? "GK" : "Player"}</div>
          </div>

          <div className="absolute bottom-1 right-1 text-[10px] text-right text-white leading-tight">
            <div>Round: {player.roundPoints ?? 0}</div>
            <div>Total: {player.totalPoints ?? 0}</div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-4xl text-gray-400">+</div>
          <div className="text-xs mt-1 text-gray-500 text-center">Add Player</div>
        </div>
      )}
    </div>
  );
}


