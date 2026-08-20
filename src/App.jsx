import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import HomeTab from './components/HomeTab';
import FeedTab from './tabs/FeedTab';
import MusicTab from './tabs/MusicTab';
import RadioTab from './tabs/RadioTab';
import TogetherTab from './tabs/TogetherTab';
import ProfileTab from './tabs/ProfileTab';

import { supabase } from './lib/supabase'; // Supabase bağlantısı

import {
  FONT_IMPORT_URL, COLORS, TRACKS as INITIAL_TRACKS, FEED_SEED, GIFT_HISTORY_SEED,
  MOOD_FILTERS, LOVE_NOTES_SEED, NEGATIVE_WORDS, trackById, bodyFont
} from './constants/data';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ singer: '', film: '', author: '', decade: '', mood: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Musiqi siyahısı state-i
  const [tracks, setTracks] = useState(INITIAL_TRACKS || []);

  // --- SUPABASE-DƏN MAHNILARI ÇƏKMƏK ---
  useEffect(() => {
    const fetchTracksFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('tracks')
          .select('*')
          .order('id', { ascending: false });

        if (error) {
          console.error('Supabase-dən məlumat çəkilərkən xəta:', error.message);
        } else if (data && data.length > 0) {
          setTracks(data);
        }
      } catch (err) {
        console.error('Bağlantı xətası:', err);
      }
    };

    fetchTracksFromSupabase();
  }, []);

  // User Profile
  const [currentUser] = useState({
    id: 'u_admin_01',
    name: 'Ramil Şirinov',
    username: '@ramil_shirinov',
    role: 'super_admin',
    creatorLevel: 'vip_star',
    topic: 'MeloDaily Qurucusu & Retro Kolleksioner',
    isVerified: true,
    ratingScore: 125000,
    monetization: { isEligible: true, commissionRate: 0.20 }
  });

  // LocalStorage
  const [bookmarkedTrackIds, setBookmarkedTrackIds] = useState(() => {
    const saved = localStorage.getItem('melodaily_bookmarks');
    return saved ? JSON.parse(saved) : [2, 7];
  });

  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('melodaily_wallet');
    return saved ? JSON.parse(saved) : 3250;
  });

  const [tipJar, setTipJar] = useState(() => {
    const saved = localStorage.getItem('melodaily_tipjar');
    return saved ? JSON.parse(saved) : 8420;
  });

  useEffect(() => {
    localStorage.setItem('melodaily_bookmarks', JSON.stringify(bookmarkedTrackIds));
  }, [bookmarkedTrackIds]);

  useEffect(() => {
    localStorage.setItem('melodaily_wallet', JSON.stringify(walletBalance));
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('melodaily_tipjar', JSON.stringify(tipJar));
  }, [tipJar]);

  // Real Audio Engine
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(72);
  const [muted, setMuted] = useState(false);
  const [headphonesMode, setHeadphonesMode] = useState(true);
  const [sleepMinutesLeft, setSleepMinutesLeft] = useState(0);
  const [sleepMenuOpen, setSleepMenuOpen] = useState(false);

  const [showLyricsModal, setShowLyricsModal] = useState(false);

  // Feed State
  const [videos, setVideos] = useState(
    FEED_SEED.map((v) => ({ ...v, liked: false, bookmarked: false, comments: v.comments }))
  );
  const [openComments, setOpenComments] = useState({});
  const [drafts, setDrafts] = useState({});
  const [warnings, setWarnings] = useState({});

  // Radio State
  const [listenerCount, setListenerCount] = useState(1243);
  const [giftHistory, setGiftHistory] = useState(GIFT_HISTORY_SEED);
  const [currentGiftAnim, setCurrentGiftAnim] = useState(null);

  // Together State
  const [syncActive, setSyncActive] = useState(false);
  const [partnerName] = useState('Aygün');
  const [loveNotes, setLoveNotes] = useState(LOVE_NOTES_SEED);
  const [memoryPhotos, setMemoryPhotos] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);

  const sleepInterval = useRef(null);
  const listenerInterval = useRef(null);

  const handleNext = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = tracks[(idx + 1) % tracks.length];
    setCurrentTrack(nextTrack);
    setIsPlaying(true);
  }, [currentTrack, tracks]);

  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || currentTrack?.duration || 180);
    const onEnded = () => handleNext();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack, handleNext]);

  useEffect(() => {
    if (currentTrack?.audio_url || currentTrack?.audioUrl) {
      const url = currentTrack.audio_url || currentTrack.audioUrl;
      if (audioRef.current.src !== url) {
        audioRef.current.src = url;
      }
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    } else if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= (currentTrack.duration || 225)) {
            handleNext();
            return 0;
          }
          return p + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentTrack, isPlaying, handleNext]);

  useEffect(() => {
    audioRef.current.volume = muted ? 0 : volume / 100;
  }, [volume, muted]);

  useEffect(() => {
    if (sleepMinutesLeft > 0) {
      sleepInterval.current = setInterval(() => {
        setSleepMinutesLeft((s) => {
          if (s <= 1) {
            setIsPlaying(false);
            audioRef.current.pause();
            clearInterval(sleepInterval.current);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(sleepInterval.current);
  }, [sleepMinutesLeft]);

  useEffect(() => {
    if (activeTab === 'radio') {
      listenerInterval.current = setInterval(() => {
        setListenerCount((c) => c + Math.floor(Math.random() * 7 - 2));
      }, 2500);
    }
    return () => clearInterval(listenerInterval.current);
  }, [activeTab]);

  const playTrack = useCallback((track) => {
    setCurrentTrack((prev) => {
      if (prev?.id === track.id) {
        setIsPlaying((p) => !p);
        return prev;
      }
      setProgress(0);
      setIsPlaying(true);
      return track;
    });
  }, []);

  const togglePlay = () => {
    if (!currentTrack) {
      if (tracks.length > 0) playTrack(tracks[0]);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handlePrev = () => {
    if (!currentTrack || tracks.length === 0) return;
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = tracks[(idx - 1 + tracks.length) % tracks.length];
    setCurrentTrack(prevTrack);
    setProgress(0);
    setIsPlaying(true);
  };

  const seek = (val) => {
    setProgress(val);
    if (audioRef.current.src) {
      audioRef.current.currentTime = val;
    }
  };

  const setVolume = (v) => { setVolumeState(v); if (v > 0) setMuted(false); };
  const toggleMute = () => setMuted((m) => !m);
  const toggleHeadphones = () => setHeadphonesMode((h) => !h);
  const startSleep = (mins) => { setSleepMinutesLeft(mins * 60); setSleepMenuOpen(false); };
  const cancelSleep = () => { setSleepMinutesLeft(0); setSleepMenuOpen(false); };

  // --- SUPABASE-Ə YENİ MAHNINI YAZMAQ ---
  const handleAddNewTrack = async (newTrackData) => {
    const trackPayload = {
      title: newTrackData.title,
      singer: newTrackData.singer,
      film: newTrackData.film || 'Klassik',
      category: 'Retro',
      mood: 'Nostaljik',
      decade: '1980-lər',
      creator: currentUser.name,
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150',
      audio_url: newTrackData.audioUrl || '',
      lyrics: "İstifadəçi tərəfindən yüklənən audio faylı."
    };

    try {
      const { data, error } = await supabase
        .from('tracks')
        .insert([trackPayload])
        .select();

      if (error) {
        console.error('Supabase-ə yazılarkən xəta:', error.message);
        // Baza xətası olarsa belə lokal olaraq əlavə edirik
        const fallbackTrack = { id: Date.now(), ...trackPayload };
        setTracks((prev) => [fallbackTrack, ...prev]);
        playTrack(fallbackTrack);
      } else if (data && data.length > 0) {
        setTracks((prev) => [data[0], ...prev]);
        playTrack(data[0]);
      }
    } catch (err) {
      console.error('Sorğu xətası:', err);
      const fallbackTrack = { id: Date.now(), ...trackPayload };
      setTracks((prev) => [fallbackTrack, ...prev]);
      playTrack(fallbackTrack);
    }
  };

  /* Filters */
  const matchesFilter = useCallback(
    (track) => {
      if (!track) return false;
      const q = search.trim().toLowerCase();
      if (q) {
        const hay = `${track.title} ${track.singer} ${track.film} ${track.mood} ${track.decade}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.singer && !track.singer?.includes(filters.singer)) return false;
      if (filters.film && track.film !== filters.film) return false;
      if (filters.author && !track.creator?.includes(filters.author)) return false;
      if (filters.decade && track.decade !== filters.decade) return false;
      if (filters.mood && track.mood !== filters.mood) return false;
      return true;
    },
    [search, filters]
  );

  const filteredByMood = (moodFilterId) => {
    const mf = MOOD_FILTERS.find((m) => m.id === moodFilterId);
    if (!mf) return [];
    return tracks.filter((t) => (mf.mood ? t.mood === mf.mood : t.decade === mf.decade));
  };

  /* Feed Actions */
  const likeVideo = (trackId) => {
    setVideos((vs) => vs.map((v) => (v.trackId === trackId ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 } : v)));
  };
  const bookmarkVideo = (trackId) => {
    setVideos((vs) => vs.map((v) => (v.trackId === trackId ? { ...v, bookmarked: !v.bookmarked } : v)));
  };
  const toggleComments = (trackId) => setOpenComments((o) => ({ ...o, [trackId]: !o[trackId] }));
  const setDraft = (trackId, text) => setDrafts((d) => ({ ...d, [trackId]: text }));
  
  const addComment = (trackId) => {
    const text = (drafts[trackId] || '').trim();
    if (!text) return;
    const lower = text.toLowerCase();
    const hit = NEGATIVE_WORDS.find((w) => lower.includes(w));
    if (hit) {
      setWarnings((w) => ({ ...w, [trackId]: 'Şərhiniz pozitiv mühit siyasətimizə uyğun deyil — zəhmət olmasa etik qaydalara riayət edin 💛' }));
      return;
    }
    setWarnings((w) => ({ ...w, [trackId]: null }));
    setVideos((vs) =>
      vs.map((v) =>
        v.trackId === trackId
          ? { ...v, comments: [...v.comments, { id: Date.now(), user: currentUser.name, text, time: 'indi' }] }
          : v
      )
    );
    setDrafts((d) => ({ ...d, [trackId]: '' }));
  };

  const toggleBookmarkTrack = (trackId) => {
    setBookmarkedTrackIds((ids) => (ids.includes(trackId) ? ids.filter((i) => i !== trackId) : [...ids, trackId]));
  };

  const sendGift = (gift) => {
    const commission = currentUser.monetization.commissionRate;
    const netGiftValue = Math.round(gift.value * (1 - commission));
    
    setGiftHistory((h) => [{ id: Date.now(), user: currentUser.name, gift: gift.name, time: 'indi' }, ...h].slice(0, 12));
    setTipJar((t) => t + gift.value);
    setWalletBalance((w) => w + netGiftValue);
    setCurrentGiftAnim(gift);
    setTimeout(() => setCurrentGiftAnim(null), 1400);
  };

  const toggleSync = () => setSyncActive((s) => !s);
  const addNote = (text) => setLoveNotes((n) => [...n, { id: Date.now(), author: currentUser.name, text, time: 'indi' }]);
  const addPhoto = (dataUrl) => setMemoryPhotos((p) => [...p, dataUrl]);
  const coupleTrack = trackById(10);

  const bookmarkedVideoIds = videos.filter((v) => v.bookmarked).map((v) => v.trackId);

  return (
    <div style={{ background: COLORS?.bg || COLORS?.cream || '#2A211F', minHeight: '100vh', fontFamily: bodyFont }}>
      <style>{`
        @import url('${FONT_IMPORT_URL}');
        @keyframes melo-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes giftPop { 0% { transform: scale(0.4); opacity: 0; } 30% { transform: scale(1.15); opacity: 1; } 70% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }
        .animate-giftPop { animation: giftPop 1.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        input[type="range"] { -webkit-appearance: none; appearance: none; background: rgba(197,160,89,0.25); border-radius: 999px; height: 4px; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: ${COLORS?.gold || '#C5A059'}; cursor: pointer; }
        input[type="range"]::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: ${COLORS?.gold || '#C5A059'}; border: none; cursor: pointer; }
        * { box-sizing: border-box; }
      `}</style>

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onAddNewTrack={handleAddNewTrack}
      />

      <main className="pb-32">
        {activeTab === 'home' && (
          <HomeTab
            onPlayTrack={playTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
        )}
        {activeTab === 'feed' && (
          <FeedTab
            videos={videos}
            matchesFilter={matchesFilter}
            playTrack={playTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            likeVideo={likeVideo}
            bookmarkVideo={bookmarkVideo}
            openComments={openComments}
            toggleComments={toggleComments}
            addComment={addComment}
            drafts={drafts}
            setDraft={setDraft}
            warnings={warnings}
          />
        )}
        {activeTab === 'music' && (
          <MusicTab
            tracks={tracks}
            search={search}
            setSearch={setSearch}
            matchesFilter={matchesFilter}
            playTrack={playTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            bookmarkedTrackIds={bookmarkedTrackIds}
            toggleBookmarkTrack={toggleBookmarkTrack}
          />
        )}
        {activeTab === 'radio' && (
          <RadioTab
            listenerCount={listenerCount}
            giftHistory={giftHistory}
            sendGift={sendGift}
            walletBalance={walletBalance}
            tipJar={tipJar}
            isLive={true}
            currentGiftAnim={currentGiftAnim}
            playTrack={playTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
        )}
        {activeTab === 'together' && (
          <TogetherTab
            syncActive={syncActive}
            toggleSync={toggleSync}
            partnerName={partnerName}
            coupleTrack={coupleTrack}
            playTrack={playTrack}
            isPlaying={isPlaying}
            currentTrack={currentTrack}
            loveNotes={loveNotes}
            addNote={addNote}
            memoryPhotos={memoryPhotos}
            addPhoto={addPhoto}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            filteredByMood={filteredByMood}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileTab
            currentUser={currentUser}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            bookmarkedVideoIds={bookmarkedVideoIds}
            bookmarkedTrackIds={bookmarkedTrackIds}
            toggleBookmarkTrack={toggleBookmarkTrack}
            playTrack={playTrack}
            walletBalance={walletBalance}
          />
        )}
      </main>

      {showLyricsModal && currentTrack && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#2A211F] border border-[#C5A059]/40 rounded-2xl max-w-lg w-full p-6 text-[#F7F3ED] shadow-2xl relative max-h-[80vh] flex flex-col">
            <button
              onClick={() => setShowLyricsModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-[#C5A059] mb-1">{currentTrack.title}</h3>
            <p className="text-sm text-[#D8BD84] mb-4">{currentTrack.singer}</p>
            <div className="overflow-y-auto pr-2 space-y-3 text-sm leading-relaxed whitespace-pre-line text-stone-200 border-t border-stone-700/60 pt-4">
              {currentTrack.lyrics || "Bu mahnı üçün sözlər hələ əlavə edilməyib. 🎼"}
            </div>
          </div>
        </div>
      )}

      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        setIsPlaying={setIsPlaying}
        progress={progress}
        duration={duration}
        seek={seek}
        volume={volume}
        setVolume={setVolume}
        muted={muted}
        toggleMute={toggleMute}
        next={handleNext}
        prev={handlePrev}
        headphonesMode={headphonesMode}
        toggleHeadphones={toggleHeadphones}
        sleepMinutesLeft={sleepMinutesLeft}
        sleepMenuOpen={sleepMenuOpen}
        setSleepMenuOpen={setSleepMenuOpen}
        startSleep={startSleep}
        cancelSleep={cancelSleep}
        savedTrackIds={bookmarkedTrackIds}
        toggleSaveTrack={toggleBookmarkTrack}
        onOpenLyrics={() => setShowLyricsModal(true)}
      />
    </div>
  );
}