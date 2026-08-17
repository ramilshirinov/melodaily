import React, { useState } from 'react';
import { Play, Pause, Heart, MessageCircle, Bookmark, Share2, ShieldCheck, Send } from 'lucide-react';
import { VinylArt, MoodBadge, DecadeBadge, SectionHeading, EmptyState } from '../components/Common';
import { COLORS, trackById, displayFont, bodyFont } from '../constants/data';

function FeedCard({ video, onPlay, isCurrentTrack, isPlaying, onToggleComments, commentsOpen, onLike, onBookmark, onAddComment, commentDraft, setCommentDraft, warning }) {
  const track = trackById(video.trackId);
  const [justLiked, setJustLiked] = useState(false);

  const handleLike = () => {
    onLike(video.trackId);
    setJustLiked(true);
    setTimeout(() => setJustLiked(false), 400);
  };

  return (
    <article
      className="rounded-2xl overflow-hidden border mb-5"
      style={{ background: COLORS.bronze, borderColor: 'rgba(197,160,89,0.22)' }}
    >
      <div className="p-4 md:p-5 flex gap-4">
        <button onClick={() => onPlay(track)} className="relative group shrink-0">
          <VinylArt colors={track.colors} spinning={isCurrentTrack && isPlaying} size={72} label={track.title} />
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/30 transition">
            {isCurrentTrack && isPlaying ? (
              <Pause size={18} className="opacity-0 group-hover:opacity-100 transition" color={COLORS.cream} />
            ) : (
              <Play size={18} className="opacity-0 group-hover:opacity-100 transition" color={COLORS.cream} />
            )}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 style={{ ...displayFont, color: COLORS.cream, fontSize: 17 }} className="truncate">{track.title}</h3>
              <p style={{ ...bodyFont, color: COLORS.goldSoft, fontSize: 13 }} className="truncate">{track.singer}</p>
            </div>
            {isCurrentTrack && isPlaying && (
              <span className="flex items-center gap-1 text-[11px] shrink-0" style={{ color: COLORS.gold, ...bodyFont }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: COLORS.gold }} />
                indi çalır
              </span>
            )}
          </div>

          <p style={{ ...bodyFont, color: 'rgba(247,243,237,0.75)', fontSize: 13 }} className="mt-2 leading-relaxed">
            {video.desc}
          </p>

          <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: 'rgba(247,243,237,0.5)', ...bodyFont }}>
            <ShieldCheck size={12} style={{ color: COLORS.sage }} />
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
              fill={video.liked ? COLORS.burgundy : 'none'}
              color={video.liked ? COLORS.burgundy : COLORS.creamDeep}
            />
            <span style={{ ...bodyFont, color: COLORS.creamDeep, fontSize: 13 }}>{video.likes}</span>
          </button>
          <button onClick={() => onToggleComments(video.trackId)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full">
            <MessageCircle size={17} color={COLORS.creamDeep} />
            <span style={{ ...bodyFont, color: COLORS.creamDeep, fontSize: 13 }}>{video.comments.length}</span>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onBookmark(video.trackId)} className="p-2 rounded-full">
            <Bookmark size={17} fill={video.bookmarked ? COLORS.gold : 'none'} color={video.bookmarked ? COLORS.gold : COLORS.creamDeep} />
          </button>
          <button className="p-2 rounded-full">
            <Share2 size={17} color={COLORS.creamDeep} />
          </button>
        </div>
      </div>

      {commentsOpen && (
        <div className="px-4 md:px-5 pb-5 pt-1 border-t" style={{ borderColor: 'rgba(197,160,89,0.15)' }}>
          <div className="flex items-center gap-1.5 mt-3 mb-2 text-[11px]" style={{ color: COLORS.sage, ...bodyFont }}>
            <ShieldCheck size={12} />
            Etik Şərh Zonası — pozitiv əhval-ruhiyyə qorunur
          </div>
          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {video.comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <div
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-semibold"
                  style={{ background: COLORS.gold, color: COLORS.bronze }}
                >
                  {c.user[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ ...bodyFont, fontSize: 12.5, color: COLORS.cream }}>
                    <span style={{ fontWeight: 700 }}>{c.user}</span>{' '}
                    <span style={{ color: 'rgba(247,243,237,0.5)', fontSize: 11 }}>· {c.time}</span>
                  </p>
                  <p style={{ ...bodyFont, fontSize: 13, color: 'rgba(247,243,237,0.85)' }}>{c.text}</p>
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
              style={{ background: 'rgba(247,243,237,0.08)', color: COLORS.cream, border: '1px solid rgba(197,160,89,0.25)', ...bodyFont }}
              onKeyDown={(e) => e.key === 'Enter' && onAddComment(video.trackId)}
            />
            <button onClick={() => onAddComment(video.trackId)} className="p-2.5 rounded-full shrink-0" style={{ background: COLORS.gold }}>
              <Send size={14} color={COLORS.bronze} />
            </button>
          </div>
          {warning && (
            <p className="mt-2 text-[11.5px]" style={{ color: COLORS.burgundy, ...bodyFont }}>{warning}</p>
          )}
        </div>
      )}
    </article>
  );
}

export default function FeedTab({ videos, matchesFilter, playTrack, currentTrack, isPlaying, likeVideo, bookmarkVideo, openComments, toggleComments, addComment, drafts, setDraft, warnings }) {
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