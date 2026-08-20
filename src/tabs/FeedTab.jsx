import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Send, AlertCircle, Check } from 'lucide-react';

export default function FeedTab({
  videos = [],
  matchesFilter,
  playTrack,
  currentTrack,
  isPlaying,
  likeVideo,
  bookmarkVideo,
  openComments,
  toggleComments,
  addComment,
  drafts,
  setDraft,
  warnings
}) {
  const [copiedId, setCopiedId] = useState(null);

  const filteredVideos = videos.filter((v) => !matchesFilter || matchesFilter(v));

  const handleShare = (trackId) => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedId(trackId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 text-stone-400">
          Axtarışınıza və ya filtrlərinizə uyğun retro video/paylaşım tapılmadı. 🎵
        </div>
      ) : (
        filteredVideos.map((item) => {
          const isCurrent = currentTrack?.id === item.trackId;
          const isVideoPlaying = isCurrent && isPlaying;
          const isOpen = openComments[item.trackId];
          const warning = warnings[item.trackId];
          const draftText = drafts[item.trackId] || '';

          return (
            <div
              key={item.id || item.trackId}
              className="bg-[#362A27] border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-xl transition hover:border-[#C5A059]/60"
            >
              {/* İstifadəçi & Başlıq Məlumatı */}
              <div className="p-4 flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-lg font-serif text-[#C5A059]">
                    🎬
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#F7F3ED]">{item.title}</h3>
                    <p className="text-xs text-[#D8BD84]">{item.singer} • {item.decade}</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
                  {item.film}
                </span>
              </div>

              {/* Video/Musiqi Media Sahəsi & Vinil Animasiyası */}
              <div className="relative bg-black/40 aspect-video flex items-center justify-center group overflow-hidden">
                <div
                  className={`w-28 h-28 rounded-full border-4 border-[#C5A059]/40 flex items-center justify-center transition-transform duration-700 ${
                    isVideoPlaying ? 'animate-[melo-spin_8s_linear_infinite]' : ''
                  }`}
                  style={{
                    background: 'radial-gradient(circle, #2A211F 30%, #1A1412 80%)',
                    boxShadow: isVideoPlaying ? '0 0 25px rgba(197,160,89,0.3)' : 'none'
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-xs text-[#C5A059]">
                    📻
                  </div>
                </div>

                {/* Ekvalayzer Animasiyası */}
                {isVideoPlaying && (
                  <div className="absolute bottom-3 left-4 flex items-end gap-1 h-6">
                    <span className="w-1 bg-[#C5A059] animate-bounce h-full rounded-full"></span>
                    <span className="w-1 bg-[#C5A059] animate-bounce h-2/3 rounded-full [animation-delay:0.2s]"></span>
                    <span className="w-1 bg-[#C5A059] animate-bounce h-4/5 rounded-full [animation-delay:0.4s]"></span>
                    <span className="w-1 bg-[#C5A059] animate-bounce h-1/2 rounded-full [animation-delay:0.1s]"></span>
                  </div>
                )}

                <button
                  onClick={() => playTrack(item)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-14 h-14 rounded-full bg-[#C5A059] text-[#2A211F] flex items-center justify-center text-xl font-bold shadow-lg hover:scale-110 transition-transform">
                    {isVideoPlaying ? '❚❚' : '▶'}
                  </div>
                </button>
              </div>

              {/* İnteraktiv Panel (Like, Comment, Share, Bookmark) */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                  <div className="flex items-center gap-4">
                    {/* Bəyənmə (Like) Düyməsi */}
                    <button
                      onClick={() => likeVideo(item.trackId)}
                      className="flex items-center gap-1.5 text-xs transition hover:scale-105"
                      style={{ color: item.liked ? '#E53E3E' : '#D8BD84' }}
                    >
                      <Heart size={18} className={item.liked ? 'fill-[#E53E3E]' : ''} />
                      <span>{item.likes}</span>
                    </button>

                    {/* Rəylər (Comment) Düyməsi */}
                    <button
                      onClick={() => toggleComments(item.trackId)}
                      className="flex items-center gap-1.5 text-xs transition hover:scale-105"
                      style={{ color: isOpen ? '#C5A059' : '#D8BD84' }}
                    >
                      <MessageCircle size={18} />
                      <span>{item.comments?.length || 0}</span>
                    </button>

                    {/* Paylaşma (Share) Düyməsi */}
                    <button
                      onClick={() => handleShare(item.trackId)}
                      className="flex items-center gap-1.5 text-xs transition hover:scale-105 text-[#D8BD84]"
                      title="Keçidi kopyala"
                    >
                      {copiedId === item.trackId ? (
                        <>
                          <Check size={18} className="text-green-400" />
                          <span className="text-green-400 font-medium">Kopyalandı!</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={18} />
                          <span>Paylaş</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Yadda saxla (Bookmark) Düyməsi */}
                  <button
                    onClick={() => bookmarkVideo(item.trackId)}
                    className="text-xs transition hover:scale-105"
                    style={{ color: item.bookmarked ? '#C5A059' : '#D8BD84' }}
                  >
                    <Bookmark size={18} className={item.bookmarked ? 'fill-[#C5A059]' : ''} />
                  </button>
                </div>

                {/* Rəylər (Comments) Açılan Paneli */}
                {isOpen && (
                  <div className="pt-3 border-t border-stone-800/80 space-y-3 animate-fadeIn">
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {item.comments && item.comments.length > 0 ? (
                        item.comments.map((c) => (
                          <div key={c.id} className="bg-[#2A211F]/70 p-2.5 rounded-xl border border-stone-800">
                            <div className="flex items-center justify-between text-[11px] text-[#C5A059] mb-1">
                              <span className="font-semibold">{c.user}</span>
                              <span className="text-stone-500">{c.time}</span>
                            </div>
                            <p className="text-xs text-stone-200">{c.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-stone-500 italic py-1">Hələ heç bir rəy yazılmayıb. İlk rəyi siz yazın! 😊</p>
                      )}
                    </div>

                    {/* Etik Qayda Xəbərdarlığı */}
                    {warning && (
                      <div className="flex items-center gap-2 p-2.5 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-300">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{warning}</span>
                      </div>
                    )}

                    {/* Rəy Yazma Forması */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nostaljik təəssüratınızı yazın..."
                        value={draftText}
                        onChange={(e) => setDraft(item.trackId, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addComment(item.trackId)}
                        className="flex-1 bg-[#2A211F] border border-stone-700/60 rounded-xl px-3 py-2 text-xs text-[#F7F3ED] placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
                      />
                      <button
                        onClick={() => addComment(item.trackId)}
                        className="p-2 rounded-xl bg-[#C5A059] text-[#2A211F] hover:bg-[#D8BD84] transition"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}