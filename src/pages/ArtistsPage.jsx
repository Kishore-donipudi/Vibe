import { useMusic } from "../context/MusicContext";
import ArtistCard from "../components/ArtistCard";
import { HiUserGroup } from "react-icons/hi";

function ArtistsPage({ onNavigate }) {
  const { getArtists } = useMusic();
  const artists = getArtists();

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <HiUserGroup className="text-2xl text-fuchsia-400" />
        <h1 className="text-3xl font-bold text-white">All Artists</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {artists.map(artist => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onClick={() => onNavigate("artist-" + artist.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default ArtistsPage;
