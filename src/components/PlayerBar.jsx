import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart, 
  Radio 
} from 'lucide-react';
import { displayFont, bodyFont } from '../constants/data';

export default function PlayerBar({
  currentTrack = null,
  isPlaying = false,
  onPlayPause = () => {},
  onNext = () => {},
  onPrev = () => {},
  toggleFavorite = () => {},
  favorites = [],
  volume = 80,
  setVolume = () => {},
  isMuted = false,
  toggleMute = () => {}
}) {
  if (!currentTrack) return null;

  const isFav = favorites.some((f) => f.id === currentTrack.id);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-lg border-t border-white/10 px-4 py-3 z-40 text-amber-100"
      style={{ fontFamily: bodyFont }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Current Track Info */}
        <div className="flex items-center gap-3 min-w-0 w-1/4">
          <img
            src={currentTrack.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 
              className="text-sm font-bold text-amber-100 truncate"
              style={{ fontFamily: displayFont }}
            >
              {currentTrack.title}
            </h4>
            <p className="text-xs text-amber-200/60 truncate">{currentTrack.singer}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack)}
            className={`p-1.5 rounded-full transition-colors ${
              isFav ? 'text-red-400' : 'text-amber-200/40 hover:text-amber-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-1 w-2/4">
          <div className="flex items-center gap-4">
            <button
              onClick={onPrev}
              className="text-amber-200/70 hover:text-amber-100 transition-colors p-1"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={onPlayPause}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-amber-950 flex items-center justify-center transition-transform transform active:scale-95 shadow-md shadow-amber-500/20"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="text-amber-200/70 hover:text-amber-100 transition-colors p-1"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-end gap-2 w-1/4">
          <button
            onClick={toggleMute}
            className="text-amber-200/70 hover:text-amber-100 transition-colors p-1"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 md:w-28 accent-amber-500 bg-white/20 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
}