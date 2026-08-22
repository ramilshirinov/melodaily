import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Users, Music2, Trash2, Save, Search, Plus, Loader2,
  ShieldCheck, ShieldAlert, Ban, CheckCircle2, X, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ROLE_META, bodyFont, displayFont } from '../constants/data';

const ROLE_OPTIONS = ['listener', 'verified_creator', 'vip_star', 'admin', 'super_admin'];

export default function AdminPanel({ currentUser }) {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

  const [activeSection, setActiveSection] = useState('users'); // 'users' | 'tracks'

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div
          className="rounded-2xl p-10 border shadow-xl"
          style={{ background: '#2A211F', borderColor: 'rgba(197,160,89,0.3)' }}
        >
          <ShieldAlert size={40} className="mx-auto mb-3" style={{ color: '#C5A059' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: displayFont, color: '#C5A059' }}>
            İcazə yoxdur
          </h2>
          <p className="text-sm" style={{ color: '#D8BD84', fontFamily: bodyFont }}>
            Bu səhifəyə yalnız platforma administratorları daxil ola bilər.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" style={{ fontFamily: bodyFont }}>
      <div className="flex items-center justify-between mb-8 border-b pb-4" style={{ borderColor: 'rgba(197,160,89,0.2)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(197,160,89,0.15)', border: '1px solid rgba(197,160,89,0.4)' }}
          >
            <Shield size={20} style={{ color: '#C5A059' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: displayFont, color: '#C5A059' }}>
              Admin Paneli
            </h1>
            <p className="text-xs" style={{ color: '#D8BD84' }}>
              {currentUser.name} · {ROLE_META[currentUser.role]?.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#362A27', border: '1px solid rgba(197,160,89,0.2)' }}>
          <button
            onClick={() => setActiveSection('users')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition"
            style={{
              background: activeSection === 'users' ? '#C5A059' : 'transparent',
              color: activeSection === 'users' ? '#2A211F' : '#D8BD84',
            }}
          >
            <Users size={14} /> İstifadəçilər
          </button>
          <button
            onClick={() => setActiveSection('tracks')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition"
            style={{
              background: activeSection === 'tracks' ? '#C5A059' : 'transparent',
              color: activeSection === 'tracks' ? '#2A211F' : '#D8BD84',
            }}
          >
            <Music2 size={14} /> Treklər
          </button>
        </div>
      </div>

      {activeSection === 'users' ? (
        <UsersSection currentUser={currentUser} />
      ) : (
        <TracksSection currentUser={currentUser} />
      )}
    </div>
  );
}

/* ============================== İSTİFADƏÇİLƏR ============================== */

function UsersSection({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [draftRoles, setDraftRoles] = useState({});
  const [message, setMessage] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setMessage(`Xəta: ${error.message}`);
    } else {
      setUsers(data || []);
      setMessage('');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (u.name || '').toLowerCase().includes(q) || (u.username || '').toLowerCase().includes(q);
  });

  const handleRoleChange = (userId, newRole) => {
    setDraftRoles((d) => ({ ...d, [userId]: newRole }));
  };

  const handleSaveRole = async (user) => {
    const newRole = draftRoles[user.id] || user.role;
    if (newRole === user.role) return;

    setSavingId(user.id);
    // Mövcud RPC-dən istifadə edirik — o özü admin yoxlaması aparır
    const { error } = await supabase.rpc('admin_set_user_role', {
      target_user_id: user.id,
      new_role: newRole,
      new_verified: null,
    });

    if (error) {
      setMessage(`Rol dəyişdirilə bilmədi: ${error.message}`);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
      setMessage('');
    }
    setSavingId(null);
  };

  const handleToggleVerified = async (user) => {
    setSavingId(user.id);
    const { error } = await supabase.rpc('admin_set_user_role', {
      target_user_id: user.id,
      new_role: user.role,
      new_verified: !user.is_verified,
    });

    if (error) {
      setMessage(`Xəta: ${error.message}`);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_verified: !u.is_verified } : u)));
    }
    setSavingId(null);
  };

  const handleToggleBan = async (user) => {
    if (user.id === currentUser.id) {
      setMessage('Öz hesabınızı bloklaya bilməzsiniz.');
      return;
    }
    setSavingId(user.id);
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: !user.is_banned })
      .eq('id', user.id);

    if (error) {
      setMessage(`Xəta: ${error.message}`);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_banned: !u.is_banned } : u)));
    }
    setSavingId(null);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#D8BD84' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ad və ya istifadəçi adı axtar..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: '#362A27', color: '#F7F3ED', border: '1px solid rgba(197,160,89,0.25)' }}
          />
        </div>
        <button
          onClick={loadUsers}
          className="p-2.5 rounded-xl shrink-0"
          style={{ background: '#362A27', border: '1px solid rgba(197,160,89,0.25)', color: '#D8BD84' }}
          title="Yenilə"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.3)', color: '#D8BD84' }}>
          {message}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(197,160,89,0.2)', background: '#2A211F' }}>
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={24} className="mx-auto animate-spin" style={{ color: '#C5A059' }} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-sm" style={{ color: '#D8BD84' }}>İstifadəçi tapılmadı.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(197,160,89,0.1)' }}>
            {filtered.map((u) => {
              const draftRole = draftRoles[u.id] ?? u.role;
              const roleChanged = draftRole !== u.role;
              const roleMeta = ROLE_META[u.role] || ROLE_META.listener;

              return (
                <div key={u.id} className="p-4 flex flex-wrap items-center gap-3" style={{ opacity: u.is_banned ? 0.5 : 1 }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: 'rgba(197,160,89,0.15)', color: '#C5A059' }}
                  >
                    {(u.name || '?').charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-[140px] flex-1">
                    <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: '#F7F3ED' }}>
                      {u.name || 'Adsız İstifadəçi'}
                      {u.is_verified && <ShieldCheck size={13} style={{ color: '#C5A059' }} />}
                      {u.is_banned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">Bloklu</span>}
                    </p>
                    <p className="text-xs" style={{ color: '#D8BD84' }}>@{u.username || 'istifadeci'}</p>
                  </div>

                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                    style={{ background: 'rgba(197,160,89,0.1)', color: roleMeta.color }}
                  >
                    {roleMeta.badge} {roleMeta.label}
                  </span>

                  <select
                    value={draftRole}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={u.id === currentUser.id}
                    className="text-xs px-2.5 py-2 rounded-lg outline-none shrink-0 disabled:opacity-40"
                    style={{ background: '#362A27', color: '#F7F3ED', border: '1px solid rgba(197,160,89,0.25)' }}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{ROLE_META[r]?.label || r}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleSaveRole(u)}
                    disabled={!roleChanged || savingId === u.id || u.id === currentUser.id}
                    className="p-2 rounded-lg shrink-0 disabled:opacity-30 transition"
                    style={{ background: roleChanged ? '#C5A059' : '#362A27', color: roleChanged ? '#2A211F' : '#D8BD84' }}
                    title="Rolu yadda saxla"
                  >
                    {savingId === u.id ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  </button>

                  <button
                    onClick={() => handleToggleVerified(u)}
                    disabled={savingId === u.id}
                    className="p-2 rounded-lg shrink-0 transition"
                    style={{ background: u.is_verified ? 'rgba(197,160,89,0.2)' : '#362A27', color: '#C5A059' }}
                    title={u.is_verified ? 'Təsdiqi ləğv et' : 'Təsdiqlə (Verified)'}
                  >
                    <CheckCircle2 size={15} />
                  </button>

                  <button
                    onClick={() => handleToggleBan(u)}
                    disabled={savingId === u.id || u.id === currentUser.id}
                    className="p-2 rounded-lg shrink-0 transition disabled:opacity-30"
                    style={{ background: u.is_banned ? 'rgba(239,68,68,0.15)' : '#362A27', color: u.is_banned ? '#F87171' : '#D8BD84' }}
                    title={u.is_banned ? 'Blokdan çıxar' : 'Blokla'}
                  >
                    <Ban size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== TREKLƏR ============================== */

const EMPTY_TRACK = { title: '', singer: '', film: '', mood: '', decade: '', audio_url: '' };

function TracksSection() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(EMPTY_TRACK);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadTracks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tracks').select('*').order('id', { ascending: false });
    if (error) {
      setMessage(`Xəta: ${error.message}`);
    } else {
      setTracks(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  const filtered = tracks.filter((t) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (t.title || '').toLowerCase().includes(q) || (t.singer || '').toLowerCase().includes(q);
  });

  const handleAddTrack = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.singer.trim() || !form.audio_url.trim()) {
      setMessage('Başlıq, ifaçı və audio linki mütləqdir.');
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from('tracks')
      .insert([{
        title: form.title.trim(),
        singer: form.singer.trim(),
        film: form.film.trim() || 'Klassik',
        mood: form.mood.trim() || 'Nostaljik',
        decade: form.decade.trim() || '',
        audio_url: form.audio_url.trim(),
      }])
      .select();

    if (error) {
      setMessage(`Trek əlavə edilmədi: ${error.message}`);
    } else if (data?.length) {
      setTracks((prev) => [data[0], ...prev]);
      setForm(EMPTY_TRACK);
      setMessage('Trek uğurla əlavə edildi ✨');
    }
    setSubmitting(false);
  };

  const handleDeleteTrack = async (id) => {
    if (!window.confirm('Bu treki silmək istədiyinizə əminsiniz?')) return;
    const { error } = await supabase.from('tracks').delete().eq('id', id);
    if (error) {
      setMessage(`Silinərkən xəta: ${error.message}`);
    } else {
      setTracks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div>
      <form
        onSubmit={handleAddTrack}
        className="rounded-2xl p-5 mb-5 border grid grid-cols-1 md:grid-cols-2 gap-3"
        style={{ background: '#2A211F', borderColor: 'rgba(197,160,89,0.2)' }}
      >
        <h3 className="md:col-span-2 text-sm font-bold flex items-center gap-2" style={{ color: '#C5A059' }}>
          <Plus size={15} /> Yeni Trek Əlavə Et
        </h3>
        {[
          { key: 'title', label: 'Başlıq *' },
          { key: 'singer', label: 'İfaçı *' },
          { key: 'film', label: 'Film / Kolleksiya' },
          { key: 'mood', label: 'Əhval-ruhiyyə' },
          { key: 'decade', label: 'Onillik' },
          { key: 'audio_url', label: 'Audio URL *' },
        ].map((f) => (
          <input
            key={f.key}
            value={form[f.key]}
            onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
            placeholder={f.label}
            className="px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#362A27', color: '#F7F3ED', border: '1px solid rgba(197,160,89,0.25)' }}
          />
        ))}
        <button
          type="submit"
          disabled={submitting}
          className="md:col-span-2 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
          style={{ background: '#C5A059', color: '#2A211F' }}
        >
          {submitting ? 'Əlavə olunur...' : 'Bazaya Əlavə Et'}
        </button>
      </form>

      {message && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.3)', color: '#D8BD84' }}>
          {message}
        </div>
      )}

      <div className="relative mb-4 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#D8BD84' }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Trek axtar..."
          className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
          style={{ background: '#362A27', color: '#F7F3ED', border: '1px solid rgba(197,160,89,0.25)' }}
        />
      </div>

      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(197,160,89,0.2)', background: '#2A211F' }}>
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={24} className="mx-auto animate-spin" style={{ color: '#C5A059' }} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-sm" style={{ color: '#D8BD84' }}>Trek tapılmadı.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(197,160,89,0.1)' }}>
            {filtered.map((t) => (
              <div key={t.id} className="p-3.5 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate" style={{ color: '#F7F3ED' }}>{t.title}</p>
                  <p className="text-xs truncate" style={{ color: '#D8BD84' }}>{t.singer} · {t.film || '—'}</p>
                </div>
                <button
                  onClick={() => handleDeleteTrack(t.id)}
                  className="p-2 rounded-lg shrink-0"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171' }}
                  title="Sil"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}