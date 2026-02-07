import { useState, useMemo } from "react";
import { useMusic } from "../context/MusicContext";
import SongCard from "../components/SongCard";
import { HiSearch, HiMusicNote, HiUserGroup } from "react-icons/hi";

function SearchPage({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const { searchSongs, getArtists } = useMusic();
  const results = useMemo(() => searchSongs(query), [query, searchSongs]);
  const artists = getArtists();
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const matchedArtists = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return artists.filter(a => a.name.toLowerCase().includes(q));
  }, [query, artists]);

  return (
    <div className="space-y-6 pb-8">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Search</h1>
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus-within:bg-white/8 transition-all max-w-xl">
          <HiSearch className="text-lg sm:text-xl text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="bg-transparent outline-none w-full text-white placeholder-gray-500 text-base sm:text-lg"
            autoFocus
          />
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === "grid" ? "bg-fuchsia-500/20 text-fuchsia-400" : "text-gray-500 hover:text-white"}`}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === "list" ? "bg-fuchsia-500/20 text-fuchsia-400" : "text-gray-500 hover:text-white"}`}
        >
          List
        </button>
        {query && (
          <span className="ml-auto text-sm text-gray-500">{results.length} results</span>
        )}
      </div>

      {/* Matched Artists */}
      {matchedArtists.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <HiUserGroup className="text-fuchsia-400" />
            Artists
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {matchedArtists.map(artist => (
              <div key={artist.id} className="flex-shrink-0 flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/5 hover:bg-white/8 transition-all">
                {artist.image && (
                  <img src={artist.image} alt={artist.name} className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10" />
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{artist.name}</p>
                  <p className="text-xs text-gray-500">{artist.songCount} songs</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      {!query.trim() ? (
        <div className="text-center py-20">
          <HiMusicNote className="text-6xl text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Start searching</h2>
          <p className="text-sm text-gray-600">Find your favorite songs and artists</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <HiSearch className="text-6xl text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">No results found</h2>
          <p className="text-sm text-gray-600">Try searching for something else</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {results.map((song, i) => (
            <SongCard key={song.song_id} song={song} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {results.map((song, i) => (
            <SongCard key={song.song_id} song={song} index={i} compact />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
