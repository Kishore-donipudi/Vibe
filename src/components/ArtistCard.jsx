import { useMusic } from "../context/MusicContext";
import { BsSoundwave } from "react-icons/bs";

function ArtistCard({ artist, onClick }) {
  const { currentSong, isPlaying } = useMusic();
  const isActiveArtist = currentSong?.artist_id === artist.id && isPlaying;

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 hover:bg-white/[0.06] hover:border-fuchsia-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-fuchsia-500/5 cursor-pointer w-full"
    >
      <div className="relative mb-3">
        <div className={`w-24 h-24 rounded-full overflow-hidden ring-2 transition-all duration-300
          ${isActiveArtist
            ? "ring-fuchsia-500 shadow-lg shadow-fuchsia-500/30"
            : "ring-white/10 group-hover:ring-fuchsia-500/50"
          }`}
        >
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${artist.gradient}`}>
              <span className="text-2xl font-bold text-white">{artist.name.charAt(0)}</span>
            </div>
          )}
        </div>
        {isActiveArtist && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-fuchsia-500 rounded-full px-2 py-0.5">
            <BsSoundwave className="text-white text-[10px] animate-pulse" />
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-white group-hover:text-fuchsia-400 transition-colors text-center">
        {artist.name}
      </h3>
      <p className="text-[11px] text-gray-500 mt-0.5">
        {artist.songCount} {artist.songCount === 1 ? "song" : "songs"}
      </p>
    </button>
  );
}

export default ArtistCard;
