import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Clock, Heart, Bookmark, FileText } from 'lucide-react';

export default function PlayerBar({ 
  currentTrack, 
  isPlaying, 
  setIsPlaying, 
  progress = 0,
  duration = 180,
  seek,
  volume = 80,
  setVolume,
  muted,
  toggleMute,
  next,
  prev,
  savedTrackIds = [], 
  toggleSaveTrack,
  onOpenLyrics
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(null);

  const trackId = currentTrack?.id;
  const isSaved = savedTrackIds.includes(trackId);

  // Yuxu Taymeri (Sleep Timer) Məntiqi
  useEffect(() => {
    if (!timerMinutes) return;

    const timer = setTimeout(() => {
      if (setIsPlaying) setIsPlaying(false);
      setTimerMinutes(null);
      alert(`${timerMinutes} dəqiqəlik yuxu taymeri tamamlandı. Musiqi dayandırıldı.`);
    }, timerMinutes * 60 * 1000);

    return () => clearTimeout(timer);
  }, [timerMinutes, setIsPlaying]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 border-t transition-all"
      style={{ background: 'rgba(42,33,31,0.97)', borderColor: 'rgba(197,160,89,0.25)', backdropFilter: 'blur(8px)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Sol: Mahnı haqqında + Reaksiya & Sevimlilər & Lyrics */}
        <div className="flex items-center gap-3 w-full md:w-1/3">
          <div 
            className="w-11 h-11 rounded-lg border overflow-hidden shrink-0 flex items-center justify-center"
            style={{ background: '#2A211F', borderColor: 'rgba(197,160,89,0.3)' }}
          >
            <img 
              src="/logo.jpg?v=2" 
              alt="MeloDaily Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <h4 className="font-medium text-sm truncate" style={{ color: '#F7F3ED' }}>
              {currentTrack.title || currentTrack.name || 'Mahnı Seçilməyib'}
            </h4>
            <p className="text-xs truncate" style={{ color: '#D8BD84' }}>
              {currentTrack.singer || currentTrack.artist || 'Müğənni'}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Mahnı Sözləri (Lyrics) Düyməsi */}
            <button 
              onClick={onOpenLyrics} 
              className="p-1.5 rounded-lg transition hover:bg-stone-800/50"
              style={{ color: '#D8BD84' }}
              title="Mahnı sözləri (Lyrics)"
            >
              <FileText size={18} />
            </button>

            {/* Ürək */}
            <button 
              onClick={() => setIsLiked(!isLiked)} 
              className="p-1.5 rounded-lg transition hover:bg-stone-800/50"
              style={{ color: isLiked ? '#E53E3E' : '#D8BD84' }}
              title={isLiked ? "Bəyənməni ləğv et" : "Bəyən"}
            >
              <Heart size={18} className={isLiked ? 'fill-[#E53E3E]' : ''} />
            </button>

            {/* Əlfəcin */}
            <button 
              onClick={() => trackId && toggleSaveTrack && toggleSaveTrack(trackId)} 
              className="p-1.5 rounded-lg transition hover:bg-stone-800/50"
              style={{ color: isSaved ? '#C5A059' : '#D8BD84' }}
              title={isSaved ? "Sevimlilərdən çıxar" : "Sevimlilərə əlavə et"}
            >
              <Bookmark size={18} className={isSaved ? 'fill-[#C5A059]' : ''} />
            </button>
          </div>
        </div>

        {/* Orta: Pleyer İdarəetməsi */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-1/3">
          <div className="flex items-center gap-4">
            <button onClick={prev} className="transition hover:scale-110" style={{ color: '#D8BD84' }}>
              <SkipBack size={18} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition shadow-md hover:scale-105"
              style={{ background: '#C5A059', color: '#2A211F' }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button onClick={next} className="transition hover:scale-110" style={{ color: '#D8BD84' }}>
              <SkipForward size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full text-[11px]" style={{ color: '#D8BD84' }}>
            <span>{formatTime(progress)}</span>
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={progress} 
              onChange={(e) => seek && seek(Number(e.target.value))}
              className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
              style={{ background: 'rgba(247,243,237,0.15)' }}
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Sağ: Səs və Sleep Timer */}
        <div className="flex items-center justify-end gap-3 w-full md:w-1/3 relative">
          <button 
            onClick={() => setShowTimerModal(!showTimerModal)} 
            className="p-2 rounded-lg transition relative"
            style={{ color: timerMinutes ? '#C5A059' : '#D8BD84', background: timerMinutes ? 'rgba(197,160,89,0.15)' : 'transparent' }}
            title="Sleep Timer"
          >
            <Clock size={18} />
            {timerMinutes && (
              <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-[#C5A059] text-[#2A211F] px-1 rounded-full">
                {timerMinutes}m
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} style={{ color: '#D8BD84' }}>
              {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={muted ? 0 : volume} 
              onChange={(e) => setVolume && setVolume(Number(e.target.value))}
              className="w-20 h-1 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
              style={{ background: 'rgba(247,243,237,0.15)' }}
            />
          </div>

          {/* Sleep Timer Modalı */}
          {showTimerModal && (
            <div 
              className="absolute bottom-12 right-0 p-3 rounded-xl shadow-2xl border flex flex-col gap-1.5 min-w-[160px] z-50"
              style={{ background: '#2A211F', borderColor: 'rgba(197,160,89,0.3)' }}
            >
              <span className="text-xs font-medium pb-1 border-b border-stone-700" style={{ color: '#C5A059' }}>
                Yuxu Taymeri
              </span>
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => { setTimerMinutes(mins); setShowTimerModal(false); }}
                  className="text-left text-xs py-1.5 px-2 rounded hover:bg-stone-800 transition"
                  style={{ color: '#F7F3ED' }}
                >
                  {mins} dəqiqə sonra
                </button>
              ))}
              {timerMinutes && (
                <button 
                  onClick={() => { setTimerMinutes(null); setShowTimerModal(false); }}
                  className="text-left text-xs py-1.5 px-2 rounded bg-red-900/30 text-red-300 hover:bg-red-900/50 transition mt-1"
                >
                  Sıfırla
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}