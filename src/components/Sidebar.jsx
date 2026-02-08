import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMusic } from "../context/MusicContext";
import {
  HiHome, HiSearch, HiHeart, HiClock, HiMusicNote,
  HiUserGroup, HiChevronLeft, HiChevronRight, HiX, HiMenu,
} from "react-icons/hi";
import { RiPlayListFill } from "react-icons/ri";

// Map view ids to URL paths
const viewToPath = {
  home: "/",
  search: "/search",
  songs: "/songs",
  artists: "/artists",
  favorites: "/favorites",
  recent: "/recent",
  queue: "/queue",
};

function Sidebar({ activeView, collapsed, setCollapsed }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { favorites, recentlyPlayed, getArtists } = useMusic();
  const artists = getArtists();
  const navigate = useNavigate();

  const navItems = [
    { id: "home", label: "Home", icon: HiHome },
    { id: "search", label: "Search", icon: HiSearch },
    { id: "songs", label: "All Songs", icon: HiMusicNote },
    { id: "artists", label: "Artists", icon: HiUserGroup },
    { id: "favorites", label: "Favorites", icon: HiHeart, badge: favorites.length },
    { id: "recent", label: "Recently Played", icon: HiClock, badge: recentlyPlayed.length },
    { id: "queue", label: "Queue", icon: RiPlayListFill },
  ];

  // Bottom bar items for mobile (only key items)
  const mobileItems = [
    { id: "home", label: "Home", icon: HiHome },
    { id: "search", label: "Search", icon: HiSearch },
    { id: "favorites", label: "Favorites", icon: HiHeart },
    { id: "recent", label: "Recent", icon: HiClock },
  ];

  function handleNav(id) {
    navigate(viewToPath[id] || `/${id}`);
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile bottom tab bar - visible on small screens only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0a0f]/95 backdrop-blur-2xl border-t border-white/5">
        <div className="flex items-center justify-around px-2 py-1.5">
          {mobileItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px]
                  ${isActive ? "text-fuchsia-400" : "text-gray-500"}
                `}
              >
                <Icon className="text-xl" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          {/* More button opens full sidebar */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-gray-500 min-w-[56px]"
          >
            <HiMenu className="text-xl" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-[#0a0a0f] border-r border-white/5 flex flex-col animate-slide-in-left overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
              <button onClick={() => { navigate("/"); setMobileOpen(false); }} className="flex items-center gap-2 cursor-pointer">
                <div className="w-9 h-9 rounded-full overflow-hidden shadow-lg shadow-fuchsia-500/20">
                  <img src={import.meta.env.BASE_URL + "favicon.png"} alt="Vibe" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                  Vibe
                </span>
              </button>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
                <HiX className="text-xl" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-2">
              <p className="px-3 py-2 text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Menu</p>
              <div className="space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
                        ${isActive
                          ? "bg-gradient-to-r from-fuchsia-500/20 to-purple-500/10 text-fuchsia-400"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-fuchsia-500 rounded-r-full" />}
                      <Icon className={`text-lg ${isActive ? "text-fuchsia-400" : ""}`} />
                      <span>{item.label}</span>
                      {item.badge > 0 && (
                        <span className="ml-auto text-[10px] bg-fuchsia-500/20 text-fuchsia-400 px-1.5 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {artists.length > 0 && (
                <div className="mt-6">
                  <p className="px-3 py-2 text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Artists</p>
                  <div className="space-y-1">
                    {artists.map(artist => (
                      <button
                        key={artist.id}
                        onClick={() => { navigate(`/artist/${artist.id}`); setMobileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <img src={artist.image} alt={artist.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                          onError={e => { e.target.style.display = 'none'; }} />
                        <span className="truncate">{artist.name}</span>
                        <span className="ml-auto text-[10px] text-gray-600">{artist.songCount}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop sidebar — hidden on mobile, icon-only on md, full on lg */}
      <aside className={`hidden md:flex fixed left-0 top-0 h-full z-40 flex-col transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "lg:w-[260px] w-[72px]"}
        bg-gradient-to-b from-[#0a0a0f] via-[#111118] to-[#0a0a0f]
        border-r border-white/5`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center px-3 py-5 border-b border-white/5">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 rounded-full overflow-hidden shadow-lg shadow-fuchsia-500/20 shrink-0">
              <img src={import.meta.env.BASE_URL + "favicon.png"} alt="Vibe" className="w-full h-full object-cover" />
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap
              ${collapsed ? "hidden" : "hidden lg:inline"}`}>
              Vibe
            </span>
          </button>
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors
              ${collapsed ? "ml-0 mt-2" : "ml-auto hidden lg:block"}`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <HiChevronRight className="text-lg" /> : <HiChevronLeft className="text-lg" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto scrollbar-thin pb-20">
          <div className="space-y-1">
            <p className={`px-3 py-2 text-[10px] font-semibold tracking-widest text-gray-500 uppercase ${collapsed ? "hidden" : "hidden lg:block"}`}>Menu</p>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const isExpanded = !collapsed;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(viewToPath[item.id] || `/${item.id}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                    ${isActive
                      ? "bg-gradient-to-r from-fuchsia-500/20 to-purple-500/10 text-fuchsia-400 shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                    ${(collapsed || true) ? "justify-center lg:justify-start" : ""}
                    ${isExpanded ? "lg:justify-start" : ""}
                  `}
                  title={item.label}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-fuchsia-500 rounded-r-full" />
                  )}
                  <Icon className={`text-lg flex-shrink-0 ${isActive ? "text-fuchsia-400" : "group-hover:text-fuchsia-400"} transition-colors`} />
                  <span className={`${collapsed ? "hidden" : "hidden lg:inline"}`}>{item.label}</span>
                  {!collapsed && item.badge > 0 && (
                    <span className="ml-auto text-[10px] bg-fuchsia-500/20 text-fuchsia-400 px-1.5 py-0.5 rounded-full font-bold hidden lg:inline">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Artists Quick Access */}
          {!collapsed && artists.length > 0 && (
            <div className="mt-6 hidden lg:block">
              <p className="px-3 py-2 text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Artists</p>
              <div className="space-y-1">
                {artists.map(artist => (
                  <button
                    key={artist.id}
                    onClick={() => navigate(`/artist/${artist.id}`)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                  >
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-fuchsia-500/50 transition-all"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span className="truncate">{artist.name}</span>
                    <span className="ml-auto text-[10px] text-gray-600">{artist.songCount}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
