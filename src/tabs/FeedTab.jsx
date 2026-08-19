import React, { useState } from 'react';
import { Play, Pause, Heart, MessageCircle, Bookmark, Share2, ShieldCheck, Send } from 'lucide-react';
import { VinylArt, MoodBadge, DecadeBadge, SectionHeading, EmptyState } from '../components/Common';
import { COLORS, trackById, displayFont, bodyFont } from '../constants/data';

// Təhlükəsiz rəng xəritəsi (undefined xətalarının qarşısını almaq üçün)
const C = {
  bg: COLORS?.bg || '#2A211F',
  card: COLORS?.card || COLORS?.bronze || 'rgba(247,243,237,0.05)',
  gold: COLORS?.gold || '#C5A059',
  goldLight: COLORS?.goldLight || COLORS?.goldSoft || '#D8BD84',
  text: COLORS?.text || COLORS?.cream || '#F7F3ED',
  textMuted: COLORS?.textMuted || COLORS?.creamDeep || '#EFE7D8',
  border: COLORS?.border || 'rgba(197,160,89,0.22)',
  sage: COLORS?.sage || '#8A9A86',
  burgundy: COLORS?.burgundy || '#6E2C2C',
};

function FeedCard({ video, onPlay, isCurrentTrack, isPlaying, onToggleComments, commentsOpen, onLike, onBookmark, onAddComment, commentDraft, setCommentDraft, warning }) {
  const track = trackById(video.trackId);
  const [justLiked, setJustLiked] = useState(false);

  if (!track) return null;

  const handleLike = () => {
    onLike(video.trackId);
    setJustLiked(true);
    setTimeout(() => setJustLiked(false), 400);
  };

  return (
    <article
      className="rounded-2xl overflow-hidden border mb-5"
      style={{ background: C.card, borderColor: C.border }}
    >
      <div className="p-4 md:p-5 flex gap-4">
        <button onClick={() => onPlay(track)} className="relative group shrink-0">
          <VinylArt colors={track.colors} spinning={isCurrentTrack && isPlaying} size={72} label={track.title} />
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/30 transition">
            {isCurrentTrack && isPlaying ? (
              <Pause size={18} className="opacity-0 group-hover:opacity-100 transition" color={C.text} />
            ) : (
              <Play size={18} className="opacity-0 group-hover:opacity-100 transition" color={C.text} />
            )}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 style={{ fontFamily: displayFont, color: C.text, fontSize: 17 }} className="truncate">{track.title}</h3>
              <p style={{ fontFamily: bodyFont, color: C.goldLight, fontSize: 13 }} className="truncate">{track.singer}</p>
            </div>
            {isCurrentTrack && isPlaying && (
              <span className="flex items-center gap-1 text-[11px] shrink-0" style={{ color: C.gold, fontFamily: bodyFont }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.gold }} />
                indi çalır
              </span>
            )}
          </div>

          <p style={{ fontFamily: bodyFont, color: 'rgba(247,243,237,0.75)', fontSize: 13 }} className="mt-2 leading-relaxed">
            {video.desc}
          </p>

          <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: 'rgba(247,243,237,0.5)', fontFamily: bodyFont }}>
            <ShieldCheck size={12} style={{ color: C.sage }} />
            <span>Müəllif hüquqlarına hörmət: {track.creator}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <MoodBadge mood={track.mood} />
            <DecadeBadge decade={track.decade} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 md:px-5 pb-3">
        <div className="flex items-center gap-1">
          <button onClick={handleLike} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition" style={{ background: video.liked ? 'rgba(110,44,44,0.25)' : 'transparent' }}>
            <Heart
              size={17}
              style={{ transform: justLiked ? 'scale(1.35)' : 'scale(1)', transition: 'transform 0.25s ease' }}
              fill={video.liked ? C.burgundy : 'none'}
              color={video.liked ? C.burgundy : C.textMuted}
            />
            <span style={{ fontFamily: bodyFont, color: C.textMuted, fontSize: 13 }}>{video.likes}</span>
          </button>
          <button onClick={() => onToggleComments(video.trackId)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full">
            <MessageCircle size={17} color={C.textMuted} />
            <span style={{ fontFamily: bodyFont, color: C.textMuted, fontSize: 13 }}>{video.comments.length}</span>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onBookmark(video.trackId)} className="p-2 rounded-full">
            <Bookmark size={17} fill={video.bookmarked ? C.gold : 'none'} color={video.bookmarked ? C.gold : C.textMuted} />
          </button>
          <button className="p-2 rounded-full">
            <Share2 size={17} color={C.textMuted} />
          </button>
        </div>
      </div>

      {commentsOpen && (
        <div className="px-4 md:px-5 pb-5 pt-1 border-t" style={{ borderColor: 'rgba(197,160,89,0.15)' }}>
          <div className="flex items-center gap-1.5 mt-3 mb-2 text-[11px]" style={{ color: C.sage, fontFamily: bodyFont }}>
            <ShieldCheck size={12} />
            Etik Şərh Zonası — pozitiv əhval-ruhiyyə qorunur
          </div>
          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {video.comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <div
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-semibold"
                  style={{ background: C.gold, color: C.bg }}
                >
                  {c.user[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.text }}>
                    <span style={{ fontWeight: 700 }}>{c.user}</span>{' '}
                    <span style={{ color: 'rgba(247,243,237,0.5)', fontSize: 11 }}>· {c.time}</span>
                  </p>
                  <p style={{ fontFamily: bodyFont, fontSize: 13, color: 'rgba(247,243,237,0.85)' }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              value={commentDraft || ''}
              onChange={(e) => setCommentDraft(video.trackId, e.target.value)}
              placeholder="Xoş bir söz yaz..."
              className="flex-1 rounded-full px-3.5 py-2 text-xs outline-none"
              style={{ background: 'rgba(247,243,237,0.08)', color: C.text, border: '1px solid rgba(197,160,89,0.25)', fontFamily: bodyFont }}
              onKeyDown={(e) => e.key === 'Enter' && onAddComment(video.trackId)}
            />
            <button onClick={() => onAddComment(video.trackId)} className="p-2.5 rounded-full shrink-0" style={{ background: C.gold }}>
              <Send size={14} color={C.bg} />
            </button>
          </div>
          {warning && (
            <p className="mt-2 text-[11.5px]" style={{ color: C.burgundy, fontFamily: bodyFont }}>{warning}</p>
          )}
        </div>
      )}
    </article>
  );
}

export default function FeedTab({ videos = [], matchesFilter, playTrack, currentTrack, isPlaying, likeVideo, bookmarkVideo, openComments = {}, toggleComments, addComment, drafts = {}, setDraft, warnings = {} }) {
  const filtered = videos.filter((v) => matchesFilter(trackById(v.trackId)));
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6">
      <SectionHeading title="Estetik Axın" subtitle="Bərpa olunmuş retro kadrlar və zamansız melodiyalar" />
      {filtered.length === 0 && <EmptyState text="Bu filtrlərə uyğun video tapılmadı." />}
      {filtered.map((v) => (
        <FeedCard
          key={v.trackId}
          video={v}
          onPlay={playTrack}
          isCurrentTrack={currentTrack?.id === v.trackId}
          isPlaying={isPlaying}
          onToggleComments={toggleComments}
          commentsOpen={openComments[v.trackId]}
          onLike={likeVideo}
          onBookmark={bookmarkVideo}
          onAddComment={addComment}
          commentDraft={drafts[v.trackId]}
          setCommentDraft={setDraft}
          warning={warnings[v.trackId]}
        />
      ))}
    </div>
  );
}