import { useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import { HiPencil, HiCamera, HiTrash, HiLogout, HiCheck, HiX } from "react-icons/hi";

function ProfilePage({ onNavigate }) {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const fileRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    age: user?.age || "",
    gender: user?.gender || "",
  });
  const [previewImg, setPreviewImg] = useState(null);
  const [imgBase64, setImgBase64] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImagePick() {
    fileRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      setPreviewImg(base64Data);
      // Extract just the base64 part (remove data:image/...;base64,)
      const raw = base64Data.split(",")[1];
      setImgBase64(raw);
    };
    reader.readAsDataURL(file);
  }

  function startEdit() {
    setForm({
      username: user?.username || "",
      email: user?.email || "",
      age: user?.age || "",
      gender: user?.gender || "",
    });
    setPreviewImg(null);
    setImgBase64(null);
    setEditing(true);
    setError("");
    setSuccess("");
  }

  function cancelEdit() {
    setEditing(false);
    setPreviewImg(null);
    setImgBase64(null);
    setError("");
  }

  async function handleSave() {
    setError("");
    setSuccess("");
    const updates = {};
    if (form.username !== user.username) updates.username = form.username;
    if (form.email !== user.email) updates.email = form.email;
    if (form.age !== (user.age || "")) updates.age = form.age ? Number(form.age) : null;
    if (form.gender !== (user.gender || "")) updates.gender = form.gender || null;
    if (imgBase64) updates.profile_img = imgBase64;

    if (Object.keys(updates).length === 0) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      await updateProfile(updates);
      setSuccess("Profile updated!");
      setEditing(false);
      setPreviewImg(null);
      setImgBase64(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await deleteAccount();
      onNavigate("home");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    logout();
    onNavigate("home");
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 mb-4">You need to sign in to view your profile</p>
          <button
            onClick={() => onNavigate("login")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const avatarSrc = previewImg || (user.profile_img ? `data:image/jpeg;base64,${user.profile_img}` : null);

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-6">
      {/* Profile Header */}
      <div className="relative rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-purple-600/10 border border-white/5 p-5 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center shadow-xl">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-fuchsia-400">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            {editing && (
              <button
                onClick={handleImagePick}
                className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <HiCamera className="text-2xl text-white" />
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-white">{user.username}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2 sm:mt-3 flex-wrap">
              {user.age && (
                <span className="text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-gray-300">
                  {user.age} years old
                </span>
              )}
              {user.gender && (
                <span className="text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-gray-300 capitalize">
                  {user.gender}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
            {!editing ? (
              <button
                onClick={startEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <HiPencil /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-fuchsia-500 text-sm text-white hover:bg-fuchsia-600 transition-all disabled:opacity-50"
                >
                  <HiCheck /> {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-all"
                >
                  <HiX /> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-400 text-sm mb-4">
          {success}
        </div>
      )}

      {/* Profile Form */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white mb-2">Profile Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Username</label>
            <input
              type="text"
              value={editing ? form.username : user.username || ""}
              onChange={(e) => handleChange("username", e.target.value)}
              disabled={!editing}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 transition-all disabled:opacity-60 disabled:cursor-default"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
            <input
              type="email"
              value={editing ? form.email : user.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!editing}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 transition-all disabled:opacity-60 disabled:cursor-default"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Age</label>
            <input
              type="number"
              min="1"
              max="120"
              value={editing ? form.age : user.age || ""}
              onChange={(e) => handleChange("age", e.target.value)}
              disabled={!editing}
              placeholder="Enter your age"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 transition-all disabled:opacity-60 disabled:cursor-default placeholder-gray-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Gender</label>
            {editing ? (
              <select
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full bg-[#0d0d14] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 transition-all"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <input
                type="text"
                value={user.gender || "Not specified"}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none disabled:opacity-60 disabled:cursor-default capitalize"
              />
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <HiLogout /> Logout
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <HiTrash /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
