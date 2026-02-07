import { useMusic } from "../context/MusicContext";
import { useAuth } from "../user_details/AuthContext";
import SongCard from "../components/SongCard";
import ArtistCard from "../components/ArtistCard";
import { HiPlay, HiSparkles, HiFire, HiClock, HiChevronRight } from "react-icons/hi";
import { BsSoundwave } from "react-icons/bs";

function Homepage({ onNavigate }) {
  const { songs, recentlyPlayed, getArtists, playSong, favorites } = useMusic();
  const { user } = useAuth();
  const artists = getArtists();
  const hasProfileImg = user?.profile_img;
  const trendingSongs = songs.slice(0, 8);
  const newReleases = songs.slice(-6);
  const recent = recentlyPlayed.slice(0, 6);

  return (
    <div className="space-y-10 pb-8">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden mx-1">
        {/* Background: profile image blur or gradient */}
        {hasProfileImg ? (
          <>
            <img
              src={`data:image/jpeg;base64,${user.profile_img}`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-50"
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/90 via-purple-600/80 to-indigo-600/90" />
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-pink-400 blur-3xl animate-pulse" />
              <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-purple-400 blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-20 right-40 w-32 h-32 rounded-full bg-indigo-400 blur-3xl animate-pulse delay-500" />
            </div>
          </>
        )}
        <div className="relative z-10 px-5 py-10 sm:px-8 sm:py-14 md:px-12 md:py-20 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-1 space-y-3 sm:space-y-4">
            {hasProfileImg ? (
              <div className="flex items-center gap-3 sm:gap-4 mb-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden ring-2 ring-white/20 shadow-xl">
                  <img src={`data:image/jpeg;base64,${user.profile_img}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-fuchsia-200 text-xs sm:text-sm font-medium">Welcome back</p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{user.username}</h1>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-fuchsia-200">
                  <HiSparkles className="text-lg" />
                  <span className="text-sm font-medium tracking-wide uppercase">
                    {user ? `Hey, ${user.username}` : "Featured"}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight">
                  Your Music,<br />
                  <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                    Your Vibe
                  </span>
                </h1>
              </>
            )}
            <p className="text-fuchsia-100/80 text-sm sm:text-lg max-w-md">
              Stream {songs.length}+ tracks from your favorite artists. Discover, save, and enjoy.
            </p>
            <div className="flex gap-2 sm:gap-3 pt-2">
              <button
                onClick={() => songs.length > 0 && playSong(songs[Math.floor(Math.random() * songs.length)])}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white text-black font-bold text-xs sm:text-sm hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-2 shadow-xl"
              >
                <HiPlay className="text-lg" />
                Shuffle Play
              </button>
              <button
                onClick={() => onNavigate("songs")}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all active:scale-95 border border-white/20"
              >
                Browse All
              </button>
            </div>
          </div>
          {/* Equalizer animation (only when no profile image) */}
          {!hasProfileImg && (
            <div className="hidden md:flex items-end gap-1 h-32 opacity-60">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 rounded-full bg-white/50"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    animation: `equalizer ${0.5 + Math.random() * 0.8}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recently Played */}
      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <HiClock className="text-fuchsia-400 text-lg" />
              <h2 className="text-xl font-bold text-white">Recently Played</h2>
            </div>
            <button onClick={() => onNavigate("recent")} className="text-sm text-gray-400 hover:text-fuchsia-400 flex items-center gap-1 transition-colors">
              See all <HiChevronRight className="text-sm" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {recent.map((song, i) => (
              <SongCard key={song.song_id} song={song} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Artists */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-white">Popular Artists</h2>
          <button onClick={() => onNavigate("artists")} className="text-sm text-gray-400 hover:text-fuchsia-400 flex items-center gap-1 transition-colors">
            See all <HiChevronRight className="text-sm" />
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {artists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} onClick={() => onNavigate("artist-" + artist.id)} />
          ))}
        </div>
      </section>

      {/* Trending Songs */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <HiFire className="text-orange-400 text-lg" />
            <h2 className="text-xl font-bold text-white">Trending Now</h2>
          </div>
          <button onClick={() => onNavigate("songs")} className="text-sm text-gray-400 hover:text-fuchsia-400 flex items-center gap-1 transition-colors">
            See all <HiChevronRight className="text-sm" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {trendingSongs.map((song, i) => (
            <SongCard key={song.song_id} song={song} index={i} />
          ))}
        </div>
      </section>

      {/* Fresh Picks */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <HiSparkles className="text-emerald-400 text-lg" />
            <h2 className="text-xl font-bold text-white">Fresh Picks</h2>
          </div>
        </div>
        <div className="space-y-1">
          {newReleases.map((song, i) => (
            <SongCard key={song.song_id} song={song} index={i} compact />
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Songs", value: songs.length, icon: BsSoundwave, color: "text-fuchsia-400" },
          { label: "Artists", value: artists.length, icon: HiSparkles, color: "text-blue-400" },
          { label: "Recently Played", value: recentlyPlayed.length, icon: HiClock, color: "text-emerald-400" },
          { label: "Your Favorites", value: favorites.length, icon: HiFire, color: "text-orange-400" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-center hover:bg-white/[0.06] transition-colors">
              <Icon className={`text-2xl ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default Homepage;
