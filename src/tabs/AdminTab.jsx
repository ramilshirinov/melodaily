import React, { useState } from 'react';
import { COLORS, bodyFont } from '../constants/data';
import { supabase } from '../lib/supabase';

export default function AdminTab({ tracks, setTracks, currentUser }) {
  const [title, setTitle] = useState('');
  const [singer, setSinger] = useState('');
  const [film, setFilm] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Yalnız Ramil Şirinov üçün giriş icazəsi
  const isOwner = currentUser.name === 'Ramil Şirinov' || currentUser.role === 'admin';

  if (!isOwner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[#F7F3ED]">
        <div className="bg-[#2A211F] border border-[#C5A059]/30 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-[#C5A059] mb-2">Giriş Məhduddur 🔒</h2>
          <p className="text-stone-300">Bu səhifəyə yalnız platformanın rəhbəri daxil ola bilər.</p>
        </div>
      </div>
    );
  }

  const handleAddTrack = async (e) => {
    e.preventDefault();
    if (!title || !singer || !audioUrl) {
      setMessage('Zəhmət olmasa əsas xanaları doldurun!');
      return;
    }

    setLoading(true);
    setMessage('');

    const newTrack = {
      title,
      singer,
      film: film || 'Klassik',
      category: 'Retro',
      mood: 'Nostaljik',
      decade: '1980-lər',
      creator: currentUser.name,
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150',
      audio_url: audioUrl,
      lyrics: 'Admin tərəfindən əlavə olundu.'
    };

    try {
      const { data, error } = await supabase
        .from('tracks')
        .insert([newTrack])
        .select();

      if (error) {
        setMessage(`Xəta baş verdi: ${error.message}`);
      } else if (data && data.length > 0) {
        setTracks((prev) => [data[0], ...prev]);
        setTitle('');
        setSinger('');
        setFilm('');
        setAudioUrl('');
        setMessage('Mahnı uğurla əlavə edildi! ✨');
      }
    } catch (err) {
      setMessage(`Bağlantı xətası: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrack = async (id) => {
    if (!window.confirm('Bu mahnını silmək istədiyinizə əminsinizmi?')) return;

    try {
      const { error } = await supabase.from('tracks').delete().eq('id', id);
      if (error) {
        alert(`Silinərkən xəta: ${error.message}`);
      } else {
        setTracks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-[#F7F3ED]">
      <div className="flex items-center justify-between mb-8 border-b border-[#C5A059]/20 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#C5A059]">Admin Panel 🛡️</h1>
          <p className="text-sm text-stone-400 mt-1">Platforma məzmununu idarə edin və yeni treklər əlavə edin.</p>
        </div>
        <div className="bg-[#3A2E2B] px-4 py-2 rounded-xl border border-[#C5A059]/30 text-sm">
          Aktiv Admin: <span className="text-[#C5A059] font-semibold">{currentUser.name}</span>
        </div>
      </div>

      {/* Yeni Trek Əlavəetmə Formu */}
      <div className="bg-[#3A2E2B]/60 border border-[#C5A059]/30 rounded-2xl p-6 mb-10 shadow-lg">
        <h2 className="text-xl font-semibold text-[#C5A059] mb-4">Yeni Trek Əlavə Et</h2>
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-sm text-[#D8BD84]">
            {message}
          </div>
        )}
        <form onSubmit={handleAddTrack} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-stone-400 mb-1">Mahnının Adı *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="məs. Sənsiz"
              className="w-full bg-[#2A211F] border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C5A059] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">İfaçı *</label>
            <input
              type="text"
              value={singer}
              onChange={(e) => setSinger(e.target.value)}
              placeholder="məs. Müslüm Maqomayev"
              className="w-full bg-[#2A211F] border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C5A059] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">Film / Album</label>
            <input
              type="text"
              value={film}
              onChange={(e) => setFilm(e.target.value)}
              placeholder="məs. Bizim Cəbiş Müəllim"
              className="w-full bg-[#2A211F] border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C5A059] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">Audio URL (Səs faylı) *</label>
            <input
              type="url"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://... link"
              className="w-full bg-[#2A211F] border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C5A059] outline-none"
            />
          </div>
          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C5A059] text-[#2A211F] font-bold py-3 rounded-xl hover:bg-[#d8bd84] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Yüklənir...' : 'Mahnını Bazaya Əlavə Et 🚀'}
            </button>
          </div>
        </form>
      </div>

      {/* Mövcud Treklərin Siyahısı və İdarəedilməsi */}
      <div className="bg-[#3A2E2B]/60 border border-[#C5A059]/30 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-[#C5A059] mb-4">Mövcud Treklər ({tracks.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-700 text-stone-400 text-xs">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Mahnı</th>
                <th className="py-3 px-4">İfaçı</th>
                <th className="py-3 px-4">Film / Kateqoriya</th>
                <th className="py-3 px-4 text-right">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-sm">
              {tracks.map((track) => (
                <tr key={track.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 px-4 text-stone-400">#{track.id}</td>
                  <td className="py-3 px-4 font-medium text-white">{track.title}</td>
                  <td className="py-3 px-4 text-stone-300">{track.singer}</td>
                  <td className="py-3 px-4 text-stone-400">{track.film || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteTrack(track.id)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    >
                      Sil 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}