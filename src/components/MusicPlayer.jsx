import { useState, useRef } from "react";

function MusicPlayer({ songs, artists }) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!songs || songs.length === 0) return null;
  const song = songs[current];
  const artist = artists?.find(a => a.id === song.artist_id);

  const handlePlay = () => {
    setIsPlaying(true);
    audioRef.current?.play();
  };
  const handlePause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };
  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % songs.length);
    setIsPlaying(false);
  };
  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center mb-10">
      <div className="flex flex-col items-center mb-4">
        {artist?.img && (
          <img src={artist.img} alt={artist.name} className="w-32 h-32 rounded-full object-cover mb-2 border-4 border-blue-200" />
        )}
        <div className="text-xl font-bold text-blue-700">{song.song_name}</div>
        <div className="text-md text-gray-600">{artist ? artist.name : 'Unknown Artist'}</div>
      </div>
      <audio
        ref={audioRef}
        src={song.url}
        controls
        className="w-full mb-4"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="flex gap-6 items-center">
        <button onClick={handlePrev} className="px-4 py-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold">&#8592; Prev</button>
        {isPlaying ? (
          <button onClick={handlePause} className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-bold">Pause</button>
        ) : (
          <button onClick={handlePlay} className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-bold">Play</button>
        )}
        <button onClick={handleNext} className="px-4 py-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold">Next &#8594;</button>
      </div>
    </div>
  );
}

export default MusicPlayer;
