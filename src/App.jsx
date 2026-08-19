import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import FeedTab from './tabs/FeedTab';
import MusicTab from './tabs/MusicTab';
import RadioTab from './tabs/RadioTab';
import TogetherTab from './tabs/TogetherTab';
import ProfileTab from './tabs/ProfileTab';

import {
  FONT_IMPORT_URL, COLORS, TRACKS, FEED_SEED, GIFT_HISTORY_SEED,
  MOOD_FILTERS, LOVE_NOTES_SEED, NEGATIVE_WORDS, trackById, bodyFont
} from './constants/data';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ singer: '', film: '', author: '', decade: '', mood: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Player State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(72);
  const [muted, setMuted] = useState(false);
  const [headphonesMode, setHeadphonesMode] = useState(true);
  const [sleepMinutesLeft, setSleepMinutesLeft] = useState(0);
  const [sleepMenuOpen, setSleepMenuOpen] = useState(false);

  // Feed State
  const [videos, setVideos] = useState(
    FEED_SEED.map((v) => ({ ...v, liked: false, bookmarked: false, comments: v.comments }))
  );
  const [openComments, setOpenComments] = useState({});
  const [drafts, setDrafts] = useState({});
  const [warnings, setWarnings] = useState({});

  // Bookmarks
  const [bookmarkedTrackIds, setBookmarkedTrackIds] = useState([2, 7]);

  // Radio State
  const [listenerCount, setListenerCount] = useState(1243);
  const [giftHistory, setGiftHistory] = useState(GIFT_HISTORY_SEED);
  const [walletBalance, setWalletBalance] = useState(3250);
  const [tipJar, setTipJar] = useState(8420);
  const [currentGiftAnim, setCurrentGiftAnim] = useState(null);

  // Together State
  const [syncActive, setSyncActive] = useState(false);
  const [partnerName] = useState('Aygün');
  const [loveNotes, setLoveNotes] = useState(LOVE_NOTES_SEED);
  const [memoryPhotos, setMemoryPhotos] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);

  const progressInterval = useRef(null);
  const sleepInterval = useRef(null);
  const listenerInterval = useRef(null);

  /* Player Engine */
  const handleNext = useCallback(() => {
    if (!currentTrack) return;
    const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = TRACKS[(idx + 1) % TRACKS.length];
    setCurrentTrack(nextTrack);
    setProgress(0);
    setIsPlaying(true);
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressInterval.current = setInterval(() => {
        setProgress((p) => {
          if (p >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying, currentTrack, handleNext]);

  useEffect(() => {
    if (sleepMinutesLeft > 0) {
      sleepInterval.current = setInterval(() => {
        setSleepMinutesLeft((s) => {
          if (s <= 1) {
            setIsPlaying(false);
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
      playTrack(TRACKS[0]);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handlePrev = () => {
    if (!currentTrack) return;
    const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length];
    setCurrentTrack(prevTrack);
    setProgress(0);
    setIsPlaying(true);
  };

  const seek = (val) => setProgress(val);
  const setVolume = (v) => { setVolumeState(v); if (v > 0) setMuted(false); };
  const toggleMute = () => setMuted((m) => !m);
  const toggleHeadphones = () => setHeadphonesMode((h) => !h);
  const startSleep = (mins) => { setSleepMinutesLeft(mins * 60); setSleepMenuOpen(false); };
  const cancelSleep = () => { setSleepMinutesLeft(0); setSleepMenuOpen(false); };

  /* Filters */
  const matchesFilter = useCallback(
    (track) => {
      if (!track) return false;
      const q = search.trim().toLowerCase();
      if (q) {
        const hay = `${track.title} ${track.singer} ${track.film} ${track.mood} ${track.decade}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.singer && !track.singer.includes(filters.singer)) return false;
      if (filters.film && track.film !== filters.film) return false;
      if (filters.author && !track.creator.includes(filters.author)) return false;
      if (filters.decade && track.decade !== filters.decade) return false;
      if (filters.mood && track.mood !== filters.mood) return false;
      return true;
    },
    [search, filters]
  );

  const filteredByMood = (moodFilterId) => {
    const mf = MOOD_FILTERS.find((m) => m.id === moodFilterId);
    if (!mf) return [];
    return TRACKS.filter((t) => (mf.mood ? t.mood === mf.mood : t.decade === mf.decade));
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
      setWarnings((w) => ({ ...w, [trackId]: 'Şərhiniz pozitiv mühit siyasətimizə uyğun deyil — zəhmət olmasa yenidən yazın 💛' }));
      return;
    }
    setWarnings((w) => ({ ...w, [trackId]: null }));
    setVideos((vs) =>
      vs.map((v) =>
        v.trackId === trackId
          ? { ...v, comments: [...v.comments, { id: Date.now(), user: 'Sən', text, time: 'indi' }] }
          : v
      )
    );
    setDrafts((d) => ({ ...d, [trackId]: '' }));
  };

  const toggleBookmarkTrack = (trackId) => {
    setBookmarkedTrackIds((ids) => (ids.includes(trackId) ? ids.filter((i) => i !== trackId) : [...ids, trackId]));
  };

  /* Radio Actions */
  const sendGift = (gift) => {
    setGiftHistory((h) => [{ id: Date.now(), user: 'Sən', gift: gift.name, time: 'indi' }, ...h].slice(0, 12));
    setTipJar((t) => t + gift.value);
    setWalletBalance((w) => w + Math.round(gift.value * 0.8));
    setCurrentGiftAnim(gift);
    setTimeout(() => setCurrentGiftAnim(null), 1400);
  };

  /* Together Actions */
  const toggleSync = () => setSyncActive((s) => !s);
  const addNote = (text) => setLoveNotes((n) => [...n, { id: Date.now(), author: 'Sən', text, time: 'indi' }]);
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
      />

      <main className="pb-32">
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
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            bookmarkedVideoIds={bookmarkedVideoIds}
            bookmarkedTrackIds={bookmarkedTrackIds}
            playTrack={playTrack}
          />
        )}
      </main>

      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        progress={progress}
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
      />
    </div>
  );
}