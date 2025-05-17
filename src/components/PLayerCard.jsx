// components/PlayerCard.jsx
import teamLogo from "@/assets/inspireman.png"; // adjust path if needed

export default function PlayerCard({ player, onClick, isSelected, isCaptain, mode }) {
  return (
    <div
      onClick={onClick}
      className={`w-28 h-40 rounded-2xl p-2 flex flex-col justify-between items-center text-white cursor-pointer shadow-xl border-2
        bg-gradient-to-b from-black via-gray-900 to-black
        ${isSelected ? "border-yellow-400 scale-105" : "border-white/10 hover:border-yellow-400"}
        transition-transform duration-300`}
    >
      {player ? (
        <>
          {/* Logo */}
          <img
            src={teamLogo}
            alt="Team logo"
            className="w-6 h-6 mb-1 drop-shadow"
          />

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

          {/* Captain Star */}
          {isCaptain && (
            <div className="absolute top-1 right-1">
              <span className="text-yellow-400 text-lg">★</span>
            </div>
          )}
        </>
      ) : (
        <span className="text-3xl text-gray-500">+</span>
      )}
    </div>
  );
}
