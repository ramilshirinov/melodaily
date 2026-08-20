import React, { useState } from 'react';
import { User, Bookmark, Clock, Settings, Play, Pause, Trash2, Shield, LogOut } from 'lucide-react';
import { displayFont, bodyFont, TRACKS } from '../constants/data';

export default function ProfileTab({ 
  currentUser,
  bookmarkedTrackIds = [], 
  favorites = [], 
  playHistory = [], 
  toggleBookmarkTrack, 
  playTrack, 
  currentTrack, 
  isPlaying 
}) {
  const [activeSubTab, setActiveSubTab] = useState('favorites');

  // App.jsx-dən gələn ID-lərə əsasən mahnı obyektlərini tapırıq
  const effectiveFavorites = favorites.length > 0 
    ? favorites 
    : TRACKS ? TRACKS.filter((t) => bookmarkedTrackIds.includes(t.id)) : [];

  const userProfile = {
    name: currentUser?.name || 'İstifadəçi',
    email: currentUser?.username || currentUser?.email || 'user@melodaily.az',
    joinedDate: 'İyul 2026',
    favoriteGenre: 'Retro Estada'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8" style={{ fontFamily: bodyFont }}>
      
      {/* Header Profile Section */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-amber-950 font-bold text-3xl shadow-lg shrink-0">
          {userProfile.name ? userProfile.name.charAt(0) : <User className="w-12 h-12" />}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-bold text-amber-100" style={{ fontFamily: displayFont }}>
            {userProfile.name}
          </h2>
          <p className="text-sm text-amber-200/60">{userProfile.email}</p>
          <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start text-xs text-amber-300/80">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
              Qoşuldu: {userProfile.joinedDate}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
              {userProfile.favoriteGenre}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-white/10">
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
              <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-amber-100 flex items-center gap-3 transition-colors">
                <Shield className="w-4 h-4 text-amber-400" />
                Məxfilik və Təhlükəsizlik
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-3 transition-colors">
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