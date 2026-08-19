import React from 'react';
import { 
  Radio, 
  Users, 
  Gift, 
  Wallet, 
  Sparkles, 
  Play, 
  Pause, 
  Heart 
} from 'lucide-react';
import { GIFTS, COLORS, displayFont, bodyFont } from '../constants/data';

export default function RadioTab({
  listenerCount = 1200,
  giftHistory = [],
  sendGift = () => {},
  walletBalance = 0,
  tipJar = 0,
  isLive = true,
  currentGiftAnim = null,
  playTrack = () => {},
  currentTrack = null,
  isPlaying = false
}) {
  const radioTrack = {
    id: 999,
    title: 'Retro Baku Live FM',
    singer: 'Canlı Yayım',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60'
  };

  const isCurrentRadio = currentTrack?.id === radioTrack.id;
  const isRadioPlaying = isCurrentRadio && isPlaying;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6" style={{ fontFamily: bodyFont }}>
      {/* Gift Pop-up Animation Overlay */}
      {currentGiftAnim && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-giftPop bg-black/80 backdrop-blur-md p-6 rounded-2xl text-center border border-yellow-500/30">
            <span className="text-6xl block mb-2">{currentGiftAnim.icon || '🎁'}</span>
            <p className="text-yellow-400 font-bold text-lg">{currentGiftAnim.name}</p>
            <p className="text-xs text-amber-200/80">Hədiyyə Göndərildi!</p>
          </div>
        </div>
      )}

      {/* Main Radio Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          background: `linear-gradient(135deg, ${COLORS?.cardBg || '#1F1816'}, ${COLORS?.bg || '#2A211F'})`
        }}
      >
        <div className="flex items-center gap-5">
          <div className="relative group">
            <img
              src={radioTrack.cover}
              alt="Radio Live"
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg border border-amber-500/20"
            />
            {isLive && (
              <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> CANLI
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-5 h-5 text-amber-400" />
              <span className="text-xs uppercase tracking-widest text-amber-400/80 font-semibold">
                On-Air Radio
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-100" style={{ fontFamily: displayFont }}>
              {radioTrack.title}
            </h2>
            <p className="text-sm text-amber-200/70 mt-1">Nostalji Bakı hitləri və canlı interaktiv yayım</p>

            <div className="flex items-center gap-4 mt-3 text-xs text-amber-300/80">
              <span className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <Users className="w-3.5 h-3.5 text-amber-400" /> {listenerCount.toLocaleString()} Dinləyici
              </span>
            </div>
          </div>
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          onClick={() => playTrack(radioTrack)}
          className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-amber-950 flex items-center justify-center transition-all transform hover:scale-105 shadow-xl shadow-amber-500/20 flex-shrink-0"
        >
          {isRadioPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
      </div>

      {/* Grid Section: Gifts & Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gift Sending Panel (2 cols) */}
        <div 
          className="md:col-span-2 p-6 rounded-2xl border border-white/10"
          style={{ background: COLORS?.cardBg || '#1F1816' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-amber-100 flex items-center gap-2" style={{ fontFamily: displayFont }}>
              <Gift className="w-5 h-5 text-amber-400" /> Aparıcıya Hədiyyə Göndər
            </h3>
            <span className="text-xs text-amber-300/60 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" /> Balans: {walletBalance} Qızıl
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(GIFTS || []).map((gift) => (
              <button
                key={gift.id || gift.name}
                onClick={() => sendGift(gift)}
                className="p-3 rounded-xl border border-amber-500/10 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 transition-all flex flex-col items-center text-center group"
              >
                <span className="text-3xl mb-1 transform group-hover:scale-110 transition-transform">
                  {gift.icon || '🎁'}
                </span>
                <span className="text-xs font-semibold text-amber-200">{gift.name}</span>
                <span className="text-[10px] text-amber-400 mt-0.5">+{gift.value} Qızıl</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Gift History Feed (1 col) */}
        <div 
          className="p-6 rounded-2xl border border-white/10 flex flex-col h-full"
          style={{ background: COLORS?.cardBg || '#1F1816' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-amber-100 flex items-center gap-2" style={{ fontFamily: displayFont }}>
              <Sparkles className="w-4 h-4 text-amber-400" /> Canlı Hədiyyələr
            </h3>
            <span className="text-xs text-amber-400/80 font-mono">Toplam: {tipJar}</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1 scrollbar-none flex-1">
            {giftHistory.length === 0 ? (
              <p className="text-xs text-amber-200/40 text-center py-6">Hələ hədiyyə göndərilməyib</p>
            ) : (
              giftHistory.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs animate-fadeIn"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-3 h-3 text-red-400 fill-red-400/20" />
                    <span className="font-semibold text-amber-200">{item.user}</span>
                  </div>
                  <span className="text-amber-400 font-medium">{item.gift}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}