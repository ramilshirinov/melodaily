import React from 'react';
import { ListMusic, Pause, Play } from 'lucide-react';
import { VinylArt, SectionHeading, EmptyState } from '../components/Common';
import { COLORS, BADGES, VINYL_COLLECTION_IDS, trackById, displayFont, bodyFont } from '../constants/data';

export default function ProfileTab({ currentTrack, isPlaying, bookmarkedVideoIds, bookmarkedTrackIds, playTrack }) {
  const savedIds = [...new Set([...bookmarkedVideoIds, ...bookmarkedTrackIds])];
  const savedTracks = savedIds.map(trackById).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-4">
      <SectionHeading title="Profilim" />

      <div className="rounded-2xl p-5 border flex items-center gap-4" style={{ borderColor: 'rgba(42,33,31,0.12)', background: `linear-gradient(120deg, ${COLORS.bronze}, #1c1614)` }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0" style={{ background: COLORS.gold, color: COLORS.bronze }}>
          NA
        </div>
        <div className="flex-1 min-w-0">
          <h3 style={{ ...displayFont, color: COLORS.cream, fontSize: 19 }}>Nərgiz Əliyeva</h3>
          <p style={{ ...bodyFont, color: COLORS.goldSoft, fontSize: 12.5 }}>@nergiz_retro · Bakı, Azərbaycan</p>
          {currentTrack && (
            <p style={{ ...bodyFont, color: 'rgba(247,243,237,0.75)', fontSize: 12 }} className="mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: isPlaying ? COLORS.gold : 'rgba(197,160,89,0.4)' }} />
              Hal-hazırda dinləyir: <span style={{ fontWeight: 600, color: COLORS.gold }}>{currentTrack.title}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <h4 style={{ ...bodyFont, fontWeight: 700, color: COLORS.bronze, fontSize: 14 }} className="mb-2.5">Rütbələr</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.name} className="rounded-xl p-3 border text-center" style={{ borderColor: 'rgba(42,33,31,0.12)', background: '#FFFDF9' }}>
                <Icon size={22} color={COLORS.gold} className="mx-auto mb-1.5" />
                <p style={{ ...bodyFont, fontWeight: 600, color: COLORS.bronze, fontSize: 12 }}>{b.name}</p>
                <p style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 10.5 }} className="mt-0.5">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <h4 style={{ ...bodyFont, fontWeight: 700, color: COLORS.bronze, fontSize: 14 }} className="mb-2.5">Virtual Val (Vinyl) Kolleksiyası</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {VINYL_COLLECTION_IDS.map((id) => {
            const t = trackById(id);
            return (
              <div key={id} className="flex flex-col items-center gap-1.5">
                <VinylArt colors={t.colors} spinning={false} size={54} />
                <p style={{ ...bodyFont, color: COLORS.bronze, fontSize: 10.5, textAlign: 'center' }} className="truncate w-full">{t.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <h4 style={{ ...bodyFont, fontWeight: 700, color: COLORS.bronze, fontSize: 14 }} className="mb-2.5 flex items-center gap-1.5">
          <ListMusic size={15} color={COLORS.gold} /> Saxlanılan Retro Parçalar
        </h4>
        {savedTracks.length === 0 ? (
          <EmptyState text="Hələ heç nə saxlanmayıb — bəyəndiyin mahnıları bookmark et." />
        ) : (
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(42,33,31,0.12)', background: '#FFFDF9' }}>
            {savedTracks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0" style={{ borderColor: 'rgba(42,33,31,0.08)' }}>
                <VinylArt colors={t.colors} spinning={currentTrack?.id === t.id && isPlaying} size={34} />
                <div className="flex-1 min-w-0">
                  <p style={{ ...bodyFont, fontWeight: 600, color: COLORS.bronze, fontSize: 13 }} className="truncate">{t.title}</p>
                  <p style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 11 }} className="truncate">{t.singer}</p>
                </div>
                <button onClick={() => playTrack(t)} className="p-1.5 rounded-full" style={{ background: COLORS.bronze }}>
                  {currentTrack?.id === t.id && isPlaying ? <Pause size={12} color={COLORS.cream} /> : <Play size={12} color={COLORS.cream} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}