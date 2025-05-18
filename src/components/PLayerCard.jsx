// components/PlayerCard.jsx
import teamLogo from "@/assets/inspireman.png";

export default function PlayerCard({
  player,
  onClick,
  isSelected,
  isCaptain,
  disabled,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-28 h-40 rounded-2xl p-2 flex flex-col justify-between items-center 
        text-white cursor-pointer shadow-xl border-2 transition-transform duration-300
        bg-gradient-to-b from-black via-gray-900 to-black
        ${
          isSelected
            ? "border-yellow-400 scale-105"
            : "border-white/10 hover:border-yellow-400"
        }
        ${""}
      `}
    >
      {player ? (
        <>
          {/* Team Logo */}
          <img
            src={teamLogo}
            alt="Team logo"
            className="w-6 h-6 mb-1 drop-shadow"
          />

          {/* Captain Star */}
          {isCaptain && (
            <div className="absolute top-1 right-1">
              <span className="text-yellow-400 text-lg">★</span>
            </div>
          )}

          {/* Player Name */}
          <div className="text-sm font-bold text-yellow-400 text-center">
            {player.name}
          </div>

          {/* Team Name */}
          <div className="text-xs text-white text-center">{player.team}</div>

          {/* Optional Points Display */}
          <div className="text-[10px] text-white mt-1 text-center">
            Round: {player.roundPoints ?? 0} <br />
            Total: {player.totalPoints ?? 0}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-4xl text-gray-400">+</div>
          <div className="text-xs mt-1 text-gray-500 text-center">
            Add Player
          </div>
        </div>
      )}
    </div>
  );
}
