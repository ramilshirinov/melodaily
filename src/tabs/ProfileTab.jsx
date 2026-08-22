import React, { useState } from 'react';
import { User, Bookmark, Clock, Settings, Play, Pause, Trash2, Shield, LogOut } from 'lucide-react';
import { displayFont, bodyFont, TRACKS, ROLE_META } from '../constants/data';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function ProfileTab({ 
  currentUser,
  bookmarkedTrackIds = [], 
  favorites = [], 
  playHistory = [], 
  toggleBookmarkTrack, 
  playTrack, 
  currentTrack, 
  isPlaying,
  walletBalance = 0 
}) {
  const { signOut, refreshProfile } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('favorites');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(currentUser?.topic || 'Retro musiqi və kino həvəskarı');
  const [isPrivate, setIsPrivate] = useState(!!currentUser?.is_private);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  const roleInfo = ROLE_META[currentUser?.role] || ROLE_META[currentUser?.creatorLevel] || ROLE_META.listener;

  const handleSaveBio = async () => {
    setIsEditingBio(false);
    if (currentUser?.id) {
      await supabase
        .from('profiles')
        .update({ topic: bioText })
        .eq('id', currentUser.id);
    }
  };

  const handleTogglePrivacy = async () => {
    if (!currentUser?.id || currentUser.id === 'guest') return;
    setPrivacyLoading(true);
    const nextValue = !isPrivate;

    const { error } = await supabase
      .from('profiles')
      .update({ is_private: nextValue })
      .eq('id', currentUser.id);

    if (!error) {
      setIsPrivate(nextValue);
      if (refreshProfile) refreshProfile();
    } else {
      alert(`Xəta: ${error.message}`);
    }
    setPrivacyLoading(false);
  };

  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
  };

  // App.jsx-dən gələn ID-lərə əsasən mahnı obyektlərini tapırıq
  const effectiveFavorites = favorites.length > 0 
    ? favorites 
    : TRACKS ? TRACKS.filter((t) => bookmarkedTrackIds.includes(t.id)) : [];

  const userProfile = {
    name: currentUser?.name || 'İstifadəçi',
    email: currentUser?.username || currentUser?.email || '@melodaily_user',
    joinedDate: 'İyul 2026',
    favoriteGenre: 'Retro Estrada'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn" style={{ fontFamily: bodyFont }}>
      
      {/* Header Profile Section */}
      <div className="p-6 rounded-2xl bg-white/5 border border-[#C5A059]/30 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-amber-950 font-bold text-3xl shadow-lg shrink-0 overflow-hidden border-2 border-[#C5A059]">
            {currentUser?.avatar_url ? (
              <img src={currentUser.avatar_url} alt={userProfile.name} className="w-full h-full object-cover" />
            ) : (
              userProfile.name ? userProfile.name.charAt(0) : <User className="w-12 h-12" />
            )}
          </div>
          {(currentUser?.isVerified || currentUser?.role === 'vip') && (
            <span className="absolute bottom-0 right-0 bg-[#C5A059] text-black text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-[#2A211F]" title="Verifikasiyalı VIP Star">
              ⭐
            </span>
          )}
        </div>

        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold text-amber-100" style={{ fontFamily: displayFont }}>
              {userProfile.name}
            </h2>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1"
              style={{ borderColor: roleInfo.color, color: roleInfo.color }}
            >
              <span>{roleInfo.badge}</span>
              <span>{roleInfo.label}</span>
            </span>
            {(currentUser?.isVerified || currentUser?.role === 'vip') && (
              <span className="bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                ✨ VIP Star
              </span>
            )}
          </div>

          <p className="text-sm text-amber-200/60">{userProfile.email}</p>

          {/* Bio / Topic / Fəaliyyət İstigaməti Section */}
          {isEditingBio ? (
            <div className="flex gap-2 my-2 max-w-md">
              <input
                type="text"
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                placeholder="Fəaliyyət istiqaməti (məs: Retro Kolleksioner)"
                className="bg-[#2A211F] border border-[#C5A059] rounded px-3 py-1 text-sm text-[#F7F3ED] w-full focus:outline-none"
              />
              <button
                onClick={handleSaveBio}
                className="bg-[#C5A059] text-black text-xs px-3 py-1 rounded font-bold hover:bg-[#D8BD84]"
              >
                Yadda saxla
              </button>
            </div>
          ) : (
            <div className="my-2 space-y-1">
              <p className="text-sm text-[#D8BD84] font-medium flex items-center justify-center sm:justify-start gap-1">
                🎯 Fəaliyyət: {bioText}
                <button onClick={() => setIsEditingBio(true)} className="text-xs text-[#C5A059] hover:underline ml-2">
                  ✏️ Dəyiş
                </button>
              </p>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 bg-[#2A211F]/70 p-3 rounded-xl border border-[#C5A059]/20 text-center max-w-lg mt-3">
            <div>
              <p className="text-xs text-stone-400">Reytinq Xalı</p>
              <p className="text-base font-bold text-[#C5A059]">{currentUser?.ratingScore || 12500} pts</p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Balans</p>
              <p className="text-base font-bold text-[#D8BD84]">{walletBalance} 💎</p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Saxlanılanlar</p>
              <p className="text-base font-bold text-white">{bookmarkedTrackIds?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-white/10 gap-6">
        <button
          onClick={() => setActiveSubTab('favorites')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeSubTab === 'favorites'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-amber-200/60 hover:text-amber-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Sevimlilər ({effectiveFavorites.length})
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeSubTab === 'history'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-amber-200/60 hover:text-amber-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          Tarixçə ({playHistory.length})
        </button>
        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeSubTab === 'settings'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-amber-200/60 hover:text-amber-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          Tənzimləmələr
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeSubTab === 'favorites' && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-amber-100" style={{ fontFamily: displayFont }}>
              Sevimli Musiqiləriniz
            </h3>
            {effectiveFavorites.length === 0 ? (
              <p className="text-sm text-amber-200/50 py-4">Hələ ki sevimli musiqi əlavə edilməyib.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {effectiveFavorites.map((track) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const title = track.title || track.name || 'Mahnı';
                  const artist = track.singer || track.artist || 'Müğənni';

                  return (
                    <div 
                      key={track.id || title} 
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-amber-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {playTrack && (
                          <button
                            onClick={() => playTrack(track)}
                            className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center hover:bg-amber-500 hover:text-amber-950 transition shrink-0"
                          >
                            {isCurrent && isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                          </button>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-amber-100 truncate">{title}</h4>
                          <p className="text-xs text-amber-200/60 truncate">{artist}</p>
                        </div>
                      </div>

                      {toggleBookmarkTrack && (
                        <button
                          onClick={() => toggleBookmarkTrack(track.id)}
                          className="p-2 text-stone-400 hover:text-red-400 transition shrink-0"
                          title="Sevimlilərdən çıxar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'history' && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-amber-100" style={{ fontFamily: displayFont }}>
              Son Dinlənilənlər
            </h3>
            {playHistory.length === 0 ? (
              <p className="text-sm text-amber-200/50 py-4">Tarixçə boşdur.</p>
            ) : (
              <div className="space-y-2">
                {playHistory.map((track, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-100">{track.title || track.name}</span>
                    </div>
                    <span className="text-xs text-amber-200/40">{track.time || 'Bu gün'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-amber-100" style={{ fontFamily: displayFont }}>
              Hesab Parametrləri
            </h3>
            <div className="space-y-3 text-sm">
              <div className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-amber-100 font-medium">Gizli Hesab</p>
                    <p className="text-xs text-amber-200/50 mt-0.5">
                      {isPrivate
                        ? 'Yalnız təsdiqlədiyiniz izləyicilər paylaşımlarınızı görə bilər.'
                        : 'Hər kəs profilinizi və paylaşımlarınızı görə bilər.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleTogglePrivacy}
                  disabled={privacyLoading}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-50 ${
                    isPrivate ? 'bg-[#C5A059]' : 'bg-stone-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      isPrivate ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-3 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Hesabdan Çıx
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}