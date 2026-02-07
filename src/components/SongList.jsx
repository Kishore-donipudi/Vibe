function SongList({ songs, getArtistName }) {
  if (!songs || songs.length === 0) return <p>No songs found.</p>;
  return (
    <ul className="list-disc pl-8">
      {songs.map((song, idx) => (
        <li key={song.song_id || idx} className="mb-4 text-lg text-gray-700">
          <a href={song.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
            {song.song_name}
          </a>
          <span className="ml-2 text-sm text-gray-500">({song.type})</span>
          {" by "}
          <span className="text-blue-700 font-medium">{getArtistName(song.artist_id)}</span>
        </li>
      ))}
    </ul>
  );
}

export default SongList;
