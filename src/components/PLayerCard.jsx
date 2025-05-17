// components/PlayerCard.jsx
import teamLogo from "@/assets/inspireman.png"; // adjust path if needed

export default function PlayerCard({ player, onClick, isSelected, isCaptain, mode }) {
  return (
    <div
    onClick={!disabled ? onClick : undefined}
    className={`w-28 h-40 rounded-2xl p-2 flex flex-col justify-center items-center text-white cursor-pointer shadow-xl border-2
      bg-gradient-to-b from-black via-gray-900 to-black
      ${isCaptain ? "border-yellow-400" : isSelected ? "border-blue-400" : "border-white/10 hover:border-yellow-400"}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
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

          {/* Player Image Placeholder */}
          {/* <img src={player.imageUrl} alt={`${player.name} image`} className="w-12 h-12 rounded-full mb-2" /> */}

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
        <span className="text-3xl text-gray-500">+</span>
      )}
    </div>
  );
}
