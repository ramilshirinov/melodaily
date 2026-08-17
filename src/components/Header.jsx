import React, { useMemo } from 'react';
import { Search, Filter, Film, Music, Radio, Users, User } from 'lucide-react';
import { Logo } from './Common';
import { COLORS, TRACKS, displayFont, accentFont, bodyFont } from '../constants/data';

export default function Header({ activeTab, setActiveTab, search, setSearch, filters, setFilters, showFilters, setShowFilters }) {
  const TABS = [
    { id: 'feed', label: 'Estetik Axın', icon: Film },
    { id: 'music', label: 'Musiqi', icon: Music },
    { id: 'radio', label: 'MeloRadio', icon: Radio },
    { id: 'together', label: 'Birlikdə Dinlə & Cütlüklər', icon: Users },
    { id: 'profile', label: 'Profilim', icon: User },
  ];

  const singers = useMemo(() => [...new Set(TRACKS.map((t) => t.singer))], []);
  const films = useMemo(() => [...new Set(TRACKS.map((t) => t.film))], []);
  const decades = useMemo(() => [...new Set(TRACKS.map((t) => t.decade))].sort(), []);
  const moods = useMemo(() => [...new Set(TRACKS.map((t) => t.mood))], []);

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: 'rgba(42,33,31,0.97)', borderColor: 'rgba(197,160,89,0.25)', backdropFilter: 'blur(6px)' }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 py-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <Logo size={32} />
            <div className="leading-tight">
              <div style={{ ...displayFont, color: COLORS.cream, fontSize: 19, letterSpacing: 0.3 }}>
                MeloDaily <span style={{ color: COLORS.gold }}>#melodaily</span>
              </div>
              <div style={{ ...accentFont, color: COLORS.goldSoft, fontSize: 12.5, fontStyle: 'italic' }}>
                Milli Sosial & Musiqi Platforması
              </div>
            </div>
          </div>

          <div className="flex-1 hidden md:flex items-center gap-2 max-w-xl ml-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.goldSoft }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Mahnı, müğənni, film, əhval-ruhiyyə axtar..."
                className="w-full pl-9 pr-3 py-2 rounded-full text-sm outline-none"
                style={{ background: 'rgba(247,243,237,0.08)', color: COLORS.cream, border: '1px solid rgba(197,160,89,0.3)', ...bodyFont }}
              />
            </div>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="p-2.5 rounded-full shrink-0 transition"
              style={{ background: showFilters ? COLORS.gold : 'rgba(197,160,89,0.15)', color: showFilters ? COLORS.bronze : COLORS.gold }}
              title="Filtrlər"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.goldSoft }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Axtar..."
              className="w-full pl-9 pr-3 py-2 rounded-full text-sm outline-none"
              style={{ background: 'rgba(247,243,237,0.08)', color: COLORS.cream, border: '1px solid rgba(197,160,89,0.3)', ...bodyFont }}
            />
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="p-2.5 rounded-full shrink-0"
            style={{ background: showFilters ? COLORS.gold : 'rgba(197,160,89,0.15)', color: showFilters ? COLORS.bronze : COLORS.gold }}
          >
            <Filter size={16} />
          </button>
        </div>

        {showFilters && (
          <div className="pb-4 grid grid-cols-2 md:grid-cols-5 gap-2 animate-fadeIn">
            {[
              { label: 'Müğənni', key: 'singer', options: singers },
              { label: 'Film / Kino', key: 'film', options: films },
              { label: 'Müəllif', key: 'author', options: ['Rza Təhmasib', 'Hüseyn Seyidzadə', 'Azərbaycan Dövlət Radiosu', 'AzTV Arxivi', 'Bakı Kinostudiyası'] },
              { label: 'Onillik', key: 'decade', options: decades },
              { label: 'Əhval-ruhiyyə', key: 'mood', options: moods },
            ].map((f) => (
              <select
                key={f.key}
                value={filters[f.key]}
                onChange={(e) => setFilters((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="rounded-lg px-2.5 py-2 text-xs outline-none"
                style={{ background: 'rgba(247,243,237,0.08)', color: COLORS.cream, border: '1px solid rgba(197,160,89,0.3)', ...bodyFont }}
              >
                <option value="" style={{ color: '#000' }}>{f.label}</option>
                {f.options.map((o) => (
                  <option key={o} value={o} style={{ color: '#000' }}>{o}</option>
                ))}
              </select>
            ))}
          </div>
        )}

        <nav className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] whitespace-nowrap transition-all duration-200"
                style={{
                  background: active ? COLORS.gold : 'transparent',
                  color: active ? COLORS.bronze : COLORS.creamDeep,
                  fontWeight: active ? 700 : 500,
                  ...bodyFont,
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