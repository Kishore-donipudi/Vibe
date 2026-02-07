import { useMusic } from "../context/MusicContext";
import { useToast } from "./Toast";
import { HiHeart, HiPlay, HiPause } from "react-icons/hi";
import { BsSoundwave } from "react-icons/bs";

function SongCard({ song, index, compact = false }) {
  const { playSong, currentSong, isPlaying, togglePlay, toggleFavorite, isFavorite } = useMusic();
  const { addToast } = useToast();
  const isCurrentSong = currentSong?.song_id === song.song_id;
  const fav = isFavorite(song.song_id);

  function handleFavorite(e) {
    e.stopPropagation();
    toggleFavorite(song);
    if (!fav) {
      addToast(`"${song.title}" added to favorites`, { type: "favorite" });
    } else {
      addToast(`Removed from favorites`, { type: "unfavorite", duration: 2000 });
    }
  }

  function handleClick() {
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song);
    }
  }

  if (compact) {
    return (
      <div
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
          ${isCurrentSong
            ? "bg-fuchsia-500/10 border border-fuchsia-500/20"
            : "hover:bg-white/5 border border-transparent"
          }`}
        onClick={handleClick}
      >
        {/* Number / Playing indicator */}
        <div className="w-8 text-center flex-shrink-0">
          {isCurrentSong && isPlaying ? (
            <BsSoundwave className="text-fuchsia-400 text-lg mx-auto animate-pulse" />
          ) : (
            <span className="text-xs text-gray-500 group-hover:hidden">{index + 1}</span>
          )}
          <button className="hidden group-hover:block mx-auto">
            {isCurrentSong && isPlaying ? (
              <HiPause className="text-fuchsia-400 text-lg" />
            ) : (
              <HiPlay className="text-white text-lg" />
            )}
          </button>
        </div>

        {/* Artist Image */}
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-fuchsia-500/30 to-purple-500/30">
          {song.artistImage ? (
            <img src={song.artistImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BsSoundwave className="text-fuchsia-400/50" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isCurrentSong ? "text-fuchsia-400" : "text-white"}`}>
            {song.title}
          </p>
          <p className="text-xs text-gray-500 truncate">{song.artistName}</p>
        </div>

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className={`p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100
            ${fav ? "opacity-100 text-fuchsia-400" : "text-gray-500 hover:text-fuchsia-400"}`}
        >
          <HiHeart className={`text-sm ${fav ? "fill-current" : ""}`} />
        </button>

        {/* Duration placeholder */}
        <span className="text-xs text-gray-600 w-10 text-right">3:45</span>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
        ${isCurrentSong
          ? "ring-2 ring-fuchsia-500/50 shadow-xl shadow-fuchsia-500/10"
          : "hover:shadow-fuchsia-500/5"
        }
      `}
      onClick={handleClick}
    >
      {/* Card Background */}
      <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm p-4 border border-white/5 rounded-2xl">
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20">
          {song.artistImage ? (
            <img
              src={song.artistImage}
              alt={song.artistName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BsSoundwave className="text-4xl text-fuchsia-400/30" />
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-fuchsia-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/50 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {isCurrentSong && isPlaying ? (
                <HiPause className="text-white text-xl" />
              ) : (
                <HiPlay className="text-white text-xl ml-0.5" />
              )}
            </div>
          </div>

          {/* Now Playing indicator */}
          {isCurrentSong && isPlaying && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
              <BsSoundwave className="text-fuchsia-400 text-xs animate-pulse" />
              <span className="text-[10px] text-fuchsia-400 font-medium">Playing</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all
              ${fav
                ? "bg-fuchsia-500/30 text-fuchsia-400"
                : "bg-black/30 text-white/60 opacity-0 group-hover:opacity-100 hover:text-fuchsia-400"
              }`}
          >
            <HiHeart className={`text-sm ${fav ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Info */}
        <h3 className={`text-sm font-semibold truncate mb-0.5 ${isCurrentSong ? "text-fuchsia-400" : "text-white"}`}>
          {song.title}
        </h3>
        <p className="text-xs text-gray-500 truncate">{song.artistName}</p>
      </div>
    </div>
  );
}

export default SongCard;
