export default function PlayerCard({ player, onClick, isSelected }) {
    return (
      <div
        onClick={onClick}
        className={`w-28 h-40 rounded-2xl p-2 flex flex-col justify-center items-center text-white cursor-pointer shadow-xl border-2
          bg-gradient-to-b from-black via-gray-900 to-black
          ${isSelected ? "border-yellow-400 scale-105" : "border-white/10 hover:border-yellow-400"}
          transition-transform duration-300`}
      >
        {player ? (
          <>
            <div className="text-sm font-bold text-yellow-400">{player.name}</div>
            <div className="text-xs text-white mt-1">{player.team}</div>
          </>
        ) : (
          <span className="text-3xl text-gray-500">+</span>
        )}
      </div>
    );
  }
  