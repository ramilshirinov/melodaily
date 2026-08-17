import React from 'react';
import { Play, Pause, Bookmark } from 'lucide-react';
import { VinylArt, SectionHeading, EmptyState } from '../components/Common';
import { COLORS, TRACKS, bodyFont, formatTime } from '../constants/data';

function MoodBadgeLight({ mood }) {
  return <span className="text-[10.5px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(197,160,89,0.15)', color: COLORS.inkGold, ...bodyFont }}>{mood}</span>;
}

function DecadeBadgeLight({ decade }) {
  return <span className="text-[10.5px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(42,33,31,0.06)', color: COLORS.bronze, ...bodyFont }}>{decade}</span>;
}

export default function MusicTab({ matchesFilter, playTrack, currentTrack, isPlaying, bookmarkedTrackIds, toggleBookmarkTrack }) {
  const list = TRACKS.filter(matchesFilter);
  return (
    <div className="max-w-3xl mx-auto px-4 pt-6">
      <SectionHeading title="Musiqi Kitabxanası" subtitle="10 bərpa olunmuş retro qeyd — Azərbaycanın qızıl dövründən" />
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(42,33,31,0.12)', background: '#FFFDF9' }}>
        {list.length === 0 && <div className="p-6"><EmptyState text="Bu filtrlərə uyğun mahnı tapılmadı." /></div>}
        {list.map((t, i) => {
          const active = currentTrack?.id === t.id;
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 transition"
              style={{ borderColor: 'rgba(42,33,31,0.08)', background: active ? 'rgba(197,160,89,0.1)' : 'transparent' }}
            >
              <span style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 12, width: 18 }}>{i + 1}</span>
              <button onClick={() => playTrack(t)} className="shrink-0">
                <VinylArt colors={t.colors} spinning={active && isPlaying} size={42} />
              </button>
              <div className="flex-1 min-w-0">
                <p style={{ ...bodyFont, fontWeight: 600, color: COLORS.bronze, fontSize: 14 }} className="truncate">{t.title}</p>
                <p style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 12 }} className="truncate">{t.singer} · {t.film}</p>
              </div>
              <div className="hidden sm:flex gap-1.5">
                <MoodBadgeLight mood={t.mood} />
                <DecadeBadgeLight decade={t.decade} />
              </div>
              <span style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 12 }}>{formatTime(t.duration)}</span>
              <button onClick={() => toggleBookmarkTrack(t.id)} className="p-1.5">
                <Bookmark size={16} fill={bookmarkedTrackIds.includes(t.id) ? COLORS.gold : 'none'} color={COLORS.gold} />
              </button>
              <button onClick={() => playTrack(t)} className="p-2 rounded-full shrink-0" style={{ background: COLORS.bronze }}>
                {active && isPlaying ? <Pause size={13} color={COLORS.cream} /> : <Play size={13} color={COLORS.cream} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}