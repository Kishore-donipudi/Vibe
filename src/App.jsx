import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { MusicProvider, useMusic } from "./context/MusicContext";
import { AuthProvider } from "./user_details/AuthContext";
import { ToastProvider } from "./components/Toast";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import PlayerBar from "./components/PlayerBar";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import ArtistsPage from "./pages/ArtistsPage";
import ArtistDetailPage from "./pages/ArtistDetailPage";
import AllSongsPage from "./pages/AllSongsPage";
import RecentPage from "./pages/RecentPage";
import QueuePage from "./pages/QueuePage";
import LoginPage from "./user_details/LoginPage";
import SignupPage from "./user_details/SignupPage";
import ProfilePage from "./user_details/ProfilePage";

function AppContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { loading, error } = useMusic();
  const navigate = useNavigate();
  const location = useLocation();

  // Derive activeView from current path for sidebar highlighting
  const path = location.pathname;
  const activeView = path.startsWith("/artist/") ? `artist-${path.split("/artist/")[1]}`
    : path === "/" || path === "" ? "home"
    : path.replace("/", "");

  function handleSearch(query) {
    setSearchQuery(query);
    if (query.trim()) {
      navigate("/search");
    }
  }

  function renderLoading() {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your music...</p>
        </div>
      </div>
    );
  }

  function renderError() {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold mb-2">Something went wrong</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-xl bg-fuchsia-500 text-white text-sm font-semibold hover:bg-fuchsia-600 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const content = loading ? renderLoading() : error ? renderError() : null;

  return (
    <div className="min-h-screen bg-[#060609] text-white">
      <Sidebar activeView={activeView} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`ml-0 md:ml-[72px] transition-all duration-300 ${!sidebarCollapsed ? "lg:ml-[260px]" : "lg:ml-[72px]"}`}>
        <Navbar onSearch={handleSearch} searchQuery={searchQuery} currentView={activeView} />
        <main className="px-3 sm:px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-20">
          {content || (
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/songs" element={<AllSongsPage />} />
              <Route path="/search" element={<SearchPage initialQuery={searchQuery} />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/artist/:id" element={<ArtistDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/recent" element={<RecentPage />} />
              <Route path="/queue" element={<QueuePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Homepage />} />
            </Routes>
          )}
        </main>
      </div>
      <PlayerBar />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MusicProvider>
          <AppContent />
        </MusicProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
