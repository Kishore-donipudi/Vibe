import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch, HiX, HiLogout } from "react-icons/hi";
import { useAuth } from "../user_details/AuthContext";
import { useToast } from "./Toast";

function Navbar({ onSearch, searchQuery, currentView }) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const isSearchPage = currentView === "search";

  function handleChange(e) {
    onSearch(e.target.value);
  }

  function handleClear() {
    onSearch("");
    inputRef.current?.focus();
  }

  useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-2xl bg-[#0a0a0f]/80 border-b border-white/5">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 md:py-3">
        {/* Search Bar - hidden when on search page */}
        {!isSearchPage && (
          <div className={`flex items-center gap-2 rounded-2xl px-3 md:px-4 py-2 md:py-2.5 w-full max-w-md transition-all duration-300
            ${focused
              ? "bg-white/10 shadow-lg shadow-fuchsia-500/5"
              : "bg-white/5 hover:bg-white/8"
            }`}
          >
            <HiSearch className={`text-lg shrink-0 transition-colors ${focused ? "text-fuchsia-400" : "text-gray-500"}`} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search songs, artists..."
              className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-500"
            />
            {searchQuery && (
              <button onClick={handleClear} className="text-gray-400 hover:text-white transition-colors">
                <HiX className="text-lg" />
              </button>
            )}
            <kbd className="hidden md:flex items-center gap-0.5 text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded font-mono">
              Ctrl+K
            </kbd>
          </div>
        )}
        {isSearchPage && <div />}

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {user ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shrink-0">
                  {user.profile_img ? (
                    <img src={`data:image/jpeg;base64,${user.profile_img}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {user.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors hidden md:block">
                  {user.username}
                </span>
              </button>
              <button
                onClick={() => { logout(); addToast("You have been logged out.", { type: "logout" }); navigate("/"); }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all hidden sm:block"
                title="Logout"
              >
                <HiLogout className="text-lg" />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

