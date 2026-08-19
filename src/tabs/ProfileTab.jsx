import React, { useState } from 'react';
import { User, Heart, Clock, Settings, Music, Disc, LogOut, Shield } from 'lucide-react';
import { displayFont, bodyFont } from '../constants/data';

export default function ProfileTab({ favorites = [], playHistory = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('favorites');

  const userProfile = {
    name: 'İstifadəçi',
    email: 'user@melodaily.az',
    joinedDate: 'İyul 2026',
    favoriteGenre: 'Retro Estada'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8" style={{ fontFamily: bodyFont }}>
      
      {/* Header Profile Section */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-amber-950 font-bold text-3xl shadow-lg">
          <User className="w-12 h-12" />
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
          <Heart className="w-4 h-4" />
          Sevimlilər ({favorites.length})
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
            {favorites.length === 0 ? (
              <p className="text-sm text-amber-200/50 py-4">Hələ ki sevimli musiqi əlavə edilməyib.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {favorites.map((track, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <Disc className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-100">{track.title || 'Mahnı'}</h4>
                      <p className="text-xs text-amber-200/60">{track.artist || 'Müğənni'}</p>
                    </div>
                  </div>
                ))}
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
                      <Music className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-100">{track.title}</span>
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