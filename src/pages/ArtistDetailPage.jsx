import { useParams, useNavigate } from "react-router-dom";
import { useMusic } from "../context/MusicContext";
import SongCard from "../components/SongCard";
import { HiPlay, HiArrowLeft } from "react-icons/hi";
import { BsSoundwave } from "react-icons/bs";

function ArtistDetailPage() {
  const { id } = useParams();
  const artistId = Number(id);
  const navigate = useNavigate();
  const { getSongsByArtist, getArtists, playSong, setQueue, currentSong, isPlaying } = useMusic();
  const artists = getArtists();
  const artist = artists.find(a => a.id === artistId);
  const songs = getSongsByArtist(artistId);
  const isActiveArtist = currentSong?.artist_id === artistId && isPlaying;

  if (!artist) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Artist not found</p>
      </div>
    );
  }

  function playAll() {
    if (songs.length > 0) {
      setQueue(songs);
      playSong(songs[0]);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/artists")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <HiArrowLeft /> Back to Artists
      </button>

      {/* Artist Hero */}
      <div className="relative rounded-3xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${artist.gradient} opacity-80`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 px-8 py-16 flex items-end gap-6">
          <div className={`w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl flex-shrink-0 ${isActiveArtist ? "ring-fuchsia-500" : ""}`}>
            {artist.image ? (
              <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${artist.gradient}`}>
                <span className="text-4xl font-bold text-white">{artist.name.charAt(0)}</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-white/60 uppercase tracking-widest mb-1">Artist</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 flex items-center gap-3">
              {artist.name}
              {isActiveArtist && <BsSoundwave className="text-xl animate-pulse" />}
            </h1>
            <p className="text-sm text-white/70">{songs.length} {songs.length === 1 ? "song" : "songs"}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={playAll}
          className="px-5 py-2.5 rounded-2xl bg-fuchsia-500 text-white font-semibold text-sm flex items-center gap-2 hover:bg-fuchsia-600 active:scale-95 transition-all shadow-lg shadow-fuchsia-500/20"
        >
          <HiPlay className="text-lg" />
          Play All
        </button>
        <button
          onClick={() => {
            const shuffled = [...songs].sort(() => Math.random() - 0.5);
            if (shuffled.length > 0) { setQueue(shuffled); playSong(shuffled[0]); }
          }}
          className="px-5 py-2.5 rounded-2xl bg-white/5 text-white font-semibold text-sm flex items-center gap-2 hover:bg-white/10 active:scale-95 transition-all border border-white/10"
        >
          Shuffle
        </button>
      </div>

      {/* Songs List */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Songs</h2>
        <div className="space-y-1">
          {songs.map((song, i) => (
            <SongCard key={song.song_id} song={song} index={i} compact />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ArtistDetailPage;
