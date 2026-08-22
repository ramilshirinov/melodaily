// src/constants/data.js

/* ============================================================
   MeloDaily — Mərkəzi Data Mənbəyi
   Bu fayl bütün tətbiq üçün: mahnı kataloqu, janrlar, sosial
   postlar, hədiyyələr, əhval-ruhiyyə filtrləri və s. saxlayır.

   QEYD (audio haqqında): Tanınmış ifaçıların əsl kommersiya
   səsyazılarını paylaşmaq müəllif hüquqlarını pozduğu üçün,
   audioUrl sahələrində pulsuz lisenziyalı SoundHelix demo
   treklərindən istifadə olunub — player REAL işləyir. Production
   üçün bu linkləri öz lisenziyalı fayllarınızla (məs. /public/audio/…
   və ya öz CDN-iniz) əvəz edin.
============================================================ */

// ---------- Janrlar ----------
export const GENRES = [
  { id: 'all', label: 'Hamısı' },
  { id: 'retro', label: 'Retro' },
  { id: 'jazz', label: 'Caz' },
  { id: 'pop', label: 'Pop' },
  { id: 'rock', label: 'Rok' },
  { id: 'classical', label: 'Klassik' },
  { id: 'aesthetic', label: 'Estetik' },
];

// ---------- Demo audio hovuzu (SoundHelix — pulsuz, lisenziyalı) ----------
const DEMO_AUDIO = (n) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

// ---------- Əsas Mahnı Kataloqu ----------
export const TRACKS = [
  // --- Azərbaycan Retrosu ---
  { id: 1, title: 'Sevgi Nəğməsi', singer: 'Şövkət Ələkbərova', film: 'Arşın Mal Alan', creator: 'Rejissor: Rza Təhmasib · 1945', mood: 'Romantik', decade: '1940-lar', genre: 'retro', isForeign: false, duration: 194, colors: ['#C5A059', '#2A211F'], audioUrl: DEMO_AUDIO(1) },
  { id: 2, title: 'Bakı Gecələri', singer: 'Rəşid Behbudov', film: 'O Olmasın, Bu Olsun', creator: 'Rejissor: Hüseyn Seyidzadə · 1956', mood: 'Nostaljik', decade: '1950-lar', genre: 'retro', isForeign: false, duration: 210, colors: ['#8B6F3E', '#2A211F'], audioUrl: DEMO_AUDIO(2) },
  { id: 3, title: 'Qərənfil', singer: 'Elmira Rəhimova', film: 'Studiya Konsert Arxivi', creator: 'Azərbaycan Dövlət Filarmoniyası · 1963', mood: 'Kədərli-Şirin', decade: '1960-lar', genre: 'classical', isForeign: false, duration: 178, colors: ['#C5A059', '#6E2C2C'], audioUrl: DEMO_AUDIO(3) },
  { id: 4, title: 'Sən Getdin', singer: 'Müslüm Maqomayev', film: 'Konsert Zalı Arxivi', creator: 'Azərbaycan Dövlət Televiziyası · 1971', mood: 'Romantik', decade: '1970-lar', genre: 'classical', isForeign: false, duration: 225, colors: ['#B08D4F', '#2A211F'], audioUrl: DEMO_AUDIO(4) },
  { id: 5, title: 'Yağış Yağır', singer: 'Nüşabə Muradova', film: 'Bakı Radio Arxivi', creator: 'Azərbaycan Dövlət Radiosu · 1985', mood: 'Rahatlıq', decade: '1980-lar', genre: 'retro', isForeign: false, duration: 200, colors: ['#7C8B6F', '#2A211F'], audioUrl: DEMO_AUDIO(5) },
  { id: 6, title: 'Payız Simfoniyası', singer: 'Kamilə Nəbiyeva', film: 'Payız Duyğuları', creator: 'AzTV Arxivi · 1992', mood: 'Nostaljik', decade: '1990-lar', genre: 'retro', isForeign: false, duration: 240, colors: ['#C5A059', '#4A3A2A'], audioUrl: DEMO_AUDIO(6) },
  { id: 7, title: 'Gecə Küçələri', singer: 'Günay İbrahimli', film: 'Şəhər Simfoniyası', creator: 'Bakı Kinostudiyası · 1988', mood: 'Gecə', decade: '1980-lar', genre: 'aesthetic', isForeign: false, duration: 188, colors: ['#33324A', '#2A211F'], audioUrl: DEMO_AUDIO(7) },
  { id: 8, title: 'Səhər Duası', singer: 'Elmira Rəhimova', film: 'Sübh Mahnıları', creator: 'Azərbaycan Dövlət Filarmoniyası · 1965', mood: 'Səhər', decade: '1960-lar', genre: 'classical', isForeign: false, duration: 165, colors: ['#C5A059', '#8B6F3E'], audioUrl: DEMO_AUDIO(8) },
  { id: 9, title: 'Xatirələr Kitabı', singer: 'Şövkət Ələkbərova', film: 'Köhnə Albom', creator: 'Studiya Arxivi · 1958', mood: 'Nostaljik', decade: '1950-lar', genre: 'retro', isForeign: false, duration: 215, colors: ['#B08D4F', '#2A211F'], audioUrl: DEMO_AUDIO(9) },
  { id: 10, title: 'Bizim Nəğmə', singer: 'Rəşid Behbudov & Şövkət Ələkbərova', film: 'İki Ürək', creator: 'Bakı Kinostudiyası · 1962', mood: 'Romantik', decade: '1960-lar', genre: 'retro', isForeign: false, duration: 230, colors: ['#C5A059', '#6E2C2C'], audioUrl: DEMO_AUDIO(10) },

  // --- Xarici Zamansız Klassiklər (isForeign: true) ---
  { id: 11, title: 'Fly Me to the Moon', singer: 'Frank Sinatra', film: 'Reprise Records Arxivi', creator: 'Bert Kaempfert bəstəsi · 1964', mood: 'Romantik', decade: '1960-lar', genre: 'jazz', isForeign: true, duration: 148, colors: ['#8B6F3E', '#2A211F'], audioUrl: DEMO_AUDIO(11) },
  { id: 12, title: 'La Vie en Rose', singer: 'Édith Piaf', film: 'Paris Studio Arxivi', creator: 'Louiguy bəstəsi · 1947', mood: 'Romantik', decade: '1940-lar', genre: 'jazz', isForeign: true, duration: 198, colors: ['#6E2C2C', '#2A211F'], audioUrl: DEMO_AUDIO(12) },
  { id: 13, title: "That's Amore", singer: 'Dean Martin', film: 'Capitol Records Arxivi', creator: 'Harry Warren bəstəsi · 1953', mood: 'Şən', decade: '1950-lar', genre: 'pop', isForeign: true, duration: 190, colors: ['#C5A059', '#4A3A2A'], audioUrl: DEMO_AUDIO(13) },
  { id: 14, title: 'Unforgettable', singer: 'Nat King Cole', film: 'Capitol Studio Arxivi', creator: 'Irving Gordon bəstəsi · 1951', mood: 'Romantik', decade: '1950-lar', genre: 'jazz', isForeign: true, duration: 200, colors: ['#8B6F3E', '#33324A'], audioUrl: DEMO_AUDIO(14) },
  { id: 15, title: 'Historia de un Amor', singer: 'Julio Iglesias', film: 'Discos CBS Arxivi', creator: 'Carlos Eleta Almarán bəstəsi · 1977', mood: 'Nostaljik', decade: '1970-lar', genre: 'pop', isForeign: true, duration: 210, colors: ['#B08D4F', '#2A211F'], audioUrl: DEMO_AUDIO(15) },
  { id: 21, title: 'Yesterday', singer: 'The Beatles', film: 'Parlophone Arxivi', creator: 'Lennon–McCartney bəstəsi · 1965', mood: 'Kədərli-Şirin', decade: '1960-lar', genre: 'rock', isForeign: true, duration: 125, colors: ['#33324A', '#2A211F'], audioUrl: DEMO_AUDIO(16) },

  // --- Müasir və Zamansız İfalar ---
  { id: 16, title: 'Gecənin Sonu', singer: 'Zülfiyyə Xanbabayeva', film: 'Stüdiya Buraxılışı', creator: 'Müasir Estrada Arxivi · 2016', mood: 'Romantik', decade: '2010-lar', genre: 'pop', isForeign: false, duration: 205, colors: ['#C5A059', '#6E2C2C'], audioUrl: DEMO_AUDIO(1) },
  { id: 17, title: 'Come Away With Me', singer: 'Norah Jones', film: 'Blue Note Records Arxivi', creator: 'Norah Jones bəstəsi · 2002', mood: 'Rahatlıq', decade: '2000-lər', genre: 'jazz', isForeign: true, duration: 220, colors: ['#7C8B6F', '#2A211F'], audioUrl: DEMO_AUDIO(2) },
  { id: 18, title: 'Perfect', singer: 'Ed Sheeran', film: 'Asylum Records Arxivi', creator: 'Ed Sheeran bəstəsi · 2017', mood: 'Romantik', decade: '2010-lar', genre: 'pop', isForeign: true, duration: 263, colors: ['#B08D4F', '#2A211F'], audioUrl: DEMO_AUDIO(3) },
  { id: 19, title: 'River Flows in You', singer: 'Yiruma', film: 'Stüdiya Buraxılışı', creator: 'Yiruma bəstəsi · 2001', mood: 'Rahatlıq', decade: '2000-lər', genre: 'classical', isForeign: true, duration: 180, colors: ['#C5A059', '#8B6F3E'], audioUrl: DEMO_AUDIO(4) },
  { id: 20, title: 'Xəyalpərəst', singer: 'Röya', film: 'Stüdiya Buraxılışı', creator: 'Müasir Estrada Arxivi · 2019', mood: 'Estetik', decade: '2010-lar', genre: 'aesthetic', isForeign: false, duration: 195, colors: ['#33324A', '#2A211F'], audioUrl: DEMO_AUDIO(5) },
];

export const trackById = (id) => TRACKS.find((t) => t.id === id);

// ---------- Sosial Axın (Feed) ----------
export const SOCIAL_POSTS = [
  { id: 1, author: 'Nərgiz Əliyeva', avatarInitial: 'N', type: 'text', content: 'Bu gün babamın vinillərini tapdım, "Bizim Nəğmə" hələ də ilk gündəki kimi səslənir 🎶', trackId: 10, likes: 64, comments: 5, time: '2 saat əvvəl' },
  { id: 2, author: 'Tural Məmmədov', avatarInitial: 'T', type: 'image', content: 'Köhnə İçərişəhər küçələri — bu axşam üçün ideal fon musiqisi ilə.', trackId: 2, likes: 112, comments: 9, time: '5 saat əvvəl' },
  { id: 3, author: 'Aysel Rzayeva', avatarInitial: 'A', type: 'video', content: 'Nənəmin evində tapılan qədim qrammofonun səsini çəkdim, dinləyin.', trackId: 1, likes: 238, comments: 17, time: 'Dünən' },
  { id: 4, author: 'Kamran Hüseynov', avatarInitial: 'K', type: 'text', content: 'Sinatra ilə bu axşam kofemi içirəm ☕ — "Fly Me to the Moon" əla seçimdir.', trackId: 11, likes: 45, comments: 3, time: 'Dünən' },
  { id: 5, author: 'Sevinc Abbasova', avatarInitial: 'S', type: 'image', content: 'Bakı Bulvarında gün batımı və Piaf sədaları 🌅', trackId: 12, likes: 97, comments: 6, time: '2 gün əvvəl' },
];

// ---------- Estetik Axın (video-kartlar) ----------
export const FEED_SEED = [
  { trackId: 1, desc: 'Qədim Bakı stüdiyasından bərpa olunmuş, məxmər səsli bir xatirə.', likes: 842, comments: [
    { id: 1, user: 'Nərmin.83', text: 'Bu səsi hər dinlədikcə nənəmin evini xatırlayıram 💛', time: '3s əvvəl' },
    { id: 2, user: 'Rauf_B', text: 'Əsl sənət budur, təşəkkürlər paylaşıma görə.', time: '1g əvvəl' },
  ]},
  { trackId: 2, desc: 'Bakının qədim daş küçələrində gəzən bir melodiya.', likes: 1204, comments: [
    { id: 1, user: 'Leyla.k', text: 'Rəşid müəllimin səsi zamanı belə üstələyir.', time: '5s əvvəl' },
  ]},
  { trackId: 3, desc: 'Filarmoniya arxivindən nadir bir konsert qeydi.', likes: 631, comments: [
    { id: 1, user: 'Tural99', text: 'Elmira xanımın ifası hər dəfə tükürpərdici.', time: '2g əvvəl' },
  ]},
  { trackId: 11, desc: 'Qızıl dövrün ən zamansız caz standartı.', likes: 512, comments: [
    { id: 1, user: 'Vusal_m', text: 'Bu treki heç vaxt qulaqdan salmıram.', time: '4s əvvəl' },
  ]},
];

// ---------- Əhval-ruhiyyə Sürətli Filtrləri ----------
export const MOOD_FILTERS = [
  { id: 'baku-rain', label: 'Bakı Yağışı', mood: 'Rahatlıq' },
  { id: 'night-drive', label: 'Gecə Sürüşü', mood: 'Gecə' },
  { id: 'morning-coffee', label: 'Səhər Qəhvəsi', mood: 'Səhər' },
  { id: 'nostalgia-80', label: 'Nostalji 80-lər', decade: '1980-lar' },
];

// ---------- MeloRadio Hədiyyələri ----------
export const GIFTS = [
  { id: 'grammophone', name: 'Qrammofon', value: 50, color: '#C5A059' },
  { id: 'goldrecord', name: 'Qızıl Val', value: 100, color: '#D4AF37' },
  { id: 'carpet', name: 'Milli Xalça', value: 200, color: '#6E2C2C' },
  { id: 'glass', name: 'Armudu Stəkan', value: 20, color: '#7C8B6F' },
];

export const GIFT_HISTORY_SEED = [
  { id: 1, user: 'Aynur_92', gift: 'Qızıl Val', time: '2 dəq əvvəl' },
  { id: 2, user: 'Elvin.m', gift: 'Armudu Stəkan', time: '4 dəq əvvəl' },
  { id: 3, user: 'Nigar_bb', gift: 'Milli Xalça', time: '9 dəq əvvəl' },
  { id: 4, user: 'Ruslan07', gift: 'Qrammofon', time: '14 dəq əvvəl' },
];

// ---------- Profil və Rollar ----------
export const BADGES = [
  { name: 'Retro Aşiqi', desc: '50+ retro parça dinləyib' },
  { name: 'Erkən Üzv', desc: 'İlk 1000 istifadəçidən biri' },
  { name: '100 Bəyənmə', desc: '100 videoya ürək verib' },
  { name: 'Səxavətli Dinləyici', desc: 'MeloRadio-da hədiyyə göndərib' },
];

export const ROLE_META = {
  super_admin: { label: 'Super Admin', color: '#EF4444', badge: '👑' },
  admin: { label: 'Admin', color: '#F59E0B', badge: '🛡️' },
  vip_star: { label: 'VIP Ulduz', color: '#C5A059', badge: '🌟' },
  verified_creator: { label: 'Verifikasiyalı Yaradıcı', color: '#3B82F6', badge: '✓' },
  listener: { label: 'Dinləyici', color: '#9CA3AF', badge: '🎧' }
};

export const CREATOR_TOPICS = [
  'MeloDaily Qurucusu & Retro Kolleksioner',
  'Retro Musiqi Tədqiqatçısı',
  'Klassik Azərbaycan Filmləri',
  'Nostaljik Əsərlər & Bəstəkarlar',
  'Milli Estrada Vokalisti'
];

export const VINYL_COLLECTION_IDS = [1, 3, 5, 8, 4, 9];

export const LOVE_NOTES_SEED = [
  { id: 1, author: 'Sən', text: 'Bu mahnını sənin üçün seçdim, "Sən Getdin"i eşidəndə həmişə səni düşünürəm.', time: 'Dünən' },
  { id: 2, author: 'Aygün', text: 'Bakı Gecələri bizim ilk rəqsimizin mahnısı idi, unutmamışam 🌙', time: '3 gün əvvəl' },
];

export const NEGATIVE_WORDS = ['axmaq', 'zibil', 'nifrət', 'iyrənc', 'stupid', 'hate', 'ugly', 'terrible', 'idiot'];

export const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
};

export const FONT_IMPORT_URL = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";

export const displayFont = "'Playfair Display', serif";
export const accentFont = "'Cormorant Garamond', serif";
export const bodyFont = "'Plus Jakarta Sans', sans-serif";

export const COLORS = {
  bg: '#2A211F',
  card: 'rgba(247,243,237,0.05)',
  gold: '#C5A059',
  goldLight: '#D8BD84',
  text: '#F7F3ED',
  textMuted: '#EFE7D8',
  border: 'rgba(197,160,89,0.25)',
};