import React, { useState } from 'react';
import { Search, Mic, PlusCircle, Filter } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  onAddNewTrack
}) {
  const [isListening, setIsListening] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSinger, setNewSinger] = useState('');
  const [newFilm, setNewFilm] = useState('');

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
      setSearch(transcript);
    };

    recognition.start();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newSinger) return;
    if (onAddNewTrack) {
      onAddNewTrack({ title: newTitle, singer: newSinger, film: newFilm || 'Klassik' });
    }
    setNewTitle('');
    setNewSinger('');
    setNewFilm('');
    setShowAddModal(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#2A211F]/95 border-b border-[#C5A059]/30 backdrop-blur-md px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Logo & Slogan */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 rounded-full bg-[#C5A059] flex items-center justify-center text-[#2A211F] font-bold shadow-md">
              🎷
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-wide text-[#F7F3ED] leading-none">
                Melo<span className="text-[#C5A059]">Daily</span>
              </span>
              <span className="text-[10px] text-[#D8BD84] font-medium tracking-wider mt-0.5">
                Milli Sosial & Musiqi Platforması
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="md:hidden p-2 text-[#C5A059]"
            title="Paylaşım / Musiqi əlavə et"
          >
            <PlusCircle size={22} />
          </button>
        </div>

        {/* Tab Menyu (TikTok + Instagram + Spotify Hibrid) */}
        <nav className="flex items-center gap-1 bg-[#362A27] p-1 rounded-xl border border-stone-800 text-xs font-medium">
          {[
            { id: 'home', label: 'Əsas' },
            { id: 'feed', label: 'Lenta (Sosial)' },
            { id: 'music', label: 'Audio Pleyer' },
            { id: 'radio', label: 'Canlı Radio' },
            { id: 'together', label: 'Birlikdə' },
            { id: 'profile', label: 'Profil' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === t.id
                  ? 'bg-[#C5A059] text-[#2A211F] font-bold shadow'
                  : 'text-[#D8BD84] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Axtarış, Səsli Axtarış & Post Əlavə Et */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Mahnı, profil, video axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl pl-9 pr-8 py-1.5 text-xs text-[#F7F3ED] placeholder-stone-400 focus:outline-none focus:border-[#C5A059]"
            />
            <button
              onClick={handleVoiceSearch}
              className={`absolute right-2 top-2 transition ${
                isListening ? 'text-red-400 animate-pulse' : 'text-[#D8BD84] hover:text-white'
              }`}
              title="Səsli Axtarış"
            >
              <Mic size={15} />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-xl bg-[#362A27] border border-stone-700/60 text-[#D8BD84] hover:text-white transition"
            title="Filtrlər"
          >
            <Filter size={16} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059] text-[#2A211F] rounded-xl text-xs font-semibold hover:bg-[#D8BD84] transition"
          >
            <PlusCircle size={16} />
            <span>Paylaşım Et</span>
          </button>
        </div>
      </div>

      {/* Post / Musiqi Əlavə Et Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#2A211F] border border-[#C5A059]/40 rounded-2xl max-w-md w-full p-6 text-[#F7F3ED] shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-[#C5A059] mb-1">Milli Sosial Lentə Paylaşım Et</h3>
            <p className="text-xs text-stone-400 mb-4">Lentada izləyicilərlə paylaşmaq üçün video klip və ya audio kontent əlavə edin.</p>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-[#D8BD84] mb-1">Başlıq / Mahnının Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Küçələrə Su Səpmişəm"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#D8BD84] mb-1">Müğənni / İfaçı / İdxalçı</label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Rəşid Behbudov"
                  value={newSinger}
                  onChange={(e) => setNewSinger(e.target.value)}
                  className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#D8BD84] mb-1">Kolleksiya / Film / Etiket</label>
                <input
                  type="text"
                  placeholder="Məs: Retro Video, Qızıl Fond"
                  value={newFilm}
                  onChange={(e) => setNewFilm(e.target.value)}
                  className="w-full bg-[#362A27] border border-stone-700/60 rounded-xl p-2.5 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-[#2A211F] hover:bg-[#D8BD84]"
                >
                  Paylaş
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}