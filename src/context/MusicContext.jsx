import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

const MusicContext = createContext();

const ARTIST_COLORS = {
  1: { color: "#3b82f6", gradient: "from-blue-500 to-cyan-400" },
  2: { color: "#ec4899", gradient: "from-pink-500 to-rose-400" },
  3: { color: "#ef4444", gradient: "from-red-500 to-orange-400" },
  4: { color: "#a855f7", gradient: "from-purple-500 to-violet-400" },
  5: { color: "#f59e0b", gradient: "from-amber-500 to-yellow-400" },
};

function getCleanSongName(songName) {
  if (!songName) return "Unknown";
  let name = songName
    .replace(/[\r\n\t]+/g, " ")                     // normalize newlines/tabs to spaces FIRST
    .replace(/\.(mp3|wav|flac|m4a|ogg)$/i, "")   // remove file extension
    .replace(/[–—]/g, "-");                        // normalize en-dash / em-dash

  // Remove ALL parenthetical & bracket content (noise like Official Video, Lyrics, Audio, etc.)
  // Apply twice to handle nested parens e.g. (Official Video (Short Version))
  name = name.replace(/\([^)]*\)/g, "").replace(/\([^)]*\)/g, "");
  // Also handle unclosed parens/brackets (e.g. "(Audio" with no closing paren)
  name = name.replace(/\([^)]*$/g, "");
  name = name.replace(/\[[^\]]*\]/g, "").replace(/\[[^\]]*$/g, "");

  return name
    .replace(/_/g, " ")                            // underscores → spaces (used as formatting in filenames)
    .replace(/(?<![a-zA-Z])ft\.?\s+/gi, " ft. ")   // normalize standalone "ft" / "ft." only
    .replace(/(?<![a-zA-Z])feat\.?\s+/gi, " ft. ") // normalize standalone "feat" / "feat."
    .replace(/[-\s]+lyrics?\s*$/gi, "")            // strip trailing "Lyrics" / "Lyric"
    .replace(/[-\s]+lyric\s+video\s*$/gi, "")      // strip trailing "Lyric video"
    .replace(/[-\s]+audio\s*$/gi, "")              // strip trailing "Audio"
    .replace(/[-\s]+video\s*$/gi, "")              // strip trailing "video"
    .replace(/\s{2,}/g, " ")                       // collapse multiple spaces
    .trim();
}

function extractTitle(songName, artistName) {
  if (!songName) return "Unknown";
  let clean = getCleanSongName(songName);
  if (artistName) {
    const escaped = artistName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Strip "Artist - " from start (handles various spacing around dash)
    clean = clean.replace(new RegExp(`^${escaped}\\s*-\\s*`, "i"), "").trim();
    // Strip " - Artist" from end (reversed format like "Does It Feel - Charlie Puth")
    clean = clean.replace(new RegExp(`\\s*-\\s*${escaped}$`, "i"), "").trim();
  }
  return clean || "Unknown";
}

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off"); // off, all, one
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("music_favorites")) || [];
    } catch { return []; }
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("music_recent")) || [];
    } catch { return []; }
  });
  const [currentView, setCurrentView] = useState("home");
  const [artistData, setArtistData] = useState([]);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem("music_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Persist recently played
  useEffect(() => {
    localStorage.setItem("music_recent", JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Fetch songs and artists
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [songsRes, artistsRes] = await Promise.all([
          fetch("https://postgre-api.onrender.com/songs"),
          fetch("https://postgre-api.onrender.com/artist"),
        ]);
        if (!songsRes.ok || !artistsRes.ok) throw new Error("Failed to fetch");
        const songsData = await songsRes.json();
        const artistsData = await artistsRes.json();
        setArtistData(artistsData);

        const artistMap = {};
        artistsData.forEach(a => { artistMap[a.id] = a; });

        const enriched = songsData.map(s => {
          const artist = artistMap[s.artist_id];
          const colors = ARTIST_COLORS[s.artist_id] || { color: "#8b5cf6", gradient: "from-purple-500 to-pink-400" };
          return {
            ...s,
            artistName: artist?.name || "Unknown Artist",
            artistColor: colors.color,
            artistGradient: colors.gradient,
            artistImage: artist?.img || null,
            title: extractTitle(s.song_name, artist?.name),
            cleanName: getCleanSongName(s.song_name),
          };
        });
        setSongs(enriched);
        setQueue(enriched);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Update audio progress
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
          setDuration(audioRef.current.duration || 0);
        }
      }, 200);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  // Set volume on audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playSong = useCallback((song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    // Add to recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.song_id !== song.song_id);
      return [song, ...filtered].slice(0, 20);
    });
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
      }
    }, 50);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying, currentSong]);

  const getNextSong = useCallback(() => {
    if (!currentSong || queue.length === 0) return null;
    if (shuffle) {
      let idx;
      do { idx = Math.floor(Math.random() * queue.length); }
      while (idx === queue.findIndex(s => s.song_id === currentSong.song_id) && queue.length > 1);
      return queue[idx];
    }
    const currentIdx = queue.findIndex(s => s.song_id === currentSong.song_id);
    return queue[(currentIdx + 1) % queue.length];
  }, [currentSong, queue, shuffle]);

  const playNext = useCallback(() => {
    const next = getNextSong();
    if (next) playSong(next);
  }, [getNextSong, playSong]);

  const playPrev = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    const currentIdx = queue.findIndex(s => s.song_id === currentSong.song_id);
    const prev = queue[(currentIdx - 1 + queue.length) % queue.length];
    if (prev) playSong(prev);
  }, [currentSong, queue, playSong]);

  const handleEnded = useCallback(() => {
    if (repeat === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else if (repeat === "all" || queue.findIndex(s => s.song_id === currentSong?.song_id) < queue.length - 1) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  }, [repeat, playNext, currentSong, queue]);

  const seekTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const toggleFavorite = useCallback((song) => {
    setFavorites(prev => {
      const exists = prev.find(s => s.song_id === song.song_id);
      if (exists) return prev.filter(s => s.song_id !== song.song_id);
      return [...prev, song];
    });
  }, []);

  const isFavorite = useCallback((songId) => {
    return favorites.some(s => s.song_id === songId);
  }, [favorites]);

  const getArtists = useCallback(() => {
    return artistData.map(a => {
      const colors = ARTIST_COLORS[a.id] || { color: "#8b5cf6", gradient: "from-purple-500 to-pink-400" };
      return {
        id: a.id,
        name: a.name,
        color: colors.color,
        gradient: colors.gradient,
        image: a.img || null,
        songCount: songs.filter(s => s.artist_id === a.id).length,
      };
    });
  }, [songs, artistData]);

  const getSongsByArtist = useCallback((artistId) => {
    return songs.filter(s => s.artist_id === artistId);
  }, [songs]);

  const searchSongs = useCallback((query) => {
    if (!query.trim()) return songs;
    const q = query.toLowerCase();
    return songs.filter(s =>
      s.song_name.toLowerCase().includes(q) ||
      s.artistName.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q)
    );
  }, [songs]);

  const value = {
    songs, loading, error,
    currentSong, isPlaying, shuffle, repeat, volume, progress, duration,
    queue, favorites, recentlyPlayed, currentView,
    audioRef,
    playSong, togglePlay, playNext, playPrev, handleEnded,
    seekTo, setVolume, setShuffle, setRepeat: () => setRepeat(r => r === "off" ? "all" : r === "all" ? "one" : "off"),
    setQueue, toggleFavorite, isFavorite,
    getArtists, getSongsByArtist, searchSongs,
    setCurrentView, repeat_mode: repeat,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="auto"
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}

export default MusicContext;
