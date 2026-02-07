import { useState, useMemo } from "react";
import { useMusic } from "../context/MusicContext";
import SongCard from "../components/SongCard";
import { HiMusicNote, HiPlay, HiViewGrid, HiViewList } from "react-icons/hi";

function AllSongsPage() {
  const { songs, playSong, setQueue, getArtists } = useMusic();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [filterArtist, setFilterArtist] = useState("all");
  const artists = getArtists();

  const filtered = useMemo(() => {
    let list = [...songs];
    if (filterArtist !== "all") {
      list = list.filter(s => s.artist_id === Number(filterArtist));
    }
    if (sortBy === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "artist") {
      list.sort((a, b) => a.artistName.localeCompare(b.artistName));
    }
    return list;
  }, [songs, sortBy, filterArtist]);

  function playAll() {
    if (filtered.length > 0) {
      setQueue(filtered);
      playSong(filtered[0]);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <HiMusicNote className="text-xl sm:text-2xl text-fuchsia-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">All Songs</h1>
          <span className="text-sm text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter */}
          <select
            value={filterArtist}
            onChange={e => setFilterArtist(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/30"
          >
            <option value="all" className="bg-gray-900">All Artists</option>
            {artists.map(a => (
              <option key={a.id} value={a.id} className="bg-gray-900">{a.name}</option>
            ))}
          </select>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/30"
          >
            <option value="default" className="bg-gray-900">Default</option>
            <option value="name" className="bg-gray-900">By Name</option>
            <option value="artist" className="bg-gray-900">By Artist</option>
          </select>
          {/* View toggle */}
          <button
            onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors border border-white/10"
          >
            {viewMode === "grid" ? <HiViewList className="text-lg" /> : <HiViewGrid className="text-lg" />}
          </button>
        </div>
      </div>

      {/* Play All */}
      <button
        onClick={playAll}
        className="px-5 py-2.5 rounded-2xl bg-fuchsia-500 text-white font-semibold text-sm flex items-center gap-2 hover:bg-fuchsia-600 active:scale-95 transition-all shadow-lg shadow-fuchsia-500/20"
      >
        <HiPlay className="text-lg" />
        Play All ({filtered.length})
      </button>

      {/* Songs */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((song, i) => (
            <SongCard key={song.song_id} song={song} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((song, i) => (
            <SongCard key={song.song_id} song={song} index={i} compact />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllSongsPage;
