import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, Mic, PlusCircle, Filter, Upload, X,
  LogIn, LogOut, Mail, Lock, UserPlus, User, Star, Crown, ShieldCheck, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_META } from '../constants/data';

const ICON_MAP = { User, Star, Crown, ShieldCheck };

export default function Header({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  onAddNewTrack
}) {
  const { isAuthenticated, profile, user, signIn, signUp, signOut, refreshProfile } = useAuth();

  const [isListening, setIsListening] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSinger, setNewSinger] = useState('');
  const [newFilm, setNewFilm] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // --- Auth Modal State ---
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Brauzeriniz səsli axtarışı dəstəkləmir.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'az-AZ';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      if (activeTab !== 'music' && activeTab !== 'feed') {
        setActiveTab('music');
      }
    };

    recognition.start();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!newTitle.trim()) return;

    if (!isAuthenticated) {
      setShowAddModal(false);
      setAuthMode('signin');
      setShowAuthModal(true);
      return;
    }

    let fileUrl = '';
    if (selectedFile) {
      fileUrl = URL.createObjectURL(selectedFile);
    }

    if (onAddNewTrack) {
      await onAddNewTrack({
        title: newTitle,
        singer: newSinger.trim() || 'MeloDaily',
        film: newFilm || 'Klassik',
        caption: newCaption.trim(),
        file: selectedFile,
        audioUrl: fileUrl
      });
    }

    setNewTitle('');
    setNewSinger('');
    setNewFilm('');
    setNewCaption('');
    setSelectedFile(null);
    setShowAddModal(false);
  };

  // --- Auth Handlers ---
  const resetAuthForm = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthUsername('');
    setAuthName('');
    setAuthError('');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        if (!authUsername.trim() || !authName.trim()) {
          setAuthError('Ad və istifadəçi adı mütləqdir.');
          setAuthLoading(false);
          return;
        }
        const { error, needsEmailConfirmation } = await signUp({
          email: authEmail,
          password: authPassword,
          username: authUsername.trim(),
          name: authName.trim(),
        });
        if (error) {
          setAuthError(error.message);
        } else if (needsEmailConfirmation) {
          setAuthError('');
          alert('Qeydiyyat uğurludur! E-poçtunuza gələn təsdiq linkinə klikləyib sonra daxil olun.');
          setShowAuthModal(false);
          resetAuthForm();
        } else {
          setShowAuthModal(false);
          resetAuthForm();
        }
      } else {
        const { error } = await signIn({ email: authEmail, password: authPassword });
        if (error) {
          setAuthError(error.message);
        } else {
          if (refreshProfile) refreshProfile();
          setShowAuthModal(false);
          resetAuthForm();
        }
      }
    } catch (err) {
      setAuthError('Gözlənilməz xəta baş verdi. Yenidən cəhd edin.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const roleMeta = ROLE_META?.[profile?.role] || ROLE_META?.listener;
  const RoleIcon = ICON_MAP[roleMeta?.icon] || User;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#2A211F]/95 border-b border-[#C5A059]/30 backdrop-blur-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Logo & Slogan */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#C5A059]/40 bg-[#2A211F] shadow-md flex items-center justify-center shrink-0">
                <img
                  src="/logo.jpg?v=2"
                  alt="MeloDaily Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Loqo yüklənmədi:", e.target.src);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-wide text-[#F7F3ED] leading-none">
                  Melo<span className="text-[#C5A059]">Daily</span>
                </span>
                <span className="text-[10px] text-[#D8BD84] font-medium tracking-wider mt-0.5">
                  Milli Sosial & Musiqi Platforması
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="md:hidden p-2 text-[#C5A059]"
              title="Paylaşım / Musiqi əlavə et"
            >
              <PlusCircle size={22} />
            </button>
          </div>

          {/* Tab Menyu */}
          <nav className="flex items-center gap-1 bg-[#362A27] p-1 rounded-xl border border-stone-800 text-xs font-medium overflow-x-auto max-w-full">
            {[
              { id: 'home', label: 'Əsas' },
              { id: 'feed', label: 'Lenta (Sosial)' },
              { id: 'music', label: 'Audio Pleyer' },
              { id: 'radio', label: 'Canlı Radio' },
              { id: 'together', label: 'Birlikdə' },
              { id: 'profile', label: 'Profil' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-[#C5A059] text-[#2A211F] font-bold shadow'
                    : 'text-[#D8BD84] hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Axtarış xanası + Səsli Axtarış Düyməsi */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Mahnı və ya müğənni axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl pl-9 pr-9 py-1.5 text-xs text-[#F7F3ED] placeholder-stone-400 focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute right-2.5 top-2 transition p-0.5 rounded-md ${
                  isListening ? 'text-red-500 animate-pulse bg-red-500/20' : 'text-[#C5A059] hover:text-white'
                }`}
                title="Səslə axtar"
              >
                <Mic size={15} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-xl bg-[#362A27] border border-stone-700/60 text-[#D8BD84] hover:text-white transition"
              title="Filtrlər"
            >
              <Filter size={16} />
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059] text-[#2A211F] rounded-xl text-xs font-semibold hover:bg-[#D8BD84] transition shrink-0"
            >
              <PlusCircle size={16} />
              <span>Paylaşım Et</span>
            </button>

            {/* --- Auth Bölməsi --- */}
            {isAuthenticated && profile ? (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowUserMenu((s) => !s)}
                  className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-xl bg-[#362A27] border border-stone-700/60 hover:border-[#C5A059]/50 transition"
                  title={roleMeta?.label}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{ background: roleMeta?.color || '#C5A059', color: '#2A211F' }}
                  >
                    {(profile.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs shrink-0" title={roleMeta?.label}>{roleMeta?.badge}</span>
                  <RoleIcon size={13} className="text-[#D8BD84] shrink-0" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-11 w-56 bg-[#2A211F] border border-[#C5A059]/30 rounded-xl shadow-2xl p-2 z-50">
                    <div className="px-2.5 py-2 border-b border-stone-800 mb-1">
                      <p className="text-sm font-semibold text-[#F7F3ED] truncate flex items-center gap-1.5">
                        {profile.name}
                        <span className="text-xs">{roleMeta?.badge}</span>
                      </p>
                      <p className="text-[11px] text-[#D8BD84]">{roleMeta?.label}</p>
                    </div>
                    <button
                      onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-[#F7F3ED] hover:bg-white/5 transition"
                    >
                      Profilimə keç
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition flex items-center gap-2"
                    >
                      <LogOut size={13} /> Hesabdan Çıx
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#362A27] border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold hover:bg-[#C5A059] hover:text-[#2A211F] transition shrink-0"
              >
                <LogIn size={14} />
                <span className="hidden sm:inline">Daxil ol</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Paylaşım Modalı (UGC & Caption ilə) */}
      {showAddModal &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#2A211F] border border-[#C5A059]/40 rounded-2xl max-w-md w-full p-6 text-[#F7F3ED] shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold text-[#C5A059] mb-1">Milli Sosial Lentə Paylaşım Et</h3>
              <p className="text-xs text-stone-400 mb-4">
                Lentada izləyicilərlə paylaşmaq üçün video klip, audio və ya nostaljik hekayə əlavə edin.
              </p>

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-[#D8BD84] mb-1">Başlıq / Mahnının Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: Küçələrə Su Səpmişəm"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D8BD84] mb-1">Müğənni / İfaçı / İdxalçı</label>
                  <input
                    type="text"
                    placeholder="Məs: Rəşid Behbudov"
                    value={newSinger}
                    onChange={(e) => setNewSinger(e.target.value)}
                    className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D8BD84] mb-1">Kolleksiya / Film / Etiket</label>
                  <input
                    type="text"
                    placeholder="Məs: Retro Video, Qızıl Fond"
                    value={newFilm}
                    onChange={(e) => setNewFilm(e.target.value)}
                    className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D8BD84] mb-1">Paylaşım Mətni (Caption)</label>
                  <textarea
                    rows="3"
                    placeholder="Nostaljik təəssüratınızı yazın... (#hashtag və ya @mention istifadə edə bilərsiniz)"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D8BD84] mb-1 flex items-center gap-1">
                    <Upload size={13} />
                    <span>Audio və ya Video Faylı Seçin</span>
                  </label>
                  <input
                    type="file"
                    accept="audio/*,video/*"
                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                    className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2 text-xs text-[#F7F3ED] file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C5A059] file:text-[#2A211F] hover:file:bg-[#D8BD84] cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-[11px] text-[#C5A059] mt-1 truncate">
                      Seçildi: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs bg-stone-800 text-stone-300 hover:bg-stone-700 transition"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-[#2A211F] hover:bg-[#D8BD84] transition"
                  >
                    Paylaş
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Auth Modalı (Daxil ol / Qeydiyyat) */}
      {showAuthModal &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#2A211F] border border-[#C5A059]/40 rounded-2xl max-w-sm w-full p-6 text-[#F7F3ED] shadow-2xl relative my-auto">
              <button
                type="button"
                onClick={() => { setShowAuthModal(false); resetAuthForm(); }}
                className="absolute top-4 right-4 text-stone-400 hover:text-white transition"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-1">
                {authMode === 'signin' ? <LogIn size={18} className="text-[#C5A059]" /> : <UserPlus size={18} className="text-[#C5A059]" />}
                <h3 className="text-lg font-bold text-[#C5A059]">
                  {authMode === 'signin' ? 'Hesaba Daxil Ol' : 'MeloDaily-də Qeydiyyat'}
                </h3>
              </div>
              <p className="text-xs text-stone-400 mb-4">
                {authMode === 'signin'
                  ? 'Sevimli retro dünyana geri qayıt.'
                  : 'Milli musiqi ailəmizə qoşul.'}
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs text-[#D8BD84] mb-1">Ad Soyad</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Məs: Aygün Quliyeva"
                        className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#D8BD84] mb-1">İstifadəçi adı</label>
                      <input
                        type="text"
                        required
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                        placeholder="aygun_quliyeva"
                        className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs text-[#D8BD84] mb-1 flex items-center gap-1">
                    <Mail size={12} /> E-poçt
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="siz@nümunə.az"
                    className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D8BD84] mb-1 flex items-center gap-1">
                    <Lock size={12} /> Şifrə
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="minimum 6 simvol"
                    className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {authError && (
                  <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl text-sm font-bold bg-[#C5A059] text-[#2A211F] hover:bg-[#D8BD84] transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {authLoading && <Loader2 size={15} className="animate-spin" />}
                  {authMode === 'signin' ? 'Daxil ol' : 'Qeydiyyatdan keç'}
                </button>

                <p className="text-center text-xs text-stone-400 pt-1">
                  {authMode === 'signin' ? 'Hesabınız yoxdur?' : 'Artıq hesabınız var?'}{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError(''); }}
                    className="text-[#C5A059] font-semibold hover:underline"
                  >
                    {authMode === 'signin' ? 'Qeydiyyatdan keç' : 'Daxil ol'}
                  </button>
                </p>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}