import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Send, AlertCircle, Check, CornerDownRight, Repeat } from 'lucide-react';

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
  const [commentLikes, setCommentLikes] = useState({}); // Rəy bəyənmələri
  const [reposts, setReposts] = useState({}); // Təkrar paylaşmalar { trackId: { count, reposted } }

  const filteredVideos = videos.filter((v) => !matchesFilter || matchesFilter(v));

  // Təkrar paylaş (Repost) funksiyası
  const toggleRepost = (trackId, initialCount = 0) => {
    setReposts((prev) => {
      const current = prev[trackId] || { count: initialCount, reposted: false };
      return {
        ...prev,
        [trackId]: {
          count: current.reposted ? current.count - 1 : current.count + 1,
          reposted: !current.reposted
        }
      };
    });
  };

  // Nativ Paylaşma və ya Link Kopyalama
  const handleShare = async (trackId, title) => {
    const url = window.location.href;
    
    // Əgər cihaz Native Share API dəstəkləyirsə (Mobil menyunu açır)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'MeloDaily',
          text: 'Bu nostaljik paylaşımı dinləyin!',
          url: url,
        });
        return;
      } catch (err) {
        // İstifadəçi paylaşmanı ləğv etdikdə xəta verməməsi üçün
      }
    }

    // Əgər Native Share dəstəklənmirsə, linki kopyalayır
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(trackId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Rəyi kopyalayıb paylaşmaq
  const handleShareComment = (commentText, commentId) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(commentText);
    }
    setCopiedId(`comment-${commentId}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Rəyi bəyənmək
  const toggleCommentLike = (commentId, initialLikes = 0) => {
    setCommentLikes((prev) => {
      const current = prev[commentId] || { count: initialLikes, liked: false };
      return {
        ...prev,
        [commentId]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked
        }
      };
    });
  };

  // Rəyə cavab verdikdə tagging
  const handleReplyClick = (trackId, username) => {
    const currentText = drafts[trackId] || '';
    const mentionText = `@${username} `;
    if (!currentText.includes(mentionText)) {
      setDraft(trackId, `${mentionText}${currentText}`);
    }
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

          const repostData = reposts[item.trackId] || { count: item.reposts || 0, reposted: false };

          return (
            <div
              key={item.id || item.trackId}
              className="bg-[#362A27] border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-xl transition hover:border-[#C5A059]/60"
            >
              {/* Başlıq */}
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

              {/* Media Sahəsi */}
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

              {/* İnteraktiv Panel */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                  <div className="flex items-center gap-4">
                    {/* Bəyənmə */}
                    <button
                      onClick={() => likeVideo(item.trackId)}
                      className="flex items-center gap-1.5 text-xs transition hover:scale-105"
                      style={{ color: item.liked ? '#E53E3E' : '#D8BD84' }}
                    >
                      <Heart size={18} className={item.liked ? 'fill-[#E53E3E]' : ''} />
                      <span>{item.likes}</span>
                    </button>

                    {/* Rəylər */}
                    <button
                      onClick={() => toggleComments(item.trackId)}
                      className="flex items-center gap-1.5 text-xs transition hover:scale-105"
                      style={{ color: isOpen ? '#C5A059' : '#D8BD84' }}
                    >
                      <MessageCircle size={18} />
                      <span>{item.comments?.length || 0}</span>
                    </button>

                    {/* Təkrar Paylaş (Repost) */}
                    <button
                      onClick={() => toggleRepost(item.trackId, item.reposts || 0)}
                      className="flex items-center gap-1.5 text-xs transition hover:scale-105"
                      style={{ color: repostData.reposted ? '#48BB78' : '#D8BD84' }}
                      title="Təkrar paylaş (Repost)"
                    >
                      <Repeat size={18} className={repostData.reposted ? 'text-green-500' : ''} />
                      <span>{repostData.count}</span>
                    </button>

                    {/* Xarici Paylaşma (Share) */}
                    <button
                      onClick={() => handleShare(item.trackId, item.title)}
                      className="flex items-center gap-1.5 text-xs transition hover:scale-105 text-[#D8BD84]"
                      title="Paylaş"
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

                  {/* Bookmark */}
                  <button
                    onClick={() => bookmarkVideo(item.trackId)}
                    className="text-xs transition hover:scale-105"
                    style={{ color: item.bookmarked ? '#C5A059' : '#D8BD84' }}
                  >
                    <Bookmark size={18} className={item.bookmarked ? 'fill-[#C5A059]' : ''} />
                  </button>
                </div>

                {/* Rəylər Paneli */}
                {isOpen && (
                  <div className="pt-3 border-t border-stone-800/80 space-y-3 animate-fadeIn">
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {item.comments && item.comments.length > 0 ? (
                        item.comments.map((c) => {
                          const userName = c.user || c.author || 'İstifadəçi';
                          const cLikeData = commentLikes[c.id] || { count: c.likes || 0, liked: false };

                          return (
                            <div key={c.id} className="bg-[#2A211F]/70 p-2.5 rounded-xl border border-stone-800 space-y-2">
                              <div className="flex items-center justify-between text-[11px] text-[#C5A059]">
                                <span className="font-semibold">{userName}</span>
                                <span className="text-stone-500">{c.time}</span>
                              </div>
                              <p className="text-xs text-stone-200 leading-relaxed">{c.text}</p>
                              
                              <div className="flex items-center gap-4 pt-1 text-[11px] border-t border-stone-800/50">
                                <button
                                  onClick={() => toggleCommentLike(c.id, c.likes || 0)}
                                  className="flex items-center gap-1 hover:scale-105 transition"
                                  style={{ color: cLikeData.liked ? '#E53E3E' : '#D8BD84' }}
                                >
                                  <Heart size={13} className={cLikeData.liked ? 'fill-[#E53E3E]' : ''} />
                                  <span>{cLikeData.count > 0 ? cLikeData.count : ''} Bəyən</span>
                                </button>

                                <button
                                  onClick={() => handleReplyClick(item.trackId, userName)}
                                  className="flex items-center gap-1 text-[#D8BD84] hover:text-[#C5A059] transition"
                                >
                                  <CornerDownRight size={13} />
                                  <span>Cavab ver</span>
                                </button>

                                <button
                                  onClick={() => handleShareComment(c.text, c.id)}
                                  className="flex items-center gap-1 text-[#D8BD84] hover:text-[#C5A059] transition"
                                >
                                  {copiedId === `comment-${c.id}` ? (
                                    <span className="text-green-400 font-medium">Kopyalandı!</span>
                                  ) : (
                                    <>
                                      <Share2 size={12} />
                                      <span>Paylaş</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {c.replies && c.replies.length > 0 && (
                                <div className="ml-3 pl-2 border-l border-[#C5A059]/30 space-y-1.5 pt-1">
                                  {c.replies.map((r) => (
                                    <div key={r.id} className="bg-[#362A27]/60 p-1.5 rounded-lg text-xs">
                                      <div className="flex items-center justify-between text-[10px] text-[#C5A059]">
                                        <span className="font-semibold">{r.user || r.author}</span>
                                        <span className="text-stone-500">{r.time}</span>
                                      </div>
                                      <p className="text-stone-300 text-[11px] mt-0.5">{r.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-stone-500 italic py-1">Hələ heç bir rəy yazılmayıb. İlk rəyi siz yazın! 😊</p>
                      )}
                    </div>

                    {warning && (
                      <div className="flex items-center gap-2 p-2.5 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-300">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{warning}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nostaljik təəssüratınızı yazın... (@ ilə tag edin)"
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