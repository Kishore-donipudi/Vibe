import { useState } from "react";
import { Link } from "react-router-dom";
import SongList from "./SongList";

function ArtistSection({ artists, songs }) {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const artistSongs = selectedArtist && songs ? songs.filter(s => s.artist_id === selectedArtist.id) : [];

  return (
    <section id="artists" className="mb-12">
      <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">
        Artists
      </h2>
      <div className="flex flex-wrap gap-7 mb-10 justify-center">
        {artists && artists.map(artist => (
          <button
            key={artist.id}
            onClick={() => setSelectedArtist(artist)}
            className={`flex flex-col items-center px-7 py-4 rounded-2xl font-bold text-lg border-2 shadow-lg transition-all duration-300 relative focus:outline-none
              ${selectedArtist?.id === artist.id
                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-transparent scale-105 shadow-2xl ring-4 ring-pink-200"
                : "bg-white text-blue-700 border-blue-200 hover:bg-gradient-to-r hover:from-blue-100 hover:to-pink-100 hover:text-purple-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-300"}
            `}
            style={{ minWidth: 140, minHeight: 120 }}
          >
            {artist.image && (
              <img
                src={artist.image}
                alt={artist.name}
                className="w-16 h-16 rounded-full mb-2 border-2 border-blue-200 object-cover shadow"
              />
            )}
            <span>{artist.name}</span>
          </button>
        ))}
      </div>
      {selectedArtist && (
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl p-10 max-w-2xl mx-auto border border-blue-100 relative">
          <div className="flex items-center mb-4">
            {selectedArtist.image && (
              <img
                src={selectedArtist.image}
                alt={selectedArtist.name}
                className="w-14 h-14 rounded-full border-2 border-pink-300 object-cover shadow-lg mr-4"
              />
            )}
            <div>
              <h3 className="text-2xl font-bold mb-1 text-blue-700">{selectedArtist.name}'s Songs</h3>
              <p className="text-gray-600">Total Songs: {artistSongs.length}</p>
            </div>
          </div>
          <SongList songs={artistSongs} getArtistName={() => selectedArtist.name} />
        </div>
      )}
      <Link to="/artists" className="mt-4 text-blue-600 hover:underline">
        View all artists
      </Link>
    </section>
  );
}

export default ArtistSection;
