// src/components/HomeTab.jsx
import React from 'react';
import { Play, Heart, MessageCircle, Share2, Music, Sparkles } from 'lucide-react';
import { TRACKS, SOCIAL_POSTS, FEED_SEED } from '../constants/data';

export default function HomeTab({ onPlayTrack, currentTrack, isPlaying }) {
  return (
    <div className="space-[#2A211F] text-[#F7F3ED] py-6 max-w-4xl mx-auto px-4 space-y-8">
      
      {/* Qarşılama Banneri */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[rgba(197,160,89,0.2)] to-[rgba(42,33,31,0.6)] border border-[rgba(197,160,89,0.3)]">
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#C5A059] mb-2">
          MeloDaily Axınına Xoş Gəldiniz ✨
        </h1>
        <p className="text-sm text-[#D8BD84] opacity-90">
          Zamansız retro melodiyalar, estetik kadrlar və həvəskar ifaçıların vahid məkanı.
        </p>
      </div>

      {/* Vahid Qarışıq Axın (Feed) */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[#C5A059]">
          <Sparkles size={18} /> Önə Çıxan Paylaşımlar və Musiqilər
        </h2>

        {/* 1. Musiqi Kartları */}
        {TRACKS.slice(0, 4).map((track) => (
          <div 
            key={`track-${track.id}`}
            className="p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 hover:border-[#C5A059]"
            style={{ background: 'rgba(247,243,237,0.05)', borderColor: 'rgba(197,160,89,0.2)' }}
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button 
                onClick={() => onPlayTrack(track)}
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition"
                style={{ background: '#C5A059', color: '#2A211F' }}
              >
                <Play size={20} fill="#2A211F" className="ml-0.5" />
              </button>
              <div>
                <h3 className="font-bold text-base text-[#F7F3ED]">{track.title}</h3>
                <p className="text-xs text-[#D8BD84]">{track.singer} · <span className="opacity-75">{track.film}</span></p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059]">
                  {track.decade}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs text-[#D8BD84]">
              <span className="flex items-center gap-1"><Music size={14} /> {track.genre}</span>
              <button onClick={() => onPlayTrack(track)} className="px-3 py-1.5 rounded-full border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2A211F] transition">
                Dinlə
              </button>
            </div>
          </div>
        ))}

        {/* 2. Sosial Postlar */}
        {SOCIAL_POSTS.map((post) => (
          <div 
            key={`post-${post.id}`}
            className="p-5 rounded-xl border space-y-3"
            style={{ background: 'rgba(247,243,237,0.03)', borderColor: 'rgba(197,160,89,0.15)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C5A059] text-[#2A211F] font-bold flex items-center justify-center text-sm">
                {post.avatarInitial}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[#F7F3ED]">{post.author}</h4>
                <p className="text-[11px] text-[#D8BD84] opacity-75">{post.time}</p>
              </div>
            </div>

            <p className="text-sm text-[#EFE7D8] leading-relaxed">{post.content}</p>

            <div className="flex items-center gap-6 pt-2 text-xs text-[#D8BD84] border-t border-[rgba(197,160,89,0.1)]">
              <button className="flex items-center gap-1.5 hover:text-[#C5A059] transition">
                <Heart size={15} /> {post.likes}
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#C5A059] transition">
                <MessageCircle size={15} /> {post.comments}
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#C5A059] transition ml-auto">
                <Share2 size={15} /> Paylaş
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}