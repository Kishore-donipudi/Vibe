import { useState } from "react";
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
  const [currentView, setCurrentView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { loading, error } = useMusic();

  function navigate(view) {
    setCurrentView(view);
    if (view === "search") {
      // keep query
    } else {
      setSearchQuery("");
    }
  }

  function handleSearch(query) {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView("search");
    }
  }

  function renderPage() {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading your music...</p>
          </div>
        </div>
      );
    }
    if (error) {
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

    // Handle artist detail pages
    if (currentView.startsWith("artist-")) {
      const artistId = Number(currentView.split("-")[1]);
      return <ArtistDetailPage artistId={artistId} onNavigate={navigate} />;
    }

    switch (currentView) {
      case "home": return <Homepage onNavigate={navigate} />;
      case "search": return <SearchPage initialQuery={searchQuery} />;
      case "songs": return <AllSongsPage />;
      case "artists": return <ArtistsPage onNavigate={navigate} />;
      case "favorites": return <FavoritesPage />;
      case "recent": return <RecentPage />;
      case "queue": return <QueuePage />;
      case "login": return <LoginPage onNavigate={navigate} />;
      case "signup": return <SignupPage onNavigate={navigate} />;
      case "profile": return <ProfilePage onNavigate={navigate} />;
      default: return <Homepage onNavigate={navigate} />;
    }
  }

  return (
    <div className="min-h-screen bg-[#060609] text-white">
      <Sidebar onNavigate={navigate} activeView={currentView} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`ml-0 md:ml-[72px] transition-all duration-300 ${!sidebarCollapsed ? "lg:ml-[260px]" : "lg:ml-[72px]"}`}>
        <Navbar onSearch={handleSearch} searchQuery={searchQuery} onNavigate={navigate} currentView={currentView} />
        <main className="px-3 sm:px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-20">
          {renderPage()}
        </main>
      </div>
      <PlayerBar onNavigate={navigate} />
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
