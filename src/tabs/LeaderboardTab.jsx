import React, { useState } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Crown, ShieldCheck } from 'lucide-react';

export default function LeaderboardTab({ creators = [], currentUser, onToggleVip }) {
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' | 'monthly'

  // Xalların hesablanması və sıralanması (İzləyici, bəyənmə, dinlənmə və repost əsasında)
  const rankedCreators = [...creators].map((creator) => {
    const score = 
      (creator.followersCount || 0) * 10 + 
      (creator.totalLikes || 0) * 5 + 
      (creator.totalPlays || 0 * 2) + 
      (creator.repostsCount || 0) * 8 +
      (creator.giftsScore || 0) * 15;
    
    // 100,000 xal həddini keçənlərə avtomatik VIP/Verified statusu
    const isVipEligible = score >= 100000;

    return {
      ...creator,
      score,
      isVipEligible
    };
  }).sort((a, b) => b.score - a.score);

  // Top 20 məhdudiyyəti
  const topCreators = rankedCreators.slice(0, 20);

  const getBadgeIcon = (index) => {
    if (index === 0) return <Medal className="w-6 h-6 text-yellow-400 drop-shadow" title="1-ci yer — Qızıl" />;
    if (index === 1) return <Medal className="w-6 h-6 text-slate-300 drop-shadow" title="2-ci yer — Gümüş" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600 drop-shadow" title="3-cü yer — Bürünc" />;
    return <span className="text-sm font-bold text-stone-400">#{index + 1}</span>;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Başlıq və Vaxt Filtrləri */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#362A27] p-5 rounded-2xl border border-[#C5A059]/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#F7F3ED]">Yaradıcılar Reytinqi</h2>
            <p className="text-xs text-[#D8BD84]">Platformanın ən fəal milli musiqi və retro yaradıcıları</p>
          </div>
        </div>

        <div className="flex items-center bg-[#2A211F] p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
              timeframe === 'weekly' 
                ? 'bg-[#C5A059] text-[#2A211F] font-semibold' 
                : 'text-stone-400 hover:text-[#F7F3ED]'
            }`}
          >
            Həftəlik
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
              timeframe === 'monthly' 
                ? 'bg-[#C5A059] text-[#2A211F] font-semibold' 
                : 'text-stone-400 hover:text-[#F7F3ED]'
            }`}
          >
            Aylıq
          </button>
        </div>
      </div>

      {/* Top 3 Xüsusi Podium Kartları */}
      {topCreators.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[topCreators[1], topCreators[0], topCreators[2]].map((creator, idx) => {
            // Sıralamanı vizual olaraq 2, 1, 3 kimi düzmək üçün
            const originalIndex = idx === 0 ? 1 : idx === 1 ? 0 : 2;
            const borderColors = originalIndex === 0 ? 'border-yellow-500 bg-yellow-500/10' : originalIndex === 1 ? 'border-slate-300 bg-slate-300/10' : 'border-amber-600 bg-amber-600/10';

            return (
              <div 
                key={creator.id || originalIndex}
                className={`flex flex-col items-center text-center p-4 bg-[#362A27] border rounded-2xl shadow-xl relative ${
                  originalIndex === 0 ? '-mt-4 border-[#C5A059] ring-2 ring-[#C5A059]/40' : 'border-stone-800'
                }`}
              >
                <div className="absolute top-2 right-2">
                  {getBadgeIcon(originalIndex)}
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-[#C5A059] overflow-hidden mb-2 shadow-inner bg-stone-900">
                  <img 
                    src={creator.avatar || '/logo.jpg'} 
                    alt={creator.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xs font-bold text-[#F7F3ED] truncate max-w-full">{creator.name}</h3>
                <p className="text-[10px] text-[#D8BD84] mb-2">{creator.specialty || 'Retro Yaradıcı'}</p>
                <div className="px-2.5 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold border border-[#C5A059]/40">
                  {creator.score.toLocaleString()} xal
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tam Siyahı (Top 20) */}
      <div className="bg-[#362A27] border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">Top Liderlər Cədvəli</span>
          <span className="text-xs text-stone-400">VIP Həddi: 100,000 xal</span>
        </div>

        <div className="divide-y divide-stone-800/80">
          {topCreators.map((creator, index) => (
            <div key={creator.id || index} className="p-4 flex items-center justify-between hover:bg-[#2A211F]/50 transition">
              <div className="flex items-center gap-4">
                <div className="w-8 flex justify-center shrink-0">
                  {getBadgeIcon(index)}
                </div>
                <div className="w-10 h-10 rounded-full border border-[#C5A059]/40 overflow-hidden bg-stone-900 shrink-0">
                  <img src={creator.avatar || '/logo.jpg'} alt={creator.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-[#F7F3ED]">{creator.name}</h4>
                    {creator.isVipEligible && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] border border-amber-500/30" title="VIP / Verified Star">
                        <ShieldCheck size={12} />
                        <span>VIP</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400">{creator.specialty || 'Musiqi İzləyicisi / Yaradıcı'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#C5A059]">{creator.score.toLocaleString()} xal</div>
                  <div className="text-[10px] text-stone-500">{creator.followersCount || 0} izləyici</div>
                </div>

                {currentUser?.isAdmin && (
                  <button
                    onClick={() => onToggleVip && onToggleVip(creator.id)}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-[#C5A059] transition"
                    title="VIP Statusunu Dəyiş"
                  >
                    <Crown size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}