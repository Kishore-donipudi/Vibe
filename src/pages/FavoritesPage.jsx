import { useMusic } from "../context/MusicContext";
import SongCard from "../components/SongCard";
import { HiHeart, HiPlay, HiTrash } from "react-icons/hi";

function FavoritesPage() {
  const { favorites, playSong, setQueue } = useMusic();

  function playAll() {
    if (favorites.length > 0) {
      setQueue(favorites);
      playSong(favorites[0]);
    }
  }

  function shufflePlay() {
    if (favorites.length > 0) {
      const shuffled = [...favorites].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      playSong(shuffled[0]);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/80 via-rose-600/70 to-fuchsia-600/80" />
        <div className="relative z-10 px-5 py-8 sm:px-8 sm:py-12 flex items-end gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center shadow-2xl">
            <HiHeart className="text-white text-2xl sm:text-4xl" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-medium text-pink-200 uppercase tracking-widest mb-1">Playlist</p>
            <h1 className="text-2xl sm:text-4xl font-black text-white mb-1 sm:mb-2">Liked Songs</h1>
            <p className="text-sm text-pink-100/80">{favorites.length} {favorites.length === 1 ? "song" : "songs"}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {favorites.length > 0 && (
        <div className="flex items-center gap-3">
          <button
            onClick={playAll}
            className="px-5 py-2.5 rounded-2xl bg-fuchsia-500 text-white font-semibold text-sm flex items-center gap-2 hover:bg-fuchsia-600 active:scale-95 transition-all shadow-lg shadow-fuchsia-500/20"
          >
            <HiPlay className="text-lg" />
            Play All
          </button>
          <button
            onClick={shufflePlay}
            className="px-5 py-2.5 rounded-2xl bg-white/5 text-white font-semibold text-sm flex items-center gap-2 hover:bg-white/10 active:scale-95 transition-all border border-white/10"
          >
            Shuffle
          </button>
        </div>
      )}

      {/* Song List */}
      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <HiHeart className="text-6xl text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">No favorites yet</h2>
          <p className="text-sm text-gray-600">Songs you like will appear here</p>
        </div>
      ) : (
        <div className="space-y-1">
          {favorites.map((song, i) => (
            <SongCard key={song.song_id} song={song} index={i} compact />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
