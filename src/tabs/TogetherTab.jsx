import React, { useState, useRef } from 'react';
import { Headphones, Pause, Play, Sparkles, Heart, Send, ImagePlus, Plus } from 'lucide-react';
import { VinylArt, SectionHeading } from '../components/Common';
import { COLORS, MOOD_FILTERS, bodyFont, accentFont } from '../constants/data';

export default function TogetherTab({ syncActive, toggleSync, partnerName, coupleTrack, playTrack, isPlaying, currentTrack, loveNotes, addNote, memoryPhotos, addPhoto, selectedMood, setSelectedMood, filteredByMood }) {
  const [noteDraft, setNoteDraft] = useState('');
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => addPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-4">
      <SectionHeading title="Birlikdə Dinlə & Cütlüklər" subtitle="Sevdiklərinlə eyni anı, eyni notla yaşa" />

      <div className="rounded-2xl p-5 border" style={{ borderColor: 'rgba(42,33,31,0.12)', background: `linear-gradient(120deg, #FFFDF9, ${COLORS.creamDeep})` }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2" style={{ background: COLORS.gold, color: COLORS.bronze, borderColor: COLORS.cream }}>Sən</div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2" style={{ background: COLORS.burgundy, color: COLORS.cream, borderColor: COLORS.cream }}>
                {partnerName[0]}
              </div>
            </div>
            <div>
              <p style={{ ...bodyFont, fontWeight: 700, color: COLORS.bronze, fontSize: 14 }}>Sən & {partnerName}</p>
              <p style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 12 }}>{syncActive ? 'Sinxron dinləmə aktivdir' : 'Sinxron dinləmə deaktivdir'}</p>
            </div>
          </div>
          <button
            onClick={toggleSync}
            className="px-4 py-2 rounded-full text-sm flex items-center gap-2"
            style={{ background: syncActive ? COLORS.burgundy : COLORS.gold, color: syncActive ? COLORS.cream : COLORS.bronze, fontWeight: 600, ...bodyFont }}
          >
            <Headphones size={15} /> {syncActive ? 'Sinxronu Dayandır' : 'Birlikdə Dinlə'}
          </button>
        </div>

        {syncActive && (
          <div className="mt-4 rounded-xl p-3.5 flex items-center gap-3" style={{ background: 'rgba(197,160,89,0.12)' }}>
            <VinylArt colors={coupleTrack.colors} spinning={isPlaying && currentTrack?.id === coupleTrack.id} size={44} />
            <div className="flex-1 min-w-0">
              <p style={{ ...bodyFont, fontWeight: 600, color: COLORS.bronze, fontSize: 13 }} className="truncate">{coupleTrack.title}</p>
              <p style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 11.5 }}>Hər ikinizdə eyni anda çalınır</p>
            </div>
            <button onClick={() => playTrack(coupleTrack)} className="p-2 rounded-full" style={{ background: COLORS.bronze }}>
              {isPlaying && currentTrack?.id === coupleTrack.id ? <Pause size={13} color={COLORS.cream} /> : <Play size={13} color={COLORS.cream} />}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h4 style={{ ...bodyFont, fontWeight: 700, color: COLORS.bronze, fontSize: 14 }} className="mb-2 flex items-center gap-1.5">
          <Sparkles size={14} color={COLORS.gold} /> MeloMood AI Seçici
        </h4>
        <div className="flex flex-wrap gap-2">
          {MOOD_FILTERS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(selectedMood === m.id ? null : m.id)}
              className="px-3.5 py-2 rounded-full text-xs border transition"
              style={{
                background: selectedMood === m.id ? COLORS.bronze : '#FFFDF9',
                color: selectedMood === m.id ? COLORS.gold : COLORS.bronze,
                borderColor: 'rgba(42,33,31,0.15)',
                fontWeight: 600,
                ...bodyFont,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        {selectedMood && (
          <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
            {filteredByMood(selectedMood).map((t) => (
              <div key={t.id} className="flex items-center gap-2.5 rounded-xl p-2.5 border" style={{ borderColor: 'rgba(42,33,31,0.1)', background: '#FFFDF9' }}>
                <VinylArt colors={t.colors} spinning={currentTrack?.id === t.id && isPlaying} size={38} />
                <div className="flex-1 min-w-0">
                  <p style={{ ...bodyFont, fontWeight: 600, color: COLORS.bronze, fontSize: 12.5 }} className="truncate">{t.title}</p>
                  <p style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 11 }} className="truncate">{t.singer}</p>
                </div>
                <button onClick={() => playTrack(t)} className="p-1.5 rounded-full" style={{ background: COLORS.bronze }}>
                  {currentTrack?.id === t.id && isPlaying ? <Pause size={12} color={COLORS.cream} /> : <Play size={12} color={COLORS.cream} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <div className="rounded-2xl p-4 border" style={{ borderColor: 'rgba(42,33,31,0.12)', background: '#FFFDF9' }}>
          <div className="flex items-center gap-2 mb-3">
            <Heart size={15} color={COLORS.burgundy} fill={COLORS.burgundy} />
            <h4 style={{ ...bodyFont, fontWeight: 700, color: COLORS.bronze, fontSize: 14 }}>MeloCouple — Sevgi Qeydləri</h4>
          </div>
          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {loveNotes.map((n) => (
              <div key={n.id} className="rounded-lg p-2.5" style={{ background: 'rgba(110,44,44,0.06)' }}>
                <p style={{ ...bodyFont, fontSize: 12.5, color: COLORS.bronze }}>
                  <span style={{ fontWeight: 700 }}>{n.author}</span> <span style={{ color: COLORS.inkGold, fontSize: 11 }}>· {n.time}</span>
                </p>
                <p style={{ ...accentFont, fontSize: 14.5, fontStyle: 'italic', color: COLORS.bronze }} className="mt-0.5">"{n.text}"</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Ortaq qeyd yaz..."
              className="flex-1 rounded-full px-3.5 py-2 text-xs outline-none border"
              style={{ borderColor: 'rgba(42,33,31,0.15)', ...bodyFont }}
              onKeyDown={(e) => { if (e.key === 'Enter' && noteDraft.trim()) { addNote(noteDraft); setNoteDraft(''); } }}
            />
            <button
              onClick={() => { if (noteDraft.trim()) { addNote(noteDraft); setNoteDraft(''); } }}
              className="p-2.5 rounded-full shrink-0"
              style={{ background: COLORS.burgundy }}
            >
              <Send size={14} color={COLORS.cream} />
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-4 border" style={{ borderColor: 'rgba(42,33,31,0.12)', background: '#FFFDF9' }}>
          <div className="flex items-center gap-2 mb-3">
            <ImagePlus size={15} color={COLORS.gold} />
            <h4 style={{ ...bodyFont, fontWeight: 700, color: COLORS.bronze, fontSize: 14 }}>Ortaq Pleylist — Xatirə Şəkilləri</h4>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {memoryPhotos.map((p, i) => (
              <img key={i} src={p} alt="xatirə" className="w-full aspect-square object-cover rounded-lg" />
            ))}
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: COLORS.gold }}
            >
              <Plus size={18} color={COLORS.gold} />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <p style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 11.5 }}>Xatirə şəklini yükləyib ortaq pleylistə əlavə et.</p>
        </div>
      </div>
    </div>
  );
}