import { useMusic } from "../context/MusicContext";
import SongCard from "../components/SongCard";
import { HiClock, HiPlay } from "react-icons/hi";

function RecentPage() {
  const { recentlyPlayed, playSong, setQueue } = useMusic();

  function playAll() {
    if (recentlyPlayed.length > 0) {
      setQueue(recentlyPlayed);
      playSong(recentlyPlayed[0]);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <HiClock className="text-2xl text-fuchsia-400" />
        <h1 className="text-3xl font-bold text-white">Recently Played</h1>
        <span className="text-sm text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{recentlyPlayed.length}</span>
      </div>

      {recentlyPlayed.length > 0 && (
        <button
          onClick={playAll}
          className="px-5 py-2.5 rounded-2xl bg-fuchsia-500 text-white font-semibold text-sm flex items-center gap-2 hover:bg-fuchsia-600 active:scale-95 transition-all shadow-lg shadow-fuchsia-500/20"
        >
          <HiPlay className="text-lg" />
          Play All
        </button>
      )}

      {recentlyPlayed.length === 0 ? (
        <div className="text-center py-20">
          <HiClock className="text-6xl text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">No history yet</h2>
          <p className="text-sm text-gray-600">Start listening to build your history</p>
        </div>
      ) : (
        <div className="space-y-1">
          {recentlyPlayed.map((song, i) => (
            <SongCard key={`recent-${song.song_id}-${i}`} song={song} index={i} compact />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentPage;
