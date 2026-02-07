import { useMusic } from "../context/MusicContext";
import SongCard from "../components/SongCard";
import { HiPlay } from "react-icons/hi";
import { RiPlayListFill } from "react-icons/ri";
import { BsSoundwave } from "react-icons/bs";

function QueuePage() {
  const { queue, currentSong, playSong, isPlaying } = useMusic();

  const currentIndex = currentSong ? queue.findIndex(s => s.song_id === currentSong.song_id) : -1;
  const upNext = currentIndex >= 0 ? queue.slice(currentIndex + 1) : queue;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <RiPlayListFill className="text-2xl text-fuchsia-400" />
        <h1 className="text-3xl font-bold text-white">Queue</h1>
        <span className="text-sm text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{queue.length}</span>
      </div>

      {/* Now Playing */}
      {currentSong && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Now Playing</h2>
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-fuchsia-500/30 to-purple-500/30">
              {currentSong.artistImage ? (
                <img src={currentSong.artistImage} alt="" className={`w-full h-full object-cover ${isPlaying ? "animate-slow-spin" : ""}`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BsSoundwave className="text-fuchsia-400/50 text-xl" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-fuchsia-400 truncate">{currentSong.title}</p>
              <p className="text-sm text-gray-400 truncate">{currentSong.artistName}</p>
            </div>
            {isPlaying && <BsSoundwave className="text-fuchsia-400 text-xl animate-pulse flex-shrink-0" />}
          </div>
        </section>
      )}

      {/* Up Next */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Up Next ({upNext.length})
        </h2>
        {upNext.length === 0 ? (
          <div className="text-center py-12">
            <RiPlayListFill className="text-5xl text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No more songs in queue</p>
          </div>
        ) : (
          <div className="space-y-1">
            {upNext.map((song, i) => (
              <SongCard key={`queue-${song.song_id}-${i}`} song={song} index={i} compact />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default QueuePage;
