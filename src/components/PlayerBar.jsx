import React from 'react';
import { Pause, Play, SkipBack, SkipForward, Volume2, Volume1, VolumeX, Headphones, Moon } from 'lucide-react';
import { VinylArt } from './Common';
import { COLORS, bodyFont, formatTime } from '../constants/data';

export default function PlayerBar({
  currentTrack, isPlaying, togglePlay, progress, seek, volume, setVolume, muted, toggleMute,
  next, prev, headphonesMode, toggleHeadphones, sleepMinutesLeft, sleepMenuOpen, setSleepMenuOpen, startSleep, cancelSleep,
}) {
  if (!currentTrack) return null;
  const VolIcon = muted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{ background: 'rgba(42,33,31,0.98)', borderColor: 'rgba(197,160,89,0.25)', backdropFilter: 'blur(8px)' }}
    >
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-2.5 flex items-center gap-3 md:gap-5">
        <div className="flex items-center gap-3 min-w-0 w-40 md:w-56 shrink-0">
          <VinylArt colors={currentTrack.colors} spinning={isPlaying} size={42} />
          <div className="min-w-0 hidden sm:block">
            <p style={{ ...bodyFont, color: COLORS.cream, fontSize: 13, fontWeight: 600 }} className="truncate">{currentTrack.title}</p>
            <p style={{ ...bodyFont, color: COLORS.goldSoft, fontSize: 11 }} className="truncate">{currentTrack.singer}</p>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-center gap-3 mb-1">
            <button onClick={prev} className="p-1.5"><SkipBack size={16} color={COLORS.creamDeep} /></button>
            <button onClick={togglePlay} className="p-2.5 rounded-full" style={{ background: COLORS.gold }}>
              {isPlaying ? <Pause size={16} color={COLORS.bronze} /> : <Play size={16} color={COLORS.bronze} />}
            </button>
            <button onClick={next} className="p-1.5"><SkipForward size={16} color={COLORS.creamDeep} /></button>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span style={{ ...bodyFont, color: COLORS.goldSoft, fontSize: 10.5 }}>{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={currentTrack.duration}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 accent-yellow-600 h-1"
              style={{ accentColor: COLORS.gold }}
            />
            <span style={{ ...bodyFont, color: COLORS.goldSoft, fontSize: 10.5 }}>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 w-32 shrink-0">
          <button onClick={toggleMute}><VolIcon size={16} color={COLORS.creamDeep} /></button>
          <input
            type="range"
            min={0}
            max={100}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1"
            style={{ accentColor: COLORS.gold }}
          />
        </div>

        <button
          onClick={toggleHeadphones}
          title="Arxa Planda Dinlə"
          className="hidden sm:flex items-center gap-1 p-2 rounded-full shrink-0"
          style={{ background: headphonesMode ? 'rgba(197,160,89,0.2)' : 'transparent' }}
        >
          <Headphones size={16} color={headphonesMode ? COLORS.gold : COLORS.creamDeep} />
        </button>

        <div className="relative shrink-0">
          <button
            onClick={() => setSleepMenuOpen((s) => !s)}
            className="flex items-center gap-1 p-2 rounded-full"
            style={{ background: sleepMinutesLeft ? 'rgba(197,160,89,0.2)' : 'transparent' }}
            title="Yuxu Taymeri"
          >
            <Moon size={16} color={sleepMinutesLeft ? COLORS.gold : COLORS.creamDeep} />
            {sleepMinutesLeft ? (
              <span style={{ ...bodyFont, color: COLORS.gold, fontSize: 10.5 }} className="hidden sm:inline">{formatTime(sleepMinutesLeft)}</span>
            ) : null}
          </button>
          {sleepMenuOpen && (
            <div
              className="absolute bottom-12 right-0 rounded-xl p-2 border shadow-xl w-40"
              style={{ background: COLORS.bronze, borderColor: 'rgba(197,160,89,0.3)' }}
            >
              <p style={{ ...bodyFont, color: COLORS.goldSoft, fontSize: 11 }} className="px-2 pb-1.5">Sakit Rejim / Yuxu Taymeri</p>
              {[15, 30, 45, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => startSleep(m)}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-white/5"
                  style={{ ...bodyFont, color: COLORS.cream }}
                >
                  {m} dəqiqə sonra dayan
                </button>
              ))}
              {sleepMinutesLeft ? (
                <button onClick={cancelSleep} className="w-full text-left px-2 py-1.5 rounded-lg text-xs" style={{ ...bodyFont, color: COLORS.burgundy }}>
                  Taymeri ləğv et
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden px-3 pb-2">
        <input
          type="range"
          min={0}
          max={currentTrack.duration}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full h-1"
          style={{ accentColor: COLORS.gold }}
        />
      </div>
    </div>
  );
}