import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Send, CornerDownRight, Check, Compass, Users, Award, Sparkles } from 'lucide-react';

export default function HomeTab({ feedVideos = [], playTrack, currentTrack, isPlaying, search = '' }) {
  const [subTab, setSubTab] = useState('discover'); // 'discover' | 'following' | 'golden'
  
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Aysel Rzayeva',
      username: 'aysel_rzayeva',
      time: 'Dünən',
      content: 'Nənəmin evində tapılan qədim qrammofonun səsini çəkdim, dinləyin. #retro #gramophone @ramil',
      likes: 238,
      liked: false,
      isGolden: true,
      comments: [
        { id: 101, user: 'Elvin.M', text: 'Möhtəşəm tapıntıdır! 😍', time: '12s əvvəl', replies: [] }
      ]
    },
    {
      id: 2,
      author: 'Kamran Hüseynov',
      username: 'kamran_h',
      time: 'Dünən',
      content: 'Sinatra ilə bu axşam kofemi içirəm ☕ — "Fly Me to the Moon" əla seçimdir. #jazz #sinatra',
      likes: 45,
      liked: false,
      isGolden: false,
      comments: []
    },
    {
      id: 3,
      author: 'Sevinc Abbasova',
      username: 'sevinc_ab',
      time: '2 gün əvvəl',
      content: 'Bakı Bulvarında gün batımı və Piaf sədaları 🌅 #baku #oldbaku',
      likes: 97,
      liked: false,
      isGolden: true,
      comments: []
    }
  ]);

  const [openComments, setOpenComments] = useState({});
  const [draftComments, setDraftComments] = useState({});
  const [replyingTo, setReplyingTo] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Bəyənmə mexanizmi
  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  // Rəy panelini aç/bağla
  const toggleComments = (postId) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Link kopyalama
  const handleShare = (postId) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Cavab vermə zamanı @username əlavə olunması
  const startReply = (postId, commentId, username) => {
    setReplyingTo(prev => ({ ...prev, [postId]: { commentId, username } }));
    setDraftComments(prev => ({
      ...prev,
      [postId]: `@${username} `
    }));
  };

  // Rəy göndərmə
  const handleSendComment = (postId) => {
    const text = (draftComments[postId] || '').trim();
    if (!text) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const replyInfo = replyingTo[postId];
        if (replyInfo) {
          const updatedComments = p.comments.map(c => {
            if (c.id === replyInfo.commentId) {
              return {
                ...c,
                replies: [
                  ...(c.replies || []),
                  { id: Date.now(), user: 'Ramil Şirinov', text, time: 'indi' }
                ]
              };
            }
            return c;
          });
          return { ...p, comments: updatedComments };
        } else {
          return {
            ...p,
            comments: [
              ...p.comments,
              { id: Date.now(), user: 'Ramil Şirinov', text, time: 'indi', replies: [] }
            ]
          };
        }
      }
      return p;
    }));

    setDraftComments(prev => ({ ...prev, [postId]: '' }));
    setReplyingTo(prev => ({ ...prev, [postId]: null }));
  };

  // Qlobal Header axtarışı və Azərbaycan hərflərini dəstəkləyən filtrləmə
  const filteredPosts = posts.filter(p => {
    const matchesSubTab = 
      subTab === 'golden' ? p.isGolden : 
      subTab === 'following' ? true : true; 

    const query = (search || '').toLocaleLowerCase('az');
    const matchesSearch = 
      p.content.toLocaleLowerCase('az').includes(query) || 
      p.author.toLocaleLowerCase('az').includes(query);

    return matchesSubTab && matchesSearch;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Home Sub-Menyu (Discover / Following / Qızıl Fond) */}
      <div className="flex items-center justify-center gap-2 bg-[#362A27] p-1.5 rounded-2xl border border-[#C5A059]/30">
        <button
          onClick={() => setSubTab('discover')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            subTab === 'discover'
              ? 'bg-[#C5A059] text-[#2A211F] shadow'
              : 'text-[#D8BD84] hover:text-white'
          }`}
        >
          <Compass size={15} />
          <span>Kəşf Et</span>
        </button>

        <button
          onClick={() => setSubTab('following')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            subTab === 'following'
              ? 'bg-[#C5A059] text-[#2A211F] shadow'
              : 'text-[#D8BD84] hover:text-white'
          }`}
        >
          <Users size={15} />
          <span>İzlənilənlər</span>
        </button>

        <button
          onClick={() => setSubTab('golden')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            subTab === 'golden'
              ? 'bg-[#C5A059] text-[#2A211F] shadow'
              : 'text-[#D8BD84] hover:text-white'
          }`}
        >
          <Award size={15} />
          <span>Qızıl Fond</span>
        </button>
      </div>

      {/* Postların siyahısı */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-xs">
            Axtarışınıza uyğun paylaşım tapılmadı. 📻
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isOpen = openComments[post.id];
            const draftText = draftComments[post.id] || '';

            return (
              <div key={post.id} className="bg-[#362A27] border border-[#C5A059]/30 rounded-2xl p-5 shadow-lg space-y-4">
                
                {/* Post Sahibi və Qızıl Fond nişanı */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center font-bold text-[#C5A059]">
                      {post.author[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#F7F3ED] flex items-center gap-1.5">
                        {post.author}
                        {post.isGolden && (
                          <span className="text-[10px] bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles size={10} /> Qızıl Fond
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-stone-400">{post.time}</span>
                    </div>
                  </div>
                </div>

                {/* Mətn */}
                <p className="text-sm text-stone-200 leading-relaxed">{post.content}</p>

                {/* İnteraktiv Düymələr */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-800/80 text-xs text-[#D8BD84]">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-1.5 hover:scale-105 transition"
                      style={{ color: post.liked ? '#E53E3E' : '#D8BD84' }}
                    >
                      <Heart size={18} className={post.liked ? 'fill-[#E53E3E]' : ''} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 hover:scale-105 transition hover:text-[#C5A059]"
                    >
                      <MessageCircle size={18} />
                      <span>{post.comments.length}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1.5 hover:text-[#C5A059] transition"
                  >
                    {copiedId === post.id ? (
                      <>
                        <Check size={16} className="text-green-400" />
                        <span className="text-green-400 font-medium">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={16} />
                        <span>Paylaş</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Rəylər Bölməsi */}
                {isOpen && (
                  <div className="pt-3 border-t border-stone-800 space-y-3 animate-fadeIn">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {post.comments.length > 0 ? (
                        post.comments.map((c) => (
                          <div key={c.id} className="bg-[#2A211F] p-3 rounded-xl border border-stone-800/80 space-y-2">
                            <div className="flex items-center justify-between text-xs text-[#C5A059]">
                              <span className="font-semibold">{c.user}</span>
                              <span className="text-stone-500 text-[10px]">{c.time}</span>
                            </div>
                            <p className="text-xs text-stone-200">{c.text}</p>

                            <button
                              onClick={() => startReply(post.id, c.id, c.user)}
                              className="flex items-center gap-1 text-[11px] text-[#D8BD84] hover:text-[#C5A059] transition pt-1"
                            >
                              <CornerDownRight size={13} />
                              <span>Cavab ver</span>
                            </button>

                            {c.replies && c.replies.length > 0 && (
                              <div className="ml-4 pl-3 border-l-2 border-[#C5A059]/30 space-y-2 pt-2">
                                {c.replies.map((r) => (
                                  <div key={r.id} className="bg-[#362A27]/60 p-2 rounded-lg text-xs">
                                    <div className="flex items-center justify-between text-[10px] text-[#C5A059]">
                                      <span className="font-semibold">{r.user}</span>
                                      <span className="text-stone-500">{r.time}</span>
                                    </div>
                                    <p className="text-stone-300 mt-0.5">{r.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-stone-500 italic">Hələ rəy yazılmayıb. İlk rəyi siz yazın!</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nostaljik təəssüratınızı yazın... (@ ilə tag edin)"
                        value={draftText}
                        onChange={(e) => setDraftComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                        className="flex-1 bg-[#2A211F] border border-stone-700 rounded-xl px-3 py-2 text-xs text-[#F7F3ED] focus:outline-none focus:border-[#C5A059]"
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        className="p-2 rounded-xl bg-[#C5A059] text-[#2A211F] hover:bg-[#D8BD84] transition"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}