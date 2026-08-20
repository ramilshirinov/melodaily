import React, { useState } from 'react';
import { Play, Pause, Heart, Music, Disc, Sparkles, Search, Mic } from 'lucide-react';
import { TRACKS, COLORS, displayFont, bodyFont } from '../constants/data';

// Alt komponentlər - Təhlükəsiz üslublar
function MoodBadgeLight({ mood }) {
  return (
    <span 
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
      style={{ fontFamily: bodyFont }}
    >
      {mood}
    </span>
  );
}

function DecadeBadgeLight({ decade }) {
  return (
    <span 
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-amber-200/80 border border-white/10"
      style={{ fontFamily: bodyFont }}
    >
      {decade}
    </span>
  );
}

export default function MusicTab({
  currentTrack = null,
  isPlaying = false,
  playTrack = () => {},
  toggleFavorite = () => {},
  favorites = [],
  search = '',       // Header-dən gələn axtarış mətni
  setSearch = () => {} // Header-dəki axtarışı yeniləyən funksiya
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Bütün');
  const [isListening, setIsListening] = useState(false);

  const categories = ['Bütün', 'Retro', 'Klassik', 'Xalq', 'Caz'];

  // Həm yerli `searchTerm`, həm də Header-dən gələn `search` istifadə olunur
  const effectiveQuery = (search || searchTerm || '').toLowerCase();

  const filteredTracks = (TRACKS || []).filter((track) => {
    const matchesSearch = track.title?.toLowerCase().includes(effectiveQuery) ||
                          track.singer?.toLowerCase().includes(effectiveQuery);
    const matchesCategory = selectedCategory === 'Bütün' || track.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (setSearch) setSearch(val);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Brauzeriniz səsli axtarışı dəstəkləmir.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'az-AZ';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      if (setSearch) setSearch(transcript);
    };

    recognition.start();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6" style={{ fontFamily: bodyFont }}>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <input
            type="text"
            placeholder="Mahnı və ya müğənni axtar..."
            value={search || searchTerm}
            onChange={handleInputChange}
            className="w-full bg-black/40 text-amber-100 placeholder-amber-200/40 text-sm pl-9 pr-9 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
              isListening ? 'text-red-400 animate-pulse bg-red-500/20' : 'text-amber-400/70 hover:text-amber-300'
            }`}
            title="Səslə axtar"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-amber-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-amber-200/70 hover:bg-white/10 hover:text-amber-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Track List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTracks.length === 0 ? (
          <div className="col-span-full text-center py-12 text-amber-200/40">
            <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Mahnı tapılmadı</p>
          </div>
        ) : (
          filteredTracks.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isFav = favorites.some((f) => f.id === track.id);

            return (
              <div
                key={track.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${
                  isCurrent 
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={track.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'}
                      alt={track.title}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                    <button
                      onClick={() => playTrack(track)}
                      className={`absolute inset-0 flex items-center justify-center rounded-xl transition-all ${
                        isCurrent 
                          ? 'bg-amber-500/80 text-amber-950' 
                          : 'bg-black/40 group-hover:bg-amber-500/80 text-white group-hover:text-amber-950 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="min-w-0">
                    <h4 
                      className="text-base font-bold text-amber-100 truncate" 
                      style={{ fontFamily: displayFont }}
                    >
                      {track.title}
                    </h4>
                    <p className="text-xs text-amber-200/60 truncate mt-0.5">{track.singer}</p>

                    <div className="flex items-center gap-2 mt-2">
                      {track.mood && <MoodBadgeLight mood={track.mood} />}
                      {track.decade && <DecadeBadgeLight decade={track.decade} />}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(track)}
                  className={`p-2.5 rounded-full transition-all ${
                    isFav 
                      ? 'text-red-400 bg-red-500/10' 
                      : 'text-amber-200/40 hover:text-amber-200 hover:bg-white/5'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}