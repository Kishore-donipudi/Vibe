import { useState, useRef, useEffect, useCallback } from "react";
import { useMusic } from "../context/MusicContext";
import { useToast } from "./Toast";
import {
  HiPlay, HiPause, HiHeart, HiVolumeUp, HiVolumeOff,
  HiChevronDown, HiChevronUp,
} from "react-icons/hi";
import {
  BsShuffle, BsRepeat, BsRepeat1, BsSkipStartFill, BsSkipEndFill,
  BsSoundwave, BsMusicNoteList,
} from "react-icons/bs";
import { IoMusicalNotes } from "react-icons/io5";

// ─── LYRICS DATABASE ───
const LYRICS_DB = {
  // Arijit Singh songs
  "Tum Hi Ho": `Hum tere bin ab reh nahi sakte
Tere bina kya wajood mera
Tujhse juda agar ho jaayenge
Toh khud se hi ho jaayenge judaa

Kyunki tum hi ho
Ab tum hi ho
Zindagi ab tum hi ho
Chain bhi, mera dard bhi
Meri aashiqui ab tum hi ho

Tera mera rishta hai kaisa
Ik pal door gawara nahi
Tere liye har roz hai jeete
Tujh ko diya mera waqt sabhi

Koi aur nahi zubaani
Tum hi ho, tum hi ho
Teri galiyon mein na chodenge kabhi
Ae khuda humne yeh maana hai
Tum hi ho, ab tum hi ho`,

  "Kesariya": `Kesariya tera ishq hai piya
Rang jaaun jo main haath lagaaun
Kesariya tera ishq hai piya

O ranjha re tu ranjha
Ve tu ranjha re tu ranjha
Ishq tera pura pura
Ve tu ranjha re tu ranjha

Chhup jaana chahe koi
Dhoondh le teri khushboo
Tujhme mila jo sukoon
Kyun tujhse door rahoon`,

  "Chaleya": `Main tenu chhadd ke kithhe jaavan
Main tenu chhadd ke ki labhan
Jo tu naa miley meriya heeriye
Main jee ke vi mar jaavan

Chaleya chaleya
Chaleya tere mere pyaar vich
Chaleya chaleya

Dil mere dil tu jaaniye
Tere bin dil mera naa maane
Main tenu chhadd ke kithhe jaavan
Main tenu chhadd ke ki labhan`,

  "Apna Bana Le": `Tu mera hai ya nahi
Meri khabar tu le raha
Main bhi hoon tera hi sahi
Dil ki kahani keh raha

Apna bana le piya
Apna bana le
Tere bin mera koi nahi
Apna bana le

Teri meri yeh zindagi
Ik duje ke waste hai
Dil mein tera name likha
Aur koi na basaye`,

  "Phir Aur Kya Chahiye": `Phir aur kya chahiye
Tujhe mere hoke
Phir aur kya chahiye
Rahe jo yun
Phir aur kya chahiye

Tere ishq mein mera haal naa pooch
Kho gaye hain hum to yun
Ke pata nahi kahan hai zameen
Kahan aasmaan hai`,

  // Jubin Nautiyal songs
  "Lut Gaye": `Aankh uthi mohabbat ne angrai li
Dil ka sauda hua chandni raat mein
Aankh uthi mohabbat ne angrai li

Lut gaye hum toh pehli mulaqaat mein
Lut gaye, lut gaye, lut gaye, oh
Lut gaye hum toh pehli mulaqaat mein

Hum jo chalne lage
Chalne lage
Hain yeh raastey
Tere mere ho gaye`,

  "Raataan Lambiyan": `Taare ne mujhe ye khat likha
Ke tera mere naal naseeba judh gaya
Duniya ne mujhe yun to bahut mila
Par tera muskurana sab pe bhaari aa gaya

Raataan lambiyan
O lambiyan lambiyan raataan bulaave tujhe
Mere kol aaja

Raataan lambiyan
O lambiyan lambiyan raataan bulaave tujhe`,

  "Manike Mage Hithe": `Manike mage hithe
Manike mage hithe
Sathpethiyo sadha etha
Saragaye athe

O mera jiya mera jiya
O mera jiya mera jiya
Tum se hi tum se hi
Main ne seekha jeena`,

  // Anirudh songs
  "Aradhya": `Aradhya Aradhya
Tu meri Aradhya
Tera chehra chaand sa
Tu meri Aradhya

Dil ko chu le teri baatein
Roshan ho jaayein raatein
Tere sang zindagi
Ik nayi kahani likhein

Aradhya Aradhya
Tu meri Aradhya`,

  "Why This Kolaveri Di": `Why this kolaveri kolaveri kolaveri di
Why this kolaveri kolaveri kolaveri di

Rhythm correct
Why this kolaveri di

Distance la moon-u moon-u
Moon-u color-u white-u
White background night-u night-u
Night-u color-u black-u`,

  // Pritam songs
  "Ve Kamleya": `Ve kamleya ve kamleya
Kya kar diya re tune
Ve kamleya ve kamleya
Dil le gaya re tune

Hum jo chalne lage
Teri raahon mein
Khud ko bhula diya
Tere baahon mein`,

  "Channa Ve": `Puchheya na kar mainu
Mere sapne kadon aane ne
Rog diya dawaaiyaan
Bas tera pyaar hai mere layi

Channa ve channa ve
Channa ve channa ve
Sajna ve sajna ve
Dil todna nahi`,

  // Devi Sri Prasad songs
  "Srivalli": `Srivalli Srivalli Srivalli
Srivalli Srivalli Srivalli

Kannu munde aago naa ninne
Kannu munde aago naa ninne
Manasu munde nee iruve
Naa ninne koraadhe manadha

Srivalli Srivalli oh
Sara riri riri raa
Sara riri riri raa raa raa`,

  "Arabic Kuthu": `Halamithi habibo
Arabic kuthu arabic kuthu
Halamithi habibo

En uyire uyire na un uyire
Un uyire uyire na en uyire
Yele yele yele
Arabic kuthu podunga`,
};

function getLyricsForSong(title) {
  if (!title) return null;
  const t = title.trim();
  // Direct match
  if (LYRICS_DB[t]) return LYRICS_DB[t];
  // Case-insensitive partial match
  const lower = t.toLowerCase();
  for (const [key, val] of Object.entries(LYRICS_DB)) {
    if (key.toLowerCase() === lower) return val;
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) return val;
  }
  return null;
}

function PlayerBar({ onNavigate }) {
  const {
    currentSong, isPlaying, togglePlay, playNext, playPrev,
    shuffle, setShuffle, repeat_mode, setRepeat,
    volume, setVolume, progress, duration, seekTo,
    toggleFavorite, isFavorite,
  } = useMusic();
  const { addToast } = useToast();

  const [showVolume, setShowVolume] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedDragging, setExpandedDragging] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const progressRef = useRef(null);
  const expandedProgressRef = useRef(null);

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = useCallback((e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = x / rect.width;
    seekTo(pct * duration);
  }, [duration, seekTo]);

  const handleProgressDrag = useCallback((e) => {
    if (!isDragging || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = x / rect.width;
    seekTo(pct * duration);
  }, [isDragging, duration, seekTo]);

  const handleExpandedProgressClick = useCallback((e) => {
    if (!expandedProgressRef.current || !duration) return;
    const rect = expandedProgressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = x / rect.width;
    seekTo(pct * duration);
  }, [duration, seekTo]);

  const handleExpandedProgressDrag = useCallback((e) => {
    if (!expandedDragging || !expandedProgressRef.current || !duration) return;
    const rect = expandedProgressRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = x / rect.width;
    seekTo(pct * duration);
  }, [expandedDragging, duration, seekTo]);

  useEffect(() => {
    if (isDragging) {
      const up = () => setIsDragging(false);
      window.addEventListener("mouseup", up);
      window.addEventListener("mousemove", handleProgressDrag);
      return () => {
        window.removeEventListener("mouseup", up);
        window.removeEventListener("mousemove", handleProgressDrag);
      };
    }
  }, [isDragging, handleProgressDrag]);

  useEffect(() => {
    if (expandedDragging) {
      const up = () => setExpandedDragging(false);
      window.addEventListener("mouseup", up);
      window.addEventListener("touchend", up);
      window.addEventListener("mousemove", handleExpandedProgressDrag);
      window.addEventListener("touchmove", handleExpandedProgressDrag);
      return () => {
        window.removeEventListener("mouseup", up);
        window.removeEventListener("touchend", up);
        window.removeEventListener("mousemove", handleExpandedProgressDrag);
        window.removeEventListener("touchmove", handleExpandedProgressDrag);
      };
    }
  }, [expandedDragging, handleExpandedProgressDrag]);

  // Prevent body scroll when expanded
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [expanded]);

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 h-12 md:h-14 bg-[#0a0a0f]/95 backdrop-blur-2xl border-t border-white/5 flex items-center justify-center mb-14 md:mb-0">
        <p className="text-gray-600 text-xs flex items-center gap-2">
          <BsSoundwave className="text-base" />
          <span className="hidden sm:inline">Select a song to start playing</span>
          <span className="sm:hidden">Tap a song to play</span>
        </p>
      </div>
    );
  }

  const pct = duration > 0 ? (progress / duration) * 100 : 0;
  const fav = isFavorite(currentSong.song_id);

  const handleArtistClick = () => {
    if (currentSong?.artist_id && onNavigate) {
      setExpanded(false);
      onNavigate(`artist-${currentSong.artist_id}`);
    }
  };

  const handleFav = (e) => {
    if (e) e.stopPropagation();
    const wasFav = isFavorite(currentSong.song_id);
    toggleFavorite(currentSong);
    if (!wasFav) {
      addToast(`"${currentSong.title}" added to favorites`, { type: "favorite" });
    } else {
      addToast(`Removed from favorites`, { type: "unfavorite", duration: 2000 });
    }
  };

  const lyrics = getLyricsForSong(currentSong.title);

  // ─── EXPANDED / MAXIMIZED PLAYER ───
  if (expanded) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col animate-player-expand">
        {/* Background with blurred album art */}
        <div className="absolute inset-0 bg-[#060609]">
          {currentSong.artistImage && (
            <img
              src={currentSong.artistImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-3xl scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#060609]/80 to-[#060609]" />
        </div>

        {/* Content — scrollable */}
        <div className="relative z-10 flex flex-col h-full overflow-y-auto">
          <div className="flex flex-col px-5 sm:px-8 md:px-16 lg:px-24 xl:px-32 max-w-3xl mx-auto w-full py-2">
            {/* Top bar - Collapse button */}
            <div className="flex items-center justify-between py-2 sm:py-3 shrink-0">
              <button
                onClick={() => setExpanded(false)}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-all duration-200 active:scale-90 hover:shadow-lg hover:shadow-white/5"
                title="Minimize"
              >
                <HiChevronDown className="text-xl" />
              </button>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Now Playing</p>
              <div className="w-10" />
            </div>

            {/* Album Art — fixed size, properly spaced */}
            <div className="flex items-center justify-center py-4 sm:py-6 shrink-0">
              <div className={`w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/50
                ${isPlaying ? "shadow-fuchsia-500/10" : ""}`}
              >
                {currentSong.artistImage ? (
                  <img src={currentSong.artistImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-fuchsia-500/30 to-purple-500/30 flex items-center justify-center">
                    <BsSoundwave className="text-fuchsia-400/50 text-5xl sm:text-6xl" />
                  </div>
                )}
              </div>
            </div>

            {/* Song Info + Favorite */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 shrink-0">
              <div className="min-w-0 flex-1 mr-3">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{currentSong.title}</h2>
                <button
                  onClick={handleArtistClick}
                  className="text-sm sm:text-base text-gray-400 hover:text-fuchsia-400 truncate mt-0.5 transition-colors text-left"
                >
                  {currentSong.artistName}
                </button>
              </div>
              <button
                onClick={handleFav}
                className={`p-3 rounded-2xl backdrop-blur-sm transition-all duration-200 active:scale-90
                  ${fav
                    ? "text-fuchsia-400 bg-fuchsia-400/15 shadow-lg shadow-fuchsia-500/10"
                    : "text-gray-500 bg-white/5 hover:bg-white/10 hover:text-fuchsia-400"}`}
                title={fav ? "Remove from Favorites" : "Add to Favorites"}
              >
                <HiHeart className={`text-xl sm:text-2xl ${fav ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 sm:mb-5 shrink-0">
              <div
                ref={expandedProgressRef}
                className="h-1.5 sm:h-2 cursor-pointer group relative rounded-full overflow-hidden"
                onClick={handleExpandedProgressClick}
                onMouseDown={() => setExpandedDragging(true)}
                onTouchStart={() => setExpandedDragging(true)}
              >
                <div className="absolute inset-0 bg-white/10 rounded-full" />
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full transition-[width] duration-100"
                  style={{ width: `${pct}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${pct}% - 8px)` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs text-gray-500">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5 shrink-0">
              <button
                onClick={() => setShuffle(s => !s)}
                className={`relative p-3 rounded-2xl backdrop-blur-sm transition-all duration-200 active:scale-90
                  ${shuffle
                    ? "text-fuchsia-400 bg-fuchsia-400/15 shadow-lg shadow-fuchsia-500/10"
                    : "text-gray-500 bg-white/5 hover:bg-white/10 hover:text-white"}`}
                title={shuffle ? "Shuffle On" : "Shuffle Off"}
              >
                <BsShuffle className="text-lg sm:text-xl" />
                {shuffle && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-fuchsia-400" />}
              </button>
              <button
                onClick={playPrev}
                className="p-3 rounded-2xl text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-90"
                title="Previous"
              >
                <BsSkipStartFill className="text-2xl sm:text-3xl" />
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-fuchsia-500/25"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <HiPause className="text-white text-lg sm:text-xl" />
                ) : (
                  <HiPlay className="text-white text-lg sm:text-xl ml-0.5" />
                )}
              </button>
              <button
                onClick={playNext}
                className="p-3 rounded-2xl text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-90"
                title="Next"
              >
                <BsSkipEndFill className="text-2xl sm:text-3xl" />
              </button>
              <button
                onClick={setRepeat}
                className={`relative p-3 rounded-2xl backdrop-blur-sm transition-all duration-200 active:scale-90
                  ${repeat_mode !== "off"
                    ? "text-fuchsia-400 bg-fuchsia-400/15 shadow-lg shadow-fuchsia-500/10"
                    : "text-gray-500 bg-white/5 hover:bg-white/10 hover:text-white"}`}
                title={`Repeat: ${repeat_mode}`}
              >
                {repeat_mode === "one" ? <BsRepeat1 className="text-lg sm:text-xl" /> : <BsRepeat className="text-lg sm:text-xl" />}
                {repeat_mode !== "off" && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-fuchsia-400" />}
              </button>
            </div>

            {/* Volume + Lyrics toggle */}
            <div className="flex items-center gap-3 justify-center mb-4 sm:mb-5 shrink-0">
              <button
                onClick={() => setVolume(v => v > 0 ? 0 : 0.7)}
                className="p-2 rounded-xl text-gray-400 hover:text-white transition-all duration-200"
                title={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? <HiVolumeOff className="text-base" /> : <HiVolumeUp className="text-base" />}
              </button>
              <div className="relative w-32 sm:w-40 h-1.5 rounded-full bg-white/10 cursor-pointer group">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-500 to-purple-400 rounded-full transition-[width] duration-100"
                  style={{ width: `${volume * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md shadow-fuchsia-500/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ left: `calc(${volume * 100}% - 6px)` }}
                />
              </div>
              <button
                onClick={() => setShowLyrics(l => !l)}
                className={`p-2 rounded-xl transition-all duration-200
                  ${showLyrics
                    ? "text-fuchsia-400 bg-fuchsia-400/15"
                    : "text-gray-400 hover:text-white"}`}
                title="Lyrics"
              >
                <IoMusicalNotes className="text-base" />
              </button>
            </div>

            {/* Lyrics Section */}
            {showLyrics && (
              <div className="mb-6 sm:mb-8 shrink-0 rounded-2xl bg-white/5 border border-white/5 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <IoMusicalNotes className="text-fuchsia-400" />
                  <h3 className="text-sm font-semibold text-white">Lyrics</h3>
                </div>
                {lyrics ? (
                  <div className="max-h-48 sm:max-h-64 overflow-y-auto scrollbar-thin pr-2">
                    <p className="text-sm sm:text-base text-gray-300 whitespace-pre-line leading-relaxed">
                      {lyrics}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <IoMusicalNotes className="text-3xl text-gray-700 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Lyrics not available for this song</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── MINI / DEFAULT PLAYER ───
  return (
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-50">
      {/* Mobile mini player — sleek card style */}
      <div className="md:hidden bg-[#111118]/95 backdrop-blur-2xl border-t border-white/[0.04]">
        {/* Thin inline progress on top edge */}
        <div
          ref={progressRef}
          className="h-[3px] cursor-pointer relative"
          onClick={handleProgressClick}
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="absolute inset-0 bg-white/[0.06]" />
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-500 to-purple-400 transition-[width] duration-150"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer"
          onClick={() => setExpanded(true)}
        >
          {/* Album art */}
          <div className={`w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-fuchsia-500/30 to-purple-500/30
            ${isPlaying ? "ring-1 ring-fuchsia-500/30" : ""}`}
          >
            {currentSong.artistImage ? (
              <img src={currentSong.artistImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BsSoundwave className="text-fuchsia-400/50 text-sm" />
              </div>
            )}
          </div>
          {/* Song info */}
          <div className="min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
            <p className="text-[13px] font-semibold text-white truncate leading-tight">{currentSong.title}</p>
            <button
              onClick={(e) => { e.stopPropagation(); handleArtistClick(); }}
              className="text-[10px] text-gray-500 truncate block hover:text-fuchsia-400 transition-colors leading-tight"
            >
              {currentSong.artistName}
            </button>
          </div>
          {/* Action buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); handleFav(e); }}
            className={`p-1.5 rounded-xl transition-all duration-200 shrink-0
              ${fav ? "text-fuchsia-400 bg-fuchsia-400/15" : "text-gray-600 hover:text-fuchsia-400 hover:bg-white/10"}`}
            title={fav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <HiHeart className={`text-sm ${fav ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shrink-0 active:scale-90 transition-all duration-200 shadow-md shadow-fuchsia-500/20"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <HiPause className="text-white text-xs" /> : <HiPlay className="text-white text-xs ml-0.5" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); playNext(); }}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 shrink-0"
            title="Next"
          >
            <BsSkipEndFill className="text-sm" />
          </button>
        </div>
      </div>

      {/* Desktop player — redesigned with inline progress */}
      <div className="hidden md:block bg-[#0c0c14]/95 backdrop-blur-2xl border-t border-white/[0.04]">
        <div className="flex items-center gap-4 px-4 py-1.5">
          {/* Left - Song Info (clickable to expand) */}
          <div
            className="flex items-center gap-3 w-64 min-w-0 cursor-pointer group/info shrink-0"
            onClick={() => setExpanded(true)}
          >
            <div className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-fuchsia-500/30 to-purple-500/30 transition-transform group-hover/info:scale-105
              ${isPlaying ? "ring-1 ring-fuchsia-500/30" : ""}`}
            >
              {currentSong.artistImage ? (
                <img src={currentSong.artistImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BsSoundwave className="text-fuchsia-400/50" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover/info:text-fuchsia-300 transition-colors leading-tight">{currentSong.title}</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleArtistClick(); }}
                className="text-[11px] text-gray-500 truncate block hover:text-fuchsia-400 transition-colors leading-tight"
              >
                {currentSong.artistName}
              </button>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleFav(e); }}
              className={`p-1.5 rounded-xl transition-all duration-200 shrink-0
                ${fav ? "text-fuchsia-400 bg-fuchsia-400/15" : "text-gray-600 hover:text-fuchsia-400 hover:bg-white/10"}`}
              title={fav ? "Remove from Favorites" : "Add to Favorites"}
            >
              <HiHeart className={`text-sm ${fav ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Center - Controls + Progress */}
          <div className="flex-1 flex flex-col items-center gap-0.5 max-w-xl mx-auto">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShuffle(s => !s)}
                className={`relative p-1.5 rounded-lg transition-all duration-200
                  ${shuffle
                    ? "text-fuchsia-400 bg-fuchsia-400/15"
                    : "text-gray-500 hover:text-white hover:bg-white/10"}`}
                title="Shuffle"
              >
                <BsShuffle className="text-xs" />
                {shuffle && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-fuchsia-400" />}
              </button>
              <button
                onClick={playPrev}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90"
                title="Previous"
              >
                <BsSkipStartFill className="text-base" />
              </button>
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg shadow-fuchsia-500/25"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <HiPause className="text-white text-xs" />
                ) : (
                  <HiPlay className="text-white text-xs ml-0.5" />
                )}
              </button>
              <button
                onClick={playNext}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90"
                title="Next"
              >
                <BsSkipEndFill className="text-base" />
              </button>
              <button
                onClick={setRepeat}
                className={`relative p-1.5 rounded-lg transition-all duration-200
                  ${repeat_mode !== "off"
                    ? "text-fuchsia-400 bg-fuchsia-400/15"
                    : "text-gray-500 hover:text-white hover:bg-white/10"}`}
                title={`Repeat: ${repeat_mode}`}
              >
                {repeat_mode === "one" ? <BsRepeat1 className="text-xs" /> : <BsRepeat className="text-xs" />}
                {repeat_mode !== "off" && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-fuchsia-400" />}
              </button>
            </div>
            {/* Inline progress */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-[10px] text-gray-600 w-8 text-right tabular-nums">{formatTime(progress)}</span>
              <div
                className="flex-1 h-1 cursor-pointer group relative rounded-full"
                onClick={handleProgressClick}
                onMouseDown={() => setIsDragging(true)}
                ref={progressRef}
              >
                <div className="absolute inset-0 bg-white/[0.06] rounded-full" />
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-500 to-purple-400 rounded-full transition-[width] duration-100"
                  style={{ width: `${pct}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${pct}% - 5px)` }}
                />
              </div>
              <span className="text-[10px] text-gray-600 w-8 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right - Volume & Queue */}
          <div className="flex items-center gap-1.5 w-48 justify-end shrink-0">
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200" title="Queue">
              <BsMusicNoteList className="text-xs" />
            </button>
            <div className="flex items-center gap-1.5 relative group/vol" onMouseEnter={() => setShowVolume(true)} onMouseLeave={() => setShowVolume(false)}>
              <button
                onClick={() => setVolume(v => v > 0 ? 0 : 0.7)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
                title={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? <HiVolumeOff className="text-sm" /> : <HiVolumeUp className="text-sm" />}
              </button>
              <div className={`transition-all duration-300 overflow-hidden ${showVolume ? "w-24 opacity-100" : "w-0 opacity-0"}`}>
                <div className="relative w-full h-1 rounded-full bg-white/10 cursor-pointer group">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-500 to-purple-400 rounded-full transition-[width] duration-100"
                    style={{ width: `${volume * 100}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={e => setVolume(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-sm shadow-fuchsia-500/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `calc(${volume * 100}% - 4px)` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerBar;
