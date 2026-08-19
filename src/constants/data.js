import { Star, Heart, Music, Radio, User, Users, Play, Pause, Search, Disc3, Disc, Award, Grid3x3, Coffee, Gift, MessageCircle, Share2, Compass, Home } from 'lucide-react';

export const FONT_IMPORT_URL =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap';

export const COLORS = {
  cream: '#F7F3ED',
  creamDeep: '#EFE7D8',
  bronze: '#2A211F',
  bronzeSoft: '#4A3A2A',
  gold: '#C5A059',
  goldSoft: '#D8BD84',
  burgundy: '#6E2C2C',
  sage: '#7C8B6F',
  inkGold: '#8B6F3E',
  night: '#33324A',
};

export const displayFont = { fontFamily: "'Playfair Display', 'Georgia', serif" };
export const accentFont = { fontFamily: "'Cormorant Garamond', 'Georgia', serif" };
export const bodyFont = { fontFamily: "'Inter', sans-serif" };

export const TRACKS = [
  { id: 1, title: 'Sevgi Nəğməsi', singer: 'Şövkət Ələkbərova', film: 'Arşın Mal Alan', creator: 'Rejissor: Rza Təhmasib · 1945', mood: 'Romantik', decade: '1940-lar', duration: 194, colors: ['#C5A059', '#2A211F'] },
  { id: 2, title: 'Bakı Gecələri', singer: 'Rəşid Behbudov', film: 'O Olmasın, Bu Olsun', creator: 'Rejissor: Hüseyn Seyidzadə · 1956', mood: 'Nostaljik', decade: '1950-lar', duration: 210, colors: ['#8B6F3E', '#2A211F'] },
  { id: 3, title: 'Qərənfil', singer: 'Elmira Rəhimova', film: 'Studiya Konsert Arxivi', creator: 'Azərbaycan Dövlət Filarmoniyası · 1963', mood: 'Kədərli-Şirin', decade: '1960-lar', duration: 178, colors: ['#C5A059', '#6E2C2C'] },
  { id: 4, title: 'Sən Getdin', singer: 'Müslüm Maqomayev', film: 'Konsert Zalı Arxivi', creator: 'Azərbaycan Dövlət Televiziyası · 1971', mood: 'Romantik', decade: '1970-lar', duration: 225, colors: ['#B08D4F', '#2A211F'] },
  { id: 5, title: 'Yağış Yağır', singer: 'Nüşabə Muradova', film: 'Bakı Radio Arxivi', creator: 'Azərbaycan Dövlət Radiosu · 1985', mood: 'Rahatlıq', decade: '1980-lar', duration: 200, colors: ['#7C8B6F', '#2A211F'] },
  { id: 6, title: 'Payız Simfoniyası', singer: 'Kamilə Nəbiyeva', film: 'Payız Duyğuları', creator: 'AzTV Arxivi · 1992', mood: 'Nostaljik', decade: '1990-lar', duration: 240, colors: ['#C5A059', '#4A3A2A'] },
  { id: 7, title: 'Gecə Küçələri', singer: 'Günay İbrahimli', film: 'Şəhər Simfoniyası', creator: 'Bakı Kinostudiyası · 1988', mood: 'Gecə', decade: '1980-lar', duration: 188, colors: ['#33324A', '#2A211F'] },
  { id: 8, title: 'Səhər Duası', singer: 'Elmira Rəhimova', film: 'Sübh Mahnıları', creator: 'Azərbaycan Dövlət Filarmoniyası · 1965', mood: 'Səhər', decade: '1960-lar', duration: 165, colors: ['#C5A059', '#8B6F3E'] },
  { id: 9, title: 'Xatirələr Kitabı', singer: 'Şövkət Ələkbərova', film: 'Köhnə Albom', creator: 'Studiya Arxivi · 1958', mood: 'Nostaljik', decade: '1950-lar', duration: 215, colors: ['#B08D4F', '#2A211F'] },
  { id: 10, title: 'Bizim Nəğmə', singer: 'Rəşid Behbudov & Şövkət Ələkbərova', film: 'İki Ürək', creator: 'Bakı Kinostudiyası · 1962', mood: 'Romantik', decade: '1960-lar', duration: 230, colors: ['#C5A059', '#6E2C2C'] },
];

export const trackById = (id) => TRACKS.find((t) => t.id === id);

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
    { id: 2, user: 'Aysu_m', text: 'Bunu anama göndərdim, çox sevindi 🌷', time: '2g əvvəl' },
  ]},
  { trackId: 4, desc: 'Maqomayevin unudulmaz konsert zalı ifası.', likes: 2310, comments: [
    { id: 1, user: 'Kamran.h', text: 'Bu səviyyədə bir vokal daha yoxdur.', time: '6s əvvəl' },
  ]},
  { trackId: 5, desc: 'Yağışlı bir Bakı axşamı üçün ideal fon.', likes: 455, comments: [
    { id: 1, user: 'Sevinc_A', text: 'Pəncərədən yağışa baxa-baxa dinləmək başqa aləmdir.', time: '4s əvvəl' },
  ]},
  { trackId: 6, desc: 'Payızın həzin notları ilə bəzənmiş nostalji parça.', likes: 389, comments: [
    { id: 1, user: 'Orxan.n', text: 'Kamilə xanımın səsində xüsusi bir isti var.', time: '1g əvvəl' },
  ]},
];

export const GIFTS = [
  { id: 'grammophone', name: 'Qrammofon', icon: Disc3, value: 50, color: COLORS.gold },
  { id: 'goldrecord', name: 'Qızıl Val', icon: Award, value: 100, color: '#D4AF37' },
  { id: 'carpet', name: 'Milli Xalça', icon: Grid3x3, value: 200, color: COLORS.burgundy },
  { id: 'glass', name: 'Armudu Stəkan', icon: Coffee, value: 20, color: COLORS.sage },
];

export const GIFT_HISTORY_SEED = [
  { id: 1, user: 'Aynur_92', gift: 'Qızıl Val', time: '2 dəq əvvəl' },
  { id: 2, user: 'Elvin.m', gift: 'Armudu Stəkan', time: '4 dəq əvvəl' },
  { id: 3, user: 'Nigar_bb', gift: 'Milli Xalça', time: '9 dəq əvvəl' },
  { id: 4, user: 'Ruslan07', gift: 'Qrammofon', time: '14 dəq əvvəl' },
];

export const MOOD_FILTERS = [
  { id: 'baku-rain', label: 'Bakı Yağışı', mood: 'Rahatlıq' },
  { id: 'night-drive', label: 'Gecə Sürüşü', mood: 'Gecə' },
  { id: 'morning-coffee', label: 'Səhər Qəhvəsi', mood: 'Səhər' },
  { id: 'nostalgia-80', label: 'Nostalji 80-lər', decade: '1980-lar' },
];

export const BADGES = [
  { name: 'Retro Aşiqi', icon: Award, desc: '50+ retro parça dinləyib' },
  { name: 'Erkən Üzv', icon: Star, desc: 'İlk 1000 istifadəçidən biri' },
  { name: '100 Bəyənmə', icon: Heart, desc: '100 videoya ürək verib' },
  { name: 'Səxavətli Dinləyici', icon: Gift, desc: 'MeloRadio-da hədiyyə göndərib' },
];

export const VINYL_COLLECTION_IDS = [1, 3, 5, 8, 4, 9];

export const LOVE_NOTES_SEED = [
  { id: 1, author: 'Sən', text: 'Bu mahnını sənin üçün seçdim, "Sən Getdin"i eşidəndə həmişə səni düşünürəm.', time: 'Dünən' },
  { id: 2, author: 'Aygün', text: 'Bakı Gecələri bizim ilk rəqsimizin mahnısı idi, unutmamışam 🌙', time: '3 gün əvvəl' },
];

export const NEGATIVE_WORDS = ['axmaq', 'zibil', 'nifrət', 'pis adam', 'iyrənc', 'stupid', 'hate', 'ugly', 'terrible', 'idiot'];

export const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
};