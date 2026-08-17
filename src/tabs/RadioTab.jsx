import React from 'react';
import { Users, Wallet, CircleDollarSign, Gift, Crown, ShieldCheck } from 'lucide-react';
import { VinylArt, SectionHeading } from '../components/Common';
import { COLORS, GIFTS, displayFont, bodyFont } from '../constants/data';

export default function RadioTab({ listenerCount, giftHistory, sendGift, walletBalance, tipJar, isLive, currentGiftAnim }) {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-4">
      <SectionHeading title="MeloRadio" subtitle="Canlı efir — DJ Zülfiyyə ilə Qızıl Dövr Saatı" />

      <div className="rounded-2xl overflow-hidden border relative" style={{ borderColor: 'rgba(42,33,31,0.12)', background: `linear-gradient(135deg, ${COLORS.bronze}, #1c1614)` }}>
        <div className="p-6 flex items-center gap-5">
          <VinylArt colors={['#C5A059', '#2A211F']} spinning={isLive} size={88} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isLive && (
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{ background: COLORS.burgundy, color: COLORS.cream, ...bodyFont }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> CANLI
                </span>
              )}
              <span className="flex items-center gap-1 text-[12px]" style={{ color: COLORS.goldSoft, ...bodyFont }}>
                <Users size={12} /> {listenerCount.toLocaleString('az')} dinləyici
              </span>
            </div>
            <h3 style={{ ...displayFont, color: COLORS.cream, fontSize: 20 }}>Qızıl Dövr Saatı</h3>
            <p style={{ ...bodyFont, color: 'rgba(247,243,237,0.65)', fontSize: 13 }}>DJ Zülfiyyə · 1950-1980-ci illər arxiv seçimləri</p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-1.5 justify-end" style={{ color: COLORS.gold, ...bodyFont }}>
              <Wallet size={14} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>{walletBalance.toLocaleString('az')}</span>
            </div>
            <p style={{ ...bodyFont, color: 'rgba(247,243,237,0.5)', fontSize: 11 }}>Studiya Balansı</p>
          </div>
        </div>
        {currentGiftAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-giftPop flex flex-col items-center">
              <currentGiftAnim.icon size={54} color={currentGiftAnim.color} />
              <p style={{ ...displayFont, color: COLORS.cream, fontSize: 15 }} className="mt-1">{currentGiftAnim.name}!</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        {GIFTS.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.id}
              onClick={() => sendGift(g)}
              className="rounded-xl p-3.5 border flex flex-col items-center gap-1.5 transition hover:-translate-y-0.5"
              style={{ borderColor: 'rgba(42,33,31,0.12)', background: '#FFFDF9' }}
            >
              <Icon size={26} color={g.color} />
              <span style={{ ...bodyFont, color: COLORS.bronze, fontSize: 12.5, fontWeight: 600 }}>{g.name}</span>
              <span className="flex items-center gap-1" style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 11.5 }}>
                <CircleDollarSign size={11} /> {g.value}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <div className="rounded-2xl p-4 border" style={{ borderColor: 'rgba(42,33,31,0.12)', background: '#FFFDF9' }}>
          <div className="flex items-center gap-2 mb-3">
            <Gift size={15} color={COLORS.gold} />
            <h4 style={{ ...bodyFont, fontWeight: 700, color: COLORS.bronze, fontSize: 14 }}>Hədiyyə Tarixçəsi</h4>
          </div>
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {giftHistory.map((g) => (
              <div key={g.id} className="flex items-center justify-between text-[12.5px]" style={bodyFont}>
                <span style={{ color: COLORS.bronze }}><span style={{ fontWeight: 600 }}>{g.user}</span> göndərdi: {g.gift}</span>
                <span style={{ color: COLORS.inkGold, fontSize: 11 }}>{g.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-4 border flex flex-col justify-between" style={{ borderColor: 'rgba(42,33,31,0.12)', background: '#FFFDF9' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown size={15} color={COLORS.gold} />
              <h4 style={{ ...bodyFont, fontWeight: 700, color: COLORS.bronze, fontSize: 14 }}>Bəxşiş Qutusu (Tip Jar)</h4>
            </div>
            <p style={{ ...displayFont, color: COLORS.bronze, fontSize: 30 }} className="mt-1">{tipJar.toLocaleString('az')}</p>
            <p style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 12 }}>toplam məbləğ, bu bölmədə</p>
          </div>
          <p style={{ ...bodyFont, color: COLORS.sage, fontSize: 11.5 }} className="mt-3 flex items-center gap-1">
            <ShieldCheck size={12} /> Bütün hədiyyələr icraçının studiya balansına ədalətli şəkildə yönləndirilir.
          </p>
        </div>
      </div>
    </div>
  );
}