import React, { useState } from 'react';
import { Users, Heart, MessageSquare, Send, Sparkles, Music, Share2 } from 'lucide-react';
import { displayFont, bodyFont } from '../constants/data';

export default function TogetherTab({ currentTrack = null, playTrack = () => {} }) {
  const [roomCode, setRoomCode] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, user: 'Aysel', text: 'Bu mahnı əla seçimdir!', time: '14:20' },
    { id: 2, user: 'Elvin', text: 'Səs keyfiyyəti superdir 🔥', time: '14:22' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: 'Siz',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8" style={{ fontFamily: bodyFont }}>
      
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
          <Users className="w-3.5 h-3.5" />
          <span>Birlikdə Dinlə</span>
        </div>
        <h2 
          className="text-2xl md:text-3xl font-bold text-amber-100"
          style={{ fontFamily: displayFont }}
        >
          Dostlarınızla Eyni Anda Musiqi Dinləyin
        </h2>
        <p className="text-sm text-amber-200/60 max-w-md mx-auto">
          Otaq yaradın və ya mövcud otağa qoşularaq retro musiqi həyəcanını bölüşün.
        </p>
      </div>

      {/* Room Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Create Room */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-amber-100" style={{ fontFamily: displayFont }}>
              Yeni Otaq Yarat
            </h4>
            <p className="text-xs text-amber-200/60">
              Şəxsi otaq yaradıb kodunu dostlarınızla paylaşın.
            </p>
          </div>
          <button
            onClick={() => alert('Otaq kodu yaradıldı!')}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Otaq Yarat
          </button>
        </div>

        {/* Join Room */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-amber-100" style={{ fontFamily: displayFont }}>
              Otağa Qoşul
            </h4>
            <p className="text-xs text-amber-200/60">
              Dostunuzun verdiyi otaq kodunu daxil edin.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Otaq kodu (məs: 8492)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="flex-1 bg-black/40 text-amber-100 placeholder-amber-200/40 text-sm px-3.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
            />
            <button
              onClick={() => roomCode && alert(`${roomCode} otağına qoşulursunuz...`)}
              className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-amber-100 font-medium text-sm transition-colors"
            >
              Qoşul
            </button>
          </div>
        </div>
      </div>

      {/* Live Chat & Listening Panel */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-base font-bold text-amber-100" style={{ fontFamily: displayFont }}>
              Aktiv Canlı Söhbət
            </h4>
          </div>
          <button 
            onClick={() => alert('Keçid linki kopyalandı!')}
            className="flex items-center gap-1.5 text-xs text-amber-200/60 hover:text-amber-100 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Dəvət Et
          </button>
        </div>

        {/* Messages Container */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-none">
          {messages.map((msg) => (
            <div key={msg.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">{msg.user}</span>
                <span className="text-amber-200/40">{msg.time}</span>
              </div>
              <p className="text-sm text-amber-100/90">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Send Message Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-black/40 text-amber-100 placeholder-amber-200/40 text-sm px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}