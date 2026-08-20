import React, { useMemo } from 'react';
import { Search, Filter, Home, Film, Music, Radio, Users, User, RotateCcw } from 'lucide-react';
import { TRACKS } from '../constants/data';

const TABS = [
  { id: 'home', label: 'Əsas', icon: Home },
  { id: 'feed', label: 'Estetik Akın', icon: Film },
  { id: 'music', label: 'Musiqi', icon: Music },
  { id: 'radio', label: 'MeloRadio', icon: Radio },
  { id: 'together', label: 'Birlikdə Dinlə & Cütlüklər', icon: Users },
  { id: 'profile', label: 'Profilim', icon: User },
];

export default function Header({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}) {
  const singers = useMemo(() => [...new Set(TRACKS.map((t) => t.singer).filter(Boolean))], []);
  const films = useMemo(() => [...new Set(TRACKS.map((t) => t.film).filter(Boolean))], []);
  const decades = useMemo(() => [...new Set(TRACKS.map((t) => t.decade).filter(Boolean))].sort(), []);
  const moods = useMemo(() => [...new Set(TRACKS.map((t) => t.mood).filter(Boolean))], []);
  const authors = useMemo(() => [...new Set(TRACKS.map((t) => t.creator?.split(' · ')[0]).filter(Boolean))], []);

  const hasActiveFilters = Object.values(filters).some(Boolean) || search;

  const resetFilters = () => {
    setSearch('');
    setFilters({ singer: '', film: '', author: '', decade: '', mood: '' });
  };

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: 'rgba(42,33,31,0.97)', borderColor: 'rgba(197,160,89,0.25)', backdropFilter: 'blur(6px)' }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Üst sıra: loqo + axtarış */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 py-4 md:py-5">

          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('home')}>
            <img 
              src="/logo.jpg" 
              alt="MeloDaily Logo" 
              className="w-10 h-10 rounded-xl object-cover border"
              style={{ borderColor: 'rgba(197,160,89,0.4)' }}
            />
            <div className="leading-tight">
              <div style={{ fontFamily: "'Playfair Display', serif", color: '#F7F3ED', fontSize: 19, letterSpacing: 0.3 }}>
                MeloDaily <span style={{ color: '#C5A059' }}>#melodaily</span>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", color: '#D8BD84', fontSize: 12.5, fontStyle: 'italic' }}>
                Milli Sosial & Musiqi Platforması
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#D8BD84' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Mahnı, müğənni, film, əhval-ruhiyyə axtar..."
                className="w-full pl-9 pr-3 py-2.5 rounded-full text-sm outline-none transition"
                style={{ background: 'rgba(247,243,237,0.08)', color: '#F7F3ED', border: '1px solid rgba(197,160,89,0.3)' }}
              />
            </div>
            
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="p-2.5 rounded-full shrink-0 transition flex items-center justify-center"
              style={{ background: showFilters ? '#C5A059' : 'rgba(197,160,89,0.15)', color: showFilters ? '#2A211F' : '#C5A059' }}
              title="Filtrlər"
            >
              <Filter size={16} />
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="p-2.5 rounded-full shrink-0 transition flex items-center justify-center text-red-400 hover:bg-red-950/30"
                title="Təmizlə"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Filtr paneli */}
        {showFilters && (
          <div className="pb-5 grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Müğənni', key: 'singer', options: singers },
              { label: 'Film / Kino', key: 'film', options: films },
              { label: 'Müəllif', key: 'author', options: authors },
              { label: 'Onillik', key: 'decade', options: decades },
              { label: 'Əhval-ruhiyyə', key: 'mood', options: moods },
            ].map((f) => (
              <select
                key={f.key}
                value={filters[f.key] || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="rounded-lg px-3 py-2.5 text-xs outline-none cursor-pointer"
                style={{ background: 'rgba(247,243,237,0.08)', color: '#F7F3ED', border: '1px solid rgba(197,160,89,0.3)' }}
              >
                <option value="" style={{ color: '#000' }}>{f.label}</option>
                {f.options.map((o) => (
                  <option key={o} value={o} style={{ color: '#000' }}>{o}</option>
                ))}
              </select>
            ))}
          </div>
        )}

        {/* Naviqasiya nişanları */}
        <nav className="flex flex-wrap gap-2 pb-4 overflow-x-auto no-scrollbar">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] whitespace-nowrap transition-all duration-200 cursor-pointer"
                style={{
                  background: active ? '#C5A059' : 'transparent',
                  color: active ? '#2A211F' : '#EFE7D8',
                  fontWeight: active ? 700 : 500,
                }}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}