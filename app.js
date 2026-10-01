/* ==========================================================================
   NEW ZEALAND HONEYMOON WEB APP - MAIN JAVASCRIPT
   ========================================================================== */

// Location Map Coordinates Dictionary for Pre-defined Slots
const dayLocationCoords = {
  // Day 1
  '1-1': [-37.0082, 174.7850], // Auckland Airport
  // Day 2
  '2-1': [-37.0082, 174.7850], // Auckland Airport
  '2-2': [-37.0082, 174.7850],
  '2-3': [-45.0211, 168.7393], // Queenstown Airport
  '2-4': [-45.0317, 168.6606], // Fergburger
  '2-5': [-45.0336, 168.6644], // St James Apartments
  // Day 3
  '3-1': [-45.0336, 168.6644],
  '3-2': [-44.6716, 167.9256], // Milford Sound Cruise
  '3-3': [-45.0336, 168.6644],
  // Day 4
  '4-1': [-45.0315, 168.6608], // Nzone Skydiving
  '4-2': [-45.0312, 168.6626], // Queenstown Town
  '4-3': [-44.9822, 168.6672], // Onsen Hot Pools
  // Day 5
  '5-1': [-45.0312, 168.6626],
  '5-2': [-44.6983, 169.1172], // Wanaka Tree
  '5-3': [-44.6988, 169.1321], // Roys Peak Airbnb
  // Day 6
  '6-1': [-44.6961, 169.0494], // Roys Peak Track
  '6-2': [-44.6975, 169.1321], // Wanaka Town
  '6-3': [-44.6988, 169.1321],
  // Day 7
  '7-1': [-44.6975, 169.1321],
  '7-2': [-44.1842, 170.1558], // Lake Pukaki Alpine Salmon
  '7-3': [-44.2567, 170.1008], // Twizel
  // Day 8
  '8-1': [-44.2567, 170.1008],
  '8-2': [-44.0044, 170.4817], // Church of the Good Shepherd
  '8-3': [-44.0049, 170.4800], // Tekapo Haka House
  // Day 9
  '9-1': [-44.0049, 170.4800],
  '9-2': [-43.5323, 172.6361], // Christchurch City Hotel
  '9-3': [-43.5321, 172.6256], // Hagley Park
  // Day 10
  '10-1': [-43.4876, 172.5374], // Christchurch Airport
  '10-2': [-36.8447, 174.7694], // SO/ Auckland
  '10-3': [-36.8427, 174.7628], // Viaduct Harbour
  // Day 11
  '11-1': [-36.8447, 174.7694],
  '11-2': [-37.8721, 175.7828], // Hobbiton
  '11-3': [-36.8447, 174.7694],
  // Day 12
  '12-1': [-36.8778, 174.7644], // Mt Eden
  '12-2': [-36.8485, 174.7633], // Auckland Shopping
  '12-3': [-36.8447, 174.7694],
  // Day 13
  '13-1': [-37.0082, 174.7850], // Auckland Airport
  '13-2': [-37.0082, 174.7850],
  '13-3': [37.4602, 126.4407]  // Incheon Airport
};

// Known Location Keyword Coordinates Table
const knownLocationKeywords = [
  { keywords: ['오클랜드 공항', 'auckland airport'], coords: [-37.0082, 174.7850] },
  { keywords: ['오클랜드', 'auckland', 'so/ auckland'], coords: [-36.8447, 174.7694] },
  { keywords: ['마운트 이든', 'mt eden', 'mount eden'], coords: [-36.8778, 174.7644] },
  { keywords: ['퀸스타운 공항', 'queenstown airport'], coords: [-45.0211, 168.7393] },
  { keywords: ['퍼그버거', 'fergburger'], coords: [-45.0317, 168.6606] },
  { keywords: ['세인트 제임스', 'st james'], coords: [-45.0336, 168.6644] },
  { keywords: ['스카이다이빙', 'skydiving', 'nzone'], coords: [-45.0315, 168.6608] },
  { keywords: ['온센', 'onsen'], coords: [-44.9822, 168.6672] },
  { keywords: ['퀸스타운', 'queenstown'], coords: [-45.0312, 168.6626] },
  { keywords: ['밀포드', 'milford'], coords: [-44.6716, 167.9256] },
  { keywords: ['와나카 나무', 'wanaka tree'], coords: [-44.6983, 169.1172] },
  { keywords: ['로이스피크', 'roys peak'], coords: [-44.6961, 169.0494] },
  { keywords: ['와나카', 'wanaka'], coords: [-44.6975, 169.1321] },
  { keywords: ['푸카키', 'pukaki', '연어', 'salmon'], coords: [-44.1842, 170.1558] },
  { keywords: ['트위젤', 'twizel'], coords: [-44.2567, 170.1008] },
  { keywords: ['선한 목자', 'church of the good shepherd', '테카포', 'tekapo'], coords: [-44.0044, 170.4817] },
  { keywords: ['크라이스트처치 공항', 'christchurch airport'], coords: [-43.4876, 172.5374] },
  { keywords: ['크라이스트처치', 'christchurch', '해글리'], coords: [-43.5323, 172.6361] },
  { keywords: ['호비튼', 'hobbiton'], coords: [-37.8721, 175.7828] },
  { keywords: ['인천', 'incheon'], coords: [37.4602, 126.4407] }
];

function resolveSlotCoords(slot) {
  if (slot.coords && Array.isArray(slot.coords) && slot.coords.length === 2) {
    return slot.coords;
  }
  if (dayLocationCoords[slot.id]) {
    return dayLocationCoords[slot.id];
  }
  const textToSearch = ((slot.address || '') + ' ' + (slot.title || '')).toLowerCase();
  for (const item of knownLocationKeywords) {
    if (item.keywords.some(kw => textToSearch.includes(kw))) {
      return item.coords;
    }
  }
  return null;
}

async function geocodeAddress(addressStr) {
  if (!addressStr) return null;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressStr + ' New Zealand')}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

// Initial Itinerary Data Structure
const defaultItineraryData = [
  {
    day: 1,
    date: '10.5 (월)',
    title: '인천공항 출발 ➔ 오클랜드 비행기 탑승',
    stay: '비행기 기내박 ✈️',
    stayAddress: 'Incheon International Airport',
    category: 'airport',
    items: [
      { id: '1-1', time: '18:00', title: '오클랜드 출발 비행기 탑승', address: 'Auckland Airport', status: 'confirmed', note: '여권, NZeTA 비자, E-티켓 필수 지참' }
    ]
  },
  {
    day: 2,
    date: '10.6 (화)',
    title: '오클랜드 도착 ➔ 퀸스타운 이동 & 퍼그버거',
    stay: '세인트 제임스 아파트먼트 (Queenstown)',
    stayAddress: 'St James Apartments, 6 Coronation Dr, Queenstown',
    category: 'stay',
    items: [
      { id: '2-1', time: '09:35', title: '오클랜드 도착', address: 'Auckland Airport', status: 'confirmed', note: '' },
      { id: '2-2', time: '12:05', title: '퀸스타운 출발 국내선 비행기 탑승', address: 'Auckland Airport', status: 'confirmed', note: '' },
      { id: '2-3', time: '14:20', title: '퀸스타운 도착', address: 'Queenstown Airport', status: 'confirmed', note: '' },
      { id: '2-4', time: '15:30', title: '퍼그버거 (Fergburger) 점심 식사', address: 'Fergburger Queenstown', status: 'confirmed', note: '추천: Ferg With Cheese버거' },
      { id: '2-5', time: '18:00', title: '세인트 제임스 아파트먼트 체크인 & 퀸스타운 호수 산책', address: 'St James Apartments Queenstown', status: 'confirmed', note: '' }
    ]
  },
  {
    day: 3,
    date: '10.7 (수)',
    title: '밀포드 사운드 (Milford Sound) 투어',
    stay: '세인트 제임스 아파트먼트 (Queenstown)',
    stayAddress: 'Milford Sound New Zealand',
    category: 'activity',
    items: [
      { id: '3-1', time: '07:00', title: '밀포드사운드 이동 투어 출발', address: 'St James Apartments', status: 'tentative', note: '예상 비용 약 50만원 (* 미확정 - 날씨/예약 상태 확인 필요)' },
      { id: '3-2', time: '13:00', title: '밀포드사운드 피오르드 크루즈 승선', address: 'Milford Sound Cruise', status: 'tentative', note: '' },
      { id: '3-3', time: '19:00', title: '퀸스타운 복귀 및 세인트 제임스 아파트먼트 휴식', address: 'St James Apartments', status: 'confirmed', note: '' }
    ]
  },
  {
    day: 4,
    date: '10.8 (목)',
    title: '08:30 스카이다이빙 & 17:00 온센 핫풀',
    stay: '세인트 제임스 아파트먼트 (Queenstown)',
    stayAddress: 'Nzone Skydiving, 35 Shotover St, Queenstown',
    category: 'activity',
    items: [
      { id: '4-1', time: '08:30', title: 'Nzone Skydiving 스카이다이빙', address: 'Nzone Skydiving Queenstown', status: 'confirmed', note: '⚠️ 미팅포인트: Nzone skydiving / 앞이 막힌 운동화/신발 필수!' },
      { id: '4-2', time: '12:30', title: '퀸스타운 시내 카페 & 점심 휴식', address: 'Queenstown Mall', status: 'confirmed', note: '' },
      { id: '4-3', time: '17:00', title: '온센 핫풀 (Onsen Hot Pools) 힐링 스파', address: 'Onsen Hot Pools Queenstown', status: 'confirmed', note: '샷오버 강 프라이빗 온천 스파' }
    ]
  },
  {
    day: 5,
    date: '10.9 (금)',
    title: '퀸스타운 ➔ 와나카 이동 & 로이스피크 에어비앤비',
    stay: '로이스피크 전망 에어비앤비 (Wanaka)',
    stayAddress: 'Wanaka Lake New Zealand',
    category: 'stay',
    items: [
      { id: '5-1', time: '10:00', title: '퀸스타운 ➔ 와나카 드라이브 (약 1시간 10분)', address: 'Queenstown to Wanaka', status: 'confirmed', note: '' },
      { id: '5-2', time: '12:30', title: '와나카 호수 & 와나카 나무 (That Wanaka Tree) 관람', address: 'That Wanaka Tree', status: 'confirmed', note: '' },
      { id: '5-3', time: '16:00', title: '로이스피크 전망 에어비앤비 체크인', address: 'Roys Peak Wanaka', status: 'confirmed', note: '' }
    ]
  },
  {
    day: 6,
    date: '10.10 (토)',
    title: '와나카 일대 휴식 & 트레킹',
    stay: '로이스피크 전망 에어비앤비 (Wanaka)',
    stayAddress: 'Roys Peak Track, Wanaka',
    category: 'activity',
    items: [
      { id: '6-1', time: '09:00', title: '와나카 로이스피크 전망 트레킹 / 와나카 호수 산책', address: 'Roys Peak Track', status: 'confirmed', note: '' },
      { id: '6-2', time: '13:00', title: '와나카 시내 카페 점심', address: 'Wanaka Town', status: 'confirmed', note: '' },
      { id: '6-3', time: '18:30', title: '에어비앤비 석양 감상 & 바베큐', address: 'Wanaka Airbnb', status: 'confirmed', note: '' }
    ]
  },
  {
    day: 7,
    date: '10.11 (일)',
    title: '와나카 ➔ 트위젤 이동 & 푸카키 호수 연어 맛집',
    stay: '트위젤 에어비앤비 (Twizel)',
    stayAddress: 'Lake Pukaki Alpine Salmon, Twizel',
    category: 'stay',
    items: [
      { id: '7-1', time: '10:00', title: '와나카 ➔ 트위젤 이동 (약 1시간 40분)', address: 'Wanaka to Twizel', status: 'confirmed', note: '' },
      { id: '7-2', time: '12:30', title: '푸카키 호수(Lake Pukaki) 싱싱한 마운트쿡 연어 맛보기', address: 'Mount Cook Alpine Salmon Lake Pukaki', status: 'confirmed', note: '에메랄드 호수 전경 연어 맛집' },
      { id: '7-3', time: '16:00', title: '트위젤 에어비앤비 체크인', address: 'Twizel', status: 'confirmed', note: '' }
    ]
  },
  {
    day: 8,
    date: '10.12 (월)',
    title: '트위젤 ➔ 테카포 이동 & 밤하늘 은하수 관측',
    stay: '하카 하우스 테카포 (Haka House)',
    stayAddress: 'Haka House Lake Tekapo',
    category: 'stay',
    items: [
      { id: '8-1', time: '11:00', title: '트위젤 ➔ 테카포 호수 이동 (약 40분)', address: 'Twizel to Lake Tekapo', status: 'confirmed', note: '' },
      { id: '8-2', time: '13:00', title: '선한 목자의 교회 (Church of the Good Shepherd) 산책', address: 'Church of the Good Shepherd Tekapo', status: 'confirmed', note: '' },
      { id: '8-3', time: '21:00', title: '테카포 세계 최대 별빛 보호구역 은하수 관측', address: 'Haka House Lake Tekapo', status: 'confirmed', note: '카메라 삼각대 필수!' }
    ]
  },
  {
    day: 9,
    date: '10.13 (화)',
    title: '테카포 ➔ 크라이스트처치 이동 & 시내 탐방',
    stay: '크라이스트처치 시티 호텔',
    stayAddress: 'Christchurch City Hotel, 776 Colombo St, Christchurch',
    category: 'stay',
    items: [
      { id: '9-1', time: '09:30', title: '테카포 ➔ 크라이스트처치 이동 (약 3시간)', address: 'Tekapo to Christchurch', status: 'confirmed', note: '' },
      { id: '9-2', time: '14:00', title: '크라이스트처치 시티 호텔 체크인', address: 'Christchurch City Hotel', status: 'confirmed', note: '' },
      { id: '9-3', time: '17:00', title: '크라이스트처치 해글리 파크 & 시내 트램 구경', address: 'Hagley Park Christchurch', status: 'confirmed', note: '' }
    ]
  },
  {
    day: 10,
    date: '10.14 (수)',
    title: '크라이스트처치 ➔ 오클랜드 이동 (SO/ Auckland)',
    stay: 'SO/ Auckland (5성급 럭셔리 호텔)',
    stayAddress: 'SO/ Auckland, 67 Customs St E, Auckland CBD',
    category: 'stay',
    items: [
      { id: '10-1', time: '10:00', title: '크라이스트처치 ➔ 오클랜드 국내선 이동', address: 'Christchurch Airport', status: 'confirmed', note: '' },
      { id: '10-2', time: '13:30', title: 'SO/ Auckland 호텔 체크인 & 비아덕트 하버', address: 'SO/ Auckland', status: 'confirmed', note: '' },
      { id: '10-3', time: '19:00', title: '오클랜드 시내 야경 감상 & 루프탑 바', address: 'Viaduct Harbour Auckland', status: 'confirmed', note: '' }
    ]
  },
  {
    day: 11,
    date: '10.15 (목)',
    title: '06:00~17:00 호비튼 무비 세트 투어 (Hobbiton)',
    stay: 'SO/ Auckland',
    stayAddress: 'Hobbiton Movie Set, Matamata',
    category: 'activity',
    items: [
      { id: '11-1', time: '06:00', title: '호비튼 투어 출발', address: 'SO/ Auckland', status: 'confirmed', note: '⚠️ 호텔 앞 픽업! 점심 미포함 (경유지에서 구매 가능)' },
      { id: '11-2', time: '11:00', title: '호비튼 영화 세트장 감상 & 샤이어 캐츠 펍 음료', address: 'Hobbiton Movie Set Matamata', status: 'confirmed', note: '' },
      { id: '11-3', time: '17:00', title: '오클랜드 호텔 복귀', address: 'SO/ Auckland', status: 'confirmed', note: '' }
    ]
  },
  {
    day: 12,
    date: '10.16 (금)',
    title: '오클랜드 시내 쇼핑 & 마운트 이든',
    stay: 'SO/ Auckland',
    stayAddress: 'Mount Eden, Auckland',
    category: 'stay',
    items: [
      { id: '12-1', time: '10:00', title: '마운트 이든 (Mt Eden) 화산 구경', address: 'Mount Eden Auckland', status: 'confirmed', note: '' },
      { id: '12-2', time: '14:00', title: '오클랜드 시내 쇼핑 (마누카 꿀, 영양제, 와인 등)', address: 'Auckland CBD', status: 'confirmed', note: '' },
      { id: '12-3', time: '19:00', title: '신혼여행 마지막 디너 식사', address: 'SO/ Auckland', status: 'confirmed', note: '' }
    ]
  },
  {
    day: 13,
    date: '10.17 (토)',
    title: '12:05 오클랜드 출발 ➔ 20:20 인천공항 도착',
    stay: '집으로 귀가 🏠',
    stayAddress: 'Auckland Airport',
    category: 'airport',
    items: [
      { id: '13-1', time: '09:00', title: '오클랜드 공항 이동 & 렌트카 반납', address: 'Auckland Airport', status: 'confirmed', note: '' },
      { id: '13-2', time: '12:05', title: '오클랜드 출발 (인천행)', address: 'Auckland Airport', status: 'confirmed', note: '' },
      { id: '13-3', time: '20:20', title: '인천공항 도착 (귀국 완료) ❤️', address: 'Incheon Airport', status: 'confirmed', note: '' }
    ]
  }
];

// Load Custom Itinerary Data from LocalStorage if available
let itineraryData = JSON.parse(localStorage.getItem('nz_custom_itinerary_v2')) || defaultItineraryData;

// Correct days of week to Mon (월) ~ Sat (토)
const dayOfWeekMap = {
  1: '10.5 (월)',
  2: '10.6 (화)',
  3: '10.7 (수)',
  4: '10.8 (목)',
  5: '10.9 (금)',
  6: '10.10 (토)',
  7: '10.11 (일)',
  8: '10.12 (월)',
  9: '10.13 (화)',
  10: '10.14 (수)',
  11: '10.15 (목)',
  12: '10.16 (금)',
  13: '10.17 (토)'
};

itineraryData.forEach(item => {
  if (dayOfWeekMap[item.day]) {
    item.date = dayOfWeekMap[item.day];
  }
});

// Helper: 12-Hour Time Formatter (오전 / 오후)
function formatTime12Hour(timeStr) {
  if (!timeStr) return { text: '시간미정', isPM: false };

  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const isPM = hours >= 12;
    
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    const periodStr = isPM ? '오후' : '오전';
    const hourStr = String(hours).padStart(2, '0');
    return {
      text: `${periodStr} ${hourStr}:${minutes}`,
      isPM: isPM
    };
  }

  const isPM = timeStr.includes('오후') || timeStr.includes('PM') || timeStr.includes('pm');
  return {
    text: timeStr,
    isPM: isPM
  };
}

// Initial Checklist Categories & Default Items matching reference image
const defaultChecklistCategories = [
  { name: '필수 준비물', icon: 'shield-check' },
  { name: '세면도구', icon: 'sparkles' },
  { name: '일반 준비물', icon: 'shirt' },
  { name: '상비약', icon: 'pill' },
  { name: '전자제품', icon: 'plug-zap' },
  { name: '기타', icon: 'box' }
];

const defaultChecklist = [
  // 필수 준비물 (8개)
  { id: 1, text: '항공권 E-ticket', category: '필수 준비물', done: true },
  { id: 2, text: '여권(사본) 및 비자', category: '필수 준비물', done: true },
  { id: 3, text: '현금(원화, 환전달러)', category: '필수 준비물', done: true },
  { id: 4, text: '해외사용 카드', category: '필수 준비물', done: true },
  { id: 5, text: '숙소 및 항공 바우처', category: '필수 준비물', done: true },
  { id: 6, text: '비상용 체크카드 or 신용카드', category: '필수 준비물', done: false },
  { id: 7, text: '유심, 로밍, 포켓 와이파이', category: '필수 준비물', done: true },
  { id: 8, text: '여행자 보험', category: '필수 준비물', done: true },

  // 세면도구 (8개)
  { id: 9, text: '칫솔, 치약', category: '세면도구', done: false },
  { id: 10, text: '샴푸, 린스', category: '세면도구', done: false },
  { id: 11, text: '세안용품(클렌징 폼)', category: '세면도구', done: false },
  { id: 12, text: '바디클렌저, 샤워볼', category: '세면도구', done: false },
  { id: 13, text: '기초화장품(스킨, 로션)', category: '세면도구', done: false },
  { id: 14, text: '선크림', category: '세면도구', done: false },
  { id: 15, text: '수건(3-4개)', category: '세면도구', done: false },
  { id: 16, text: '3단 여행용 워시백', category: '세면도구', done: false },

  // 일반 준비물 (8개)
  { id: 17, text: '겉옷', category: '일반 준비물', done: false },
  { id: 18, text: '잠옷', category: '일반 준비물', done: false },
  { id: 19, text: '모자', category: '일반 준비물', done: false },
  { id: 20, text: '속옷, 양말', category: '일반 준비물', done: false },
  { id: 21, text: '선글라스', category: '일반 준비물', done: false },
  { id: 22, text: '우산 or 우비', category: '일반 준비물', done: false },
  { id: 23, text: '힙색, 크로스백', category: '일반 준비물', done: false },
  { id: 24, text: '운동화, 슬리퍼', category: '일반 준비물', done: false },

  // 상비약 (8개)
  { id: 25, text: '종합 감기약', category: '상비약', done: false },
  { id: 26, text: '연고, 1회용 밴드', category: '상비약', done: false },
  { id: 27, text: '파스', category: '상비약', done: false },
  { id: 28, text: '소독약', category: '상비약', done: false },
  { id: 29, text: '지사제', category: '상비약', done: false },
  { id: 30, text: '소화제', category: '상비약', done: false },
  { id: 31, text: '두통약', category: '상비약', done: false },
  { id: 32, text: '기타(개인약품)', category: '상비약', done: false },

  // 전자제품 (7개)
  { id: 33, text: '스마트폰', category: '전자제품', done: true },
  { id: 34, text: '카메라', category: '전자제품', done: false },
  { id: 35, text: '보조배터리', category: '전자제품', done: false },
  { id: 36, text: '케이블키트', category: '전자제품', done: false },
  { id: 37, text: '멀티 어댑터', category: '전자제품', done: true },
  { id: 38, text: '전자기기 충전기', category: '전자제품', done: false },
  { id: 39, text: '고데기, 드라이기', category: '전자제품', done: false },

  // 기타 (8개)
  { id: 40, text: '담요', category: '기타', done: false },
  { id: 41, text: '동전지갑', category: '기타', done: false },
  { id: 42, text: '목베개, 안대', category: '기타', done: false },
  { id: 43, text: '가방 자물쇠', category: '기타', done: false },
  { id: 44, text: '비닐봉지, 지퍼백', category: '기타', done: false },
  { id: 45, text: '샤워필터', category: '기타', done: false },
  { id: 46, text: '캐리어 보조가방', category: '기타', done: false },
  { id: 47, text: '포켓 여행지도', category: '기타', done: false }
];

let savedChecklist = JSON.parse(localStorage.getItem('nz_checklist_v3'));
if (!savedChecklist || !Array.isArray(savedChecklist) || savedChecklist.length === 0 || !savedChecklist[0].category || savedChecklist[0].category.length < 2) {
  savedChecklist = defaultChecklist;
}
let checklistItems = savedChecklist;

// Register Service Worker for Mobile PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('PWA ServiceWorker registered:', reg.scope);
    }).catch(err => console.log('SW reg fail:', err));
  });
}

// Leaflet Map Global Objects
let leafletMap = null;
let leafletMarkersGroup = null;
let leafletPolyline = null;

// Main Page Map & Weather Global Variables
let mainLeafletMap = null;
let mainMarkersGroup = null;
let mainPolyline = null;
let activeMainDay = 1;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  initDDayTimer();
  initNavigationTabs();
  initMainPageModule();
  initWeatherModule();
  initInteractiveMap();
  renderItineraryPills();
  renderItineraryCards();
  renderStaysAndActivities();
  renderChecklist();
  initMemoArea();
  initCurrencyConverter();
  initModalEvents();
  initPWAModal();
});

// Interactive Leaflet Map Initialization
function initInteractiveMap() {
  const mapEl = document.getElementById('leaflet-map');
  if (!mapEl || !window.L) return;

  leafletMap = L.map('leaflet-map', {
    center: [-43.5, 171.0],
    zoom: 6,
    zoomControl: true
  });

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, MapmyIndia, &copy; OpenStreetMap contributors'
  }).addTo(leafletMap);

  leafletMarkersGroup = L.layerGroup().addTo(leafletMap);

  initMapModeToggle();
  renderLeafletMarkers('all');
}

function initMapModeToggle() {
  const btnInteractive = document.getElementById('btn-mode-interactive');
  const btnMyMaps = document.getElementById('btn-mode-mymaps');
  const leafletWrap = document.getElementById('leaflet-map-wrap');
  const gmapsWrap = document.getElementById('gmaps-main-wrap');

  if (!btnInteractive || !btnMyMaps || !leafletWrap || !gmapsWrap) return;

  btnInteractive.addEventListener('click', () => {
    btnInteractive.classList.add('active');
    btnMyMaps.classList.remove('active');
    leafletWrap.classList.remove('hidden');
    gmapsWrap.classList.add('hidden');
    if (leafletMap) {
      setTimeout(() => leafletMap.invalidateSize(), 100);
    }
  });

  btnMyMaps.addEventListener('click', () => {
    btnMyMaps.classList.add('active');
    btnInteractive.classList.remove('active');
    gmapsWrap.classList.remove('hidden');
    leafletWrap.classList.add('hidden');
  });
}

function renderLeafletMarkers(filterDay = 'all') {
  if (!leafletMap || !window.L) return;

  if (leafletMarkersGroup) leafletMarkersGroup.clearLayers();
  if (leafletPolyline) {
    leafletMap.removeLayer(leafletPolyline);
    leafletPolyline = null;
  }

  let itemsToRender = [];
  if (filterDay === 'all') {
    itineraryData.forEach(d => {
      (d.items || []).forEach(slot => itemsToRender.push({ ...slot, day: d.day }));
    });
  } else {
    const dayObj = itineraryData.find(d => d.day === parseInt(filterDay));
    if (dayObj) {
      itemsToRender = (dayObj.items || []).map(slot => ({ ...slot, day: dayObj.day }));
    }
  }

  itemsToRender.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const routeLatLngs = [];
  const bounds = [];

  itemsToRender.forEach((slot, index) => {
    const coords = resolveSlotCoords(slot);
    if (!coords) return;

    const latLng = [coords[0], coords[1]];
    routeLatLngs.push(latLng);
    bounds.push(latLng);

    const timeInfo = formatTime12Hour(slot.time);
    const badgeClass = timeInfo.isPM ? 'map-number-badge badge-pm' : 'map-number-badge';

    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div class="${badgeClass}">${index + 1}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker(latLng, { icon: customIcon });

    const popupHTML = `
      <div style="font-family:sans-serif; padding:4px;">
        <strong style="color:#0f172a; font-size:0.95rem;">${index + 1}. ${slot.title}</strong><br/>
        <span style="color:#0d9488; font-size:0.85rem; font-weight:600;">🕒 ${timeInfo.text} (Day ${slot.day})</span>
        ${slot.address ? `<div style="color:#64748b; font-size:0.8rem; margin-top:2px;">📍 ${slot.address}</div>` : ''}
        ${slot.note ? `<div style="color:#e11d48; font-size:0.8rem; margin-top:4px;">ℹ️ ${slot.note}</div>` : ''}
      </div>
    `;

    marker.bindPopup(popupHTML);
    leafletMarkersGroup.addLayer(marker);
  });

  if (routeLatLngs.length > 1) {
    leafletPolyline = L.polyline(routeLatLngs, {
      color: '#0d9488',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '7, 7'
    }).addTo(leafletMap);
  }

  if (bounds.length > 0) {
    leafletMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }
}

function saveItineraryData() {
  localStorage.setItem('nz_custom_itinerary_v2', JSON.stringify(itineraryData));
}

// 1. LUCIDE ICONS
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// 2. D-DAY COUNTER (SAFEGUARD)
function initDDayTimer() {
  const card = document.getElementById('dday-card');
  if (!card) return;

  const targetDate = new Date('2026-10-05T18:00:00+09:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      card.innerHTML = '<div class="dday-label">🎉 축하합니다! 뉴질랜드 신혼여행 진행 중! ❤️</div>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const ddDays = document.getElementById('dd-days');
    const ddHours = document.getElementById('dd-hours');
    const ddMins = document.getElementById('dd-mins');
    const ddSecs = document.getElementById('dd-secs');

    if (ddDays) ddDays.textContent = String(days).padStart(2, '0');
    if (ddHours) ddHours.textContent = String(hours).padStart(2, '0');
    if (ddMins) ddMins.textContent = String(mins).padStart(2, '0');
    if (ddSecs) ddSecs.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// NAVIGATION TABS SWITCHER HELPER
window.switchNavTab = function(targetId) {
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.app-section');

  navBtns.forEach(b => {
    if (b.getAttribute('data-target') === targetId) b.classList.add('active');
    else b.classList.remove('active');
  });

  sections.forEach(s => {
    if (s.id === targetId) s.classList.add('active');
    else s.classList.remove('active');
  });

  if (targetId === 'sec-main' && mainLeafletMap) {
    setTimeout(() => mainLeafletMap.invalidateSize(), 150);
  }
  if (targetId === 'sec-itinerary' && leafletMap) {
    setTimeout(() => leafletMap.invalidateSize(), 150);
  }
};

function initNavigationTabs() {
  const navBtns = document.querySelectorAll('.nav-btn');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      window.switchNavTab(targetId);
    });
  });
}

// MAIN PAGE (HOME) & WEATHER & PWA MODULE
const weatherCityData = {
  queenstown: {
    name: '🇳🇿 퀸스타운 (Queenstown) 10월 날씨',
    lat: -45.0312, lon: 168.6626,
    temp: '14°C', condition: '맑고 쾌청함 (Spring)', minmax: '최저 5°C / 최고 16°C',
    humidity: '58%', wind: '12 km/h', rain: '10%',
    outfit: '경량패딩 & 바람막이 🧥',
    tip: '💡 퀸스타운은 호수 바람과 일교차가 크므로 스카이다이빙 및 야외 활동 시 방한 겉옷 필수 지참!'
  },
  wanaka: {
    name: '🇳🇿 와나카 (Wanaka) 10월 날씨',
    lat: -44.6975, lon: 169.1321,
    temp: '15°C', condition: '맑고 화창함 (Spring)', minmax: '최저 6°C / 최고 17°C',
    humidity: '52%', wind: '10 km/h', rain: '5%',
    outfit: '트레킹웨어 + 선글라스 🕶️',
    tip: '💡 로이스 피크 트레킹 시 고지대 센 바람에 대비해 바람막이와 자외선 차단 선글라스 필수!'
  },
  tekapo: {
    name: '🇳🇿 테카포 / 트위젤 (Tekapo/Twizel) 10월 날씨',
    lat: -44.0044, lon: 170.4817,
    temp: '12°C', condition: '밤하늘 은하수 맑음 🌌', minmax: '최저 3°C / 최고 15°C',
    humidity: '60%', wind: '8 km/h', rain: '15%',
    outfit: '두꺼운 패딩 & 장갑 🧤',
    tip: '💡 밤 21:00 이후 별빛 보호구역 은하수 관측 시 체감온도가 영하권으로 떨어지니 방한복 필수!'
  },
  christchurch: {
    name: '🇳🇿 크라이스트처치 (Christchurch) 10월 날씨',
    lat: -43.5323, lon: 172.6361,
    temp: '16°C', condition: '구름 조금 & 온화함', minmax: '최저 7°C / 최고 18°C',
    humidity: '62%', wind: '14 km/h', rain: '20%',
    outfit: '가디건 / 봄자켓 🧥',
    tip: '💡 해글리 파크 산책 및 시내 구경하기 가장 온화하고 쾌적한 날씨입니다.'
  },
  auckland: {
    name: '🇳🇿 오클랜드 (Auckland) 10월 날씨',
    lat: -36.8447, lon: 174.7694,
    temp: '17°C', condition: '구름 많음 & 소나기 가능성', minmax: '최저 11°C / 최고 19°C',
    humidity: '70%', wind: '18 km/h', rain: '25%',
    outfit: '봄자켓 & 접이식 우산 ☔',
    tip: '💡 해양성 기후 특성상 갑작스러운 소나기가 내릴 수 있으니 가벼운 접이식 우산을 챙기세요.'
  }
};

function initWeatherModule() {
  const citySelect = document.getElementById('weather-city-select');
  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      updateWeatherUI(e.target.value);
    });
  }
  updateWeatherUI('queenstown');
}

function updateWeatherUI(cityKey) {
  const data = weatherCityData[cityKey] || weatherCityData.queenstown;
  
  const nameEl = document.getElementById('weather-location-name');
  const tempEl = document.getElementById('weather-temp-text');
  const condEl = document.getElementById('weather-condition-text');
  const minmaxEl = document.getElementById('weather-minmax-text');
  const humEl = document.getElementById('weather-humidity');
  const windEl = document.getElementById('weather-wind');
  const rainEl = document.getElementById('weather-rain');
  const outfitEl = document.getElementById('weather-outfit');
  const tipEl = document.getElementById('weather-tip-box');

  if (nameEl) nameEl.textContent = data.name;
  if (tempEl) tempEl.textContent = data.temp;
  if (condEl) condEl.textContent = data.condition;
  if (minmaxEl) minmaxEl.textContent = data.minmax;
  if (humEl) humEl.textContent = data.humidity;
  if (windEl) windEl.textContent = data.wind;
  if (rainEl) rainEl.textContent = data.rain;
  if (outfitEl) outfitEl.textContent = data.outfit;
  if (tipEl && tipEl.querySelector('span')) tipEl.querySelector('span').textContent = data.tip;

  fetchLiveWeather(data.lat, data.lon);
}

async function fetchLiveWeather(lat, lon) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=Pacific%2FAuckland`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.current_weather) {
        const cur = json.current_weather;
        const temp = Math.round(cur.temperature);
        const wind = Math.round(cur.windspeed);
        
        const tempEl = document.getElementById('weather-temp-text');
        const windEl = document.getElementById('weather-wind');
        if (tempEl) tempEl.textContent = `${temp}°C`;
        if (windEl) windEl.textContent = `${wind} km/h`;

        if (json.daily && json.daily.temperature_2m_min && json.daily.temperature_2m_max) {
          const min = Math.round(json.daily.temperature_2m_min[0]);
          const max = Math.round(json.daily.temperature_2m_max[0]);
          const minmaxEl = document.getElementById('weather-minmax-text');
          if (minmaxEl) minmaxEl.textContent = `최저 ${min}°C / 최고 ${max}°C`;
        }
      }
    }
  } catch (e) {}
}

function initMainPageModule() {
  initMainLeafletMap();
  renderMainDayPills();
  selectMainDay(1);
}

function initMainLeafletMap() {
  const mapEl = document.getElementById('main-leaflet-map');
  if (!mapEl || !window.L) return;

  if (!mainLeafletMap) {
    mainLeafletMap = L.map('main-leaflet-map', {
      center: [-45.0317, 168.6606],
      zoom: 10,
      zoomControl: true
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: 'Tiles &copy; Esri'
    }).addTo(mainLeafletMap);

    mainMarkersGroup = L.layerGroup().addTo(mainLeafletMap);
  }
}

function renderMainDayPills() {
  const container = document.getElementById('main-day-pills');
  if (!container) return;

  let html = '';
  itineraryData.forEach(item => {
    const isSelected = item.day === activeMainDay;
    html += `
      <div class="day-pill ${isSelected ? 'active' : ''}" data-day="${item.day}">
        Day ${item.day}
        <small>${item.date.split(' ')[0]}</small>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('.day-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const dayNum = parseInt(pill.getAttribute('data-day'));
      container.querySelectorAll('.day-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectMainDay(dayNum);
    });
  });
}

function selectMainDay(dayNum) {
  activeMainDay = dayNum;

  const dayObj = itineraryData.find(d => d.day === dayNum);
  if (dayObj) {
    const titleEl = document.getElementById('main-today-title');
    if (titleEl) titleEl.textContent = `${dayObj.date} Day ${dayObj.day} · ${dayObj.title}`;

    const mapLabel = document.getElementById('main-map-title-label');
    if (mapLabel) mapLabel.textContent = `Day ${dayObj.day} 동선 지도 (❶❷❸)`;

    autoSelectWeatherCity(dayNum);
  }

  renderMainTodayCards(dayNum);
  renderMainLeafletMarkers(dayNum);
}

function autoSelectWeatherCity(dayNum) {
  const weatherSelect = document.getElementById('weather-city-select');
  if (!weatherSelect) return;

  let city = 'queenstown';
  if (dayNum === 1 || dayNum >= 10) city = 'auckland';
  else if (dayNum >= 2 && dayNum <= 4) city = 'queenstown';
  else if (dayNum === 5 || dayNum === 6) city = 'wanaka';
  else if (dayNum === 7 || dayNum === 8) city = 'tekapo';
  else if (dayNum === 9) city = 'christchurch';

  weatherSelect.value = city;
  updateWeatherUI(city);
}

function renderMainTodayCards(dayNum) {
  const container = document.getElementById('main-today-card-container');
  if (!container) return;

  const dayItem = itineraryData.find(d => d.day === dayNum);
  if (!dayItem) return;

  let html = `
    <div class="itinerary-card" style="margin-bottom:0;">
      <div class="itinerary-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="day-badge">Day ${dayItem.day}</span>
          <span class="day-title">${dayItem.date} · ${dayItem.title}</span>
        </div>
        <div class="stay-badge">
          <i data-lucide="home"></i> ${dayItem.stay}
        </div>
      </div>
      <div class="itinerary-body">
        <div class="timeline-slots">
  `;

  const sortedItems = [...(dayItem.items || [])].sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  if (sortedItems.length === 0) {
    html += `<div style="color:#94a3b8; font-size:0.9rem; padding:10px 0;">등록된 일정이 없습니다.</div>`;
  } else {
    sortedItems.forEach((slot, idx) => {
      const statusBadge = slot.status === 'confirmed' 
        ? '<span class="badge-status status-confirmed">확정</span>' 
        : '<span class="badge-status status-tentative">미확정</span>';

      const noteHTML = slot.note 
        ? `<div class="slot-note"><i data-lucide="info"></i> ${slot.note}</div>` 
        : '';

      const addressTag = slot.address 
        ? `<span style="font-size:0.78rem; color:#64748b; margin-left:6px;">📍 ${slot.address}</span>`
        : '';

      const timeInfo = formatTime12Hour(slot.time);
      const slotItemClass = timeInfo.isPM ? 'slot-item-pm' : 'slot-item-am';

      html += `
        <div class="slot-item ${slotItemClass}">
          <span class="slot-time-text">${timeInfo.text}</span>
          <div class="slot-content">
            <div class="slot-title">
              <span style="background:#0d9488; color:#fff; width:20px; height:20px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; margin-right:4px;">${idx + 1}</span>
              ${slot.title} ${statusBadge} ${addressTag}
            </div>
            ${noteHTML}
          </div>
          <div class="slot-actions">
            <button class="btn-item-action btn-edit-slot" onclick="editItineraryItem(${dayItem.day}, '${slot.id}')">
              <i data-lucide="edit-3"></i> 수정
            </button>
          </div>
        </div>
      `;
    });
  }

  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dayItem.stayAddress)}`;

  html += `
        </div>
        <div class="itinerary-actions">
          <a href="${gmapsUrl}" target="_blank" class="btn btn-secondary btn-sm">
            <i data-lucide="navigation"></i> 구글맵 길찾기
          </a>
          <button class="btn btn-outline btn-sm" onclick="openAddEventModalForDay(${dayItem.day})">
            <i data-lucide="plus"></i> 일정 추가
          </button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  initLucideIcons();
}

function renderMainLeafletMarkers(dayNum) {
  if (!mainLeafletMap || !window.L) return;

  if (mainMarkersGroup) mainMarkersGroup.clearLayers();
  if (mainPolyline) {
    mainLeafletMap.removeLayer(mainPolyline);
    mainPolyline = null;
  }

  const dayObj = itineraryData.find(d => d.day === parseInt(dayNum));
  if (!dayObj) return;

  const itemsToRender = (dayObj.items || []).map(slot => ({ ...slot, day: dayObj.day }));
  itemsToRender.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const routeLatLngs = [];
  const bounds = [];

  itemsToRender.forEach((slot, index) => {
    const coords = resolveSlotCoords(slot);
    if (!coords) return;

    const latLng = [coords[0], coords[1]];
    routeLatLngs.push(latLng);
    bounds.push(latLng);

    const timeInfo = formatTime12Hour(slot.time);
    const badgeClass = timeInfo.isPM ? 'map-number-badge badge-pm' : 'map-number-badge';

    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div class="${badgeClass}">${index + 1}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker(latLng, { icon: customIcon });

    const popupHTML = `
      <div style="font-family:sans-serif; padding:4px;">
        <strong style="color:#0f172a; font-size:0.95rem;">${index + 1}. ${slot.title}</strong><br/>
        <span style="color:#0d9488; font-size:0.85rem; font-weight:600;">🕒 ${timeInfo.text} (Day ${slot.day})</span>
        ${slot.address ? `<div style="color:#64748b; font-size:0.8rem; margin-top:2px;">📍 ${slot.address}</div>` : ''}
        ${slot.note ? `<div style="color:#e11d48; font-size:0.8rem; margin-top:4px;">ℹ️ ${slot.note}</div>` : ''}
      </div>
    `;

    marker.bindPopup(popupHTML);
    mainMarkersGroup.addLayer(marker);
  });

  if (routeLatLngs.length > 1) {
    mainPolyline = L.polyline(routeLatLngs, {
      color: '#0d9488',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '7, 7'
    }).addTo(mainLeafletMap);
  }

  if (bounds.length > 0) {
    mainLeafletMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  } else {
    mainLeafletMap.setView([-43.5, 171.0], 6);
  }

  setTimeout(() => mainLeafletMap.invalidateSize(), 150);
}

function initPWAModal() {
  const modal = document.getElementById('modal-pwa-install');
  const btnOpen = document.getElementById('btn-open-install-guide');
  const btnClose = document.getElementById('btn-close-pwa-modal');
  const btnConfirm = document.getElementById('btn-confirm-pwa-modal');

  if (!modal) return;

  const closeModal = () => modal.classList.add('hidden');
  const openModal = () => {
    modal.classList.remove('hidden');
    initLucideIcons();
  };

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnConfirm) btnConfirm.addEventListener('click', closeModal);
}

// 4. ITINERARY PILLS & CARDS
function renderItineraryPills() {
  const container = document.getElementById('day-pills');
  if (!container) return;

  let html = `<div class="day-pill active" data-day="all">전체 일정<small>13 Days</small></div>`;
  itineraryData.forEach(item => {
    html += `
      <div class="day-pill" data-day="${item.day}">
        Day ${item.day}
        <small>${item.date.split(' ')[0]}</small>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('.day-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.day-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const dayVal = pill.getAttribute('data-day');
      renderItineraryCards(dayVal);
    });
  });
}

function renderItineraryCards(filterDay = 'all') {
  renderLeafletMarkers(filterDay);

  const container = document.getElementById('itinerary-cards-container');
  if (!container) return;

  let itemsToRender = itineraryData;
  if (filterDay !== 'all') {
    itemsToRender = itineraryData.filter(d => d.day === parseInt(filterDay));
  }

  let html = '';

  itemsToRender.forEach(item => {
    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.stayAddress)}`;

    html += `
      <div class="itinerary-card" id="day-card-${item.day}">
        <div class="itinerary-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="day-badge">Day ${item.day}</span>
            <span class="day-title">${item.date} · ${item.title}</span>
          </div>
          <div class="stay-badge">
            <i data-lucide="home"></i> ${item.stay}
          </div>
        </div>

        <div class="itinerary-body">
          <div class="timeline-slots">
    `;

    // Sort items chronologically by time
    const sortedItems = [...(item.items || [])].sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    if (sortedItems.length === 0) {
      html += `<div style="color:#94a3b8; font-size:0.9rem; padding:10px 0;">등록된 일정이 없습니다. 하단 [+ 새 일정]을 눌러 추가해보세요.</div>`;
    } else {
      sortedItems.forEach((slot, idx) => {
        const statusBadge = slot.status === 'confirmed' 
          ? '<span class="badge-status status-confirmed">확정</span>' 
          : '<span class="badge-status status-tentative">미확정</span>';

        const noteHTML = slot.note 
          ? `<div class="slot-note"><i data-lucide="info"></i> ${slot.note}</div>` 
          : '';

        const addressTag = slot.address 
          ? `<span style="font-size:0.78rem; color:#64748b; margin-left:6px; font-weight:400;">📍 ${slot.address}</span>`
          : '';

        const timeInfo = formatTime12Hour(slot.time);
        const slotItemClass = timeInfo.isPM ? 'slot-item-pm' : 'slot-item-am';

        html += `
          <div class="slot-item ${slotItemClass}">
            <span class="slot-time-text">${timeInfo.text}</span>
            <div class="slot-content">
              <div class="slot-title">
                <span style="background:#0d9488; color:#fff; width:20px; height:20px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; margin-right:4px;">${idx + 1}</span>
                ${slot.title} ${statusBadge} ${addressTag}
              </div>
              ${noteHTML}
            </div>
            <div class="slot-actions">
              <button class="btn-item-action btn-edit-slot" onclick="editItineraryItem(${item.day}, '${slot.id}')">
                <i data-lucide="edit-3"></i> 수정
              </button>
              <button class="btn-item-action btn-delete-slot" onclick="deleteItineraryItem(${item.day}, '${slot.id}')">
                <i data-lucide="trash-2"></i> 삭제
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `
          </div>

          <div class="itinerary-actions">
            <a href="${gmapsUrl}" target="_blank" class="btn btn-secondary btn-sm">
              <i data-lucide="navigation"></i> 구글맵 길찾기
            </a>
            <button class="btn btn-outline btn-sm" onclick="openAddEventModalForDay(${item.day})">
              <i data-lucide="plus"></i> 일정 추가
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  initLucideIcons();
}

// 5. STAYS & ACTIVITIES SHOWCASE
function renderStaysAndActivities() {
  const stayContainer = document.getElementById('stay-list');
  const activityContainer = document.getElementById('activity-list');

  if (stayContainer) {
    let stayHTML = '';
    itineraryData.forEach(item => {
      if (item.stay && !item.stay.includes('기내박') && !item.stay.includes('집으로')) {
        const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.stayAddress)}`;
        stayHTML += `
          <div class="stay-item-card">
            <h4>${item.stay}</h4>
            <div class="stay-dates">📅 Day ${item.day} (${item.date})</div>
            <div class="stay-address">📍 ${item.stayAddress}</div>
            <a href="${gmapsUrl}" target="_blank" class="btn btn-secondary btn-sm">
              <i data-lucide="map-pin"></i> 구글맵 위치 보기
            </a>
          </div>
        `;
      }
    });
    stayContainer.innerHTML = stayHTML;
  }

  if (activityContainer) {
    const activities = [
      { name: '🍔 퍼그버거 (Fergburger)', location: '퀸스타운', desc: '10월 6일 점심 · 뉴질랜드 최고의 버거 맛집' },
      { name: '🚢 밀포드 사운드 피오르드 투어', location: '피오르드 국립공원', desc: '10월 7일 (예상 50만원 / 미확정)' },
      { name: '🪂 Nzone 스카이다이빙', location: '퀸스타운', desc: '10월 8일 08:30 · 앞막힌 운동화 필수 지참!' },
      { name: '♨️ 온센 핫풀 (Onsen Hot Pools)', location: '퀸스타운', desc: '10월 8일 17:00 · 샷오버 강 전경 프라이빗 스파' },
      { name: '🏞️ 로이스 피크 (Roys Peak)', location: '와나카', desc: '10월 9일~10일 · 에메랄드 호수 최고 전망대' },
      { name: '🍣 푸카키 호수 알프스 연어', location: '푸카키 호수', desc: '10월 11일 점심 · Mt Cook Alpine Salmon' },
      { name: '🌌 테카포 은하수 별빛 관측', location: '테카포 선한목자교회', desc: '10월 12일 밤 · 별빛 보호구역 삼각대 필수' },
      { name: '🧙‍♂️ 호비튼 무비 세트 투어', location: '마타마타', desc: '10월 15일 06:00~17:00 · 호텔 앞 픽업' }
    ];

    let actHTML = '';
    activities.forEach(act => {
      const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.name + ' ' + act.location)}`;
      actHTML += `
        <div class="activity-item-card">
          <h4>${act.name}</h4>
          <div class="activity-desc">📍 ${act.location} · ${act.desc}</div>
          <a href="${gmapsUrl}" target="_blank" class="btn btn-secondary btn-sm">
            <i data-lucide="external-link"></i> 구글맵 길찾기
          </a>
        </div>
      `;
    });
    activityContainer.innerHTML = actHTML;
  }
}

// 6. CHECKLIST MANAGEMENT (CATEGORIZED)
function renderChecklist() {
  const container = document.getElementById('checklist-container');
  if (!container) return;

  const categoryNames = defaultChecklistCategories.map(c => c.name);

  // Collect any custom categories user might have added
  checklistItems.forEach(item => {
    if (!item.category) item.category = '기타';
    if (!categoryNames.includes(item.category)) {
      categoryNames.push(item.category);
    }
  });

  let totalCompleted = 0;
  const totalCount = checklistItems.length;

  let gridHTML = '';

  categoryNames.forEach(catName => {
    const itemsInCat = checklistItems.filter(i => i.category === catName);
    const catDoneCount = itemsInCat.filter(i => i.done).length;
    const catTotalCount = itemsInCat.length;

    itemsInCat.forEach(i => { if (i.done) totalCompleted++; });

    const catIconObj = defaultChecklistCategories.find(c => c.name === catName);
    const iconName = catIconObj ? catIconObj.icon : 'tag';

    gridHTML += `
      <div class="checklist-category-card">
        <div class="category-card-header">
          <div class="category-title">
            <i data-lucide="${iconName}"></i>
            <span>${catName}</span>
          </div>
          <span class="category-count">${catDoneCount}/${catTotalCount}</span>
        </div>
        <div class="category-card-body">
    `;

    if (itemsInCat.length === 0) {
      gridHTML += `<div class="empty-cat-msg">항목이 없습니다.</div>`;
    } else {
      itemsInCat.forEach(item => {
        gridHTML += `
          <div class="check-item ${item.done ? 'done' : ''}">
            <label>
              <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleCheckItem(${item.id})">
              <span>${item.text}</span>
            </label>
            <button class="btn-del-item" onclick="deleteCheckItem(${item.id})" title="삭제">&times;</button>
          </div>
        `;
      });
    }

    gridHTML += `
        </div>
      </div>
    `;
  });

  container.innerHTML = gridHTML;

  const percent = totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;
  const progressText = document.getElementById('checklist-progress-text');
  const progressFill = document.getElementById('checklist-progress-fill');

  if (progressText) progressText.textContent = `${percent}% 완료 (${totalCompleted}/${totalCount})`;
  if (progressFill) progressFill.style.width = `${percent}%`;

  localStorage.setItem('nz_checklist_v3', JSON.stringify(checklistItems));
  initLucideIcons();
}

function toggleCheckItem(id) {
  const item = checklistItems.find(i => i.id === id);
  if (item) {
    item.done = !item.done;
    renderChecklist();
  }
}

function deleteCheckItem(id) {
  checklistItems = checklistItems.filter(i => i.id !== id);
  renderChecklist();
}

document.getElementById('btn-add-item')?.addEventListener('click', () => {
  const input = document.getElementById('new-item-input');
  const catSelect = document.getElementById('new-item-category');
  if (!input || !input.value.trim()) return;

  const categoryVal = catSelect ? catSelect.value : '기타';

  checklistItems.push({
    id: Date.now(),
    text: input.value.trim(),
    category: categoryVal,
    done: false
  });

  input.value = '';
  renderChecklist();
});

document.getElementById('btn-reset-checklist')?.addEventListener('click', () => {
  if (confirm('체크리스트를 사진 원본 카테고리 상태로 초기화하시겠습니까?')) {
    checklistItems = JSON.parse(JSON.stringify(defaultChecklist));
    renderChecklist();
  }
});

// 7. TRIP MEMO (LOCAL STORAGE)
function initMemoArea() {
  const textarea = document.getElementById('trip-memo');
  const status = document.getElementById('memo-save-status');

  if (!textarea) return;

  textarea.value = localStorage.getItem('nz_trip_memo') || '';

  textarea.addEventListener('input', () => {
    localStorage.setItem('nz_trip_memo', textarea.value);
    if (status) {
      status.textContent = '저장 중...';
      setTimeout(() => { status.textContent = '자동 저장됨'; }, 600);
    }
  });
}

// 8. NZD CURRENCY CONVERTER
function initCurrencyConverter() {
  const nzdInput = document.getElementById('nzd-input');
  const krwInput = document.getElementById('krw-input');
  const rateInput = document.getElementById('base-rate');

  if (!nzdInput || !krwInput || !rateInput) return;

  function updateFromNZD() {
    const rate = parseFloat(rateInput.value) || 820;
    const nzdVal = parseFloat(nzdInput.value) || 0;
    krwInput.value = Math.round(nzdVal * rate);
  }

  function updateFromKRW() {
    const rate = parseFloat(rateInput.value) || 820;
    const krwVal = parseFloat(krwInput.value) || 0;
    nzdInput.value = (krwVal / rate).toFixed(2);
  }

  nzdInput.addEventListener('input', updateFromNZD);
  krwInput.addEventListener('input', updateFromKRW);
  rateInput.addEventListener('input', updateFromNZD);

  document.querySelectorAll('.calc-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const nzd = pill.getAttribute('data-nzd');
      nzdInput.value = nzd;
      updateFromNZD();
    });
  });
}

// 9. EDIT / DELETE / ADD ITINERARY FUNCTIONS
window.openAddEventModalForDay = function(dayNum) {
  const modal = document.getElementById('modal-add-event');
  document.getElementById('modal-heading-title').innerHTML = '<i data-lucide="calendar-plus"></i> 새 일정 추가';
  document.getElementById('modal-item-id').value = '';
  document.getElementById('modal-day-select').value = dayNum;
  document.getElementById('modal-time-input').value = '09:00';
  document.getElementById('modal-title-input').value = '';
  document.getElementById('modal-address-input').value = '';
  document.getElementById('modal-note-input').value = '';
  document.getElementById('modal-status-select').value = 'confirmed';

  if (modal) modal.classList.remove('hidden');
  initLucideIcons();
};

window.editItineraryItem = function(dayNum, itemId) {
  const dayItem = itineraryData.find(d => d.day === dayNum);
  if (!dayItem) return;

  const slotItem = (dayItem.items || []).find(i => i.id === itemId);
  if (!slotItem) return;

  const modal = document.getElementById('modal-add-event');
  document.getElementById('modal-heading-title').innerHTML = '<i data-lucide="edit-3"></i> 일정 수정하기';
  document.getElementById('modal-item-id').value = itemId;
  document.getElementById('modal-day-select').value = dayNum;
  document.getElementById('modal-time-input').value = slotItem.time || '';
  document.getElementById('modal-title-input').value = slotItem.title || '';
  document.getElementById('modal-address-input').value = slotItem.address || '';
  document.getElementById('modal-note-input').value = slotItem.note || '';
  document.getElementById('modal-status-select').value = slotItem.status || 'confirmed';

  if (modal) modal.classList.remove('hidden');
  initLucideIcons();
};

window.deleteItineraryItem = function(dayNum, itemId) {
  const dayItem = itineraryData.find(d => d.day === dayNum);
  if (!dayItem) return;

  if (confirm('선택하신 일정을 삭제하시겠습니까?')) {
    dayItem.items = (dayItem.items || []).filter(i => i.id !== itemId);
    saveItineraryData();
    renderItineraryCards(dayNum);
  }
};

function initModalEvents() {
  const modal = document.getElementById('modal-add-event');
  const btnAdd = document.getElementById('btn-add-custom-event');
  const btnClose = document.getElementById('btn-close-modal');
  const btnCancel = document.getElementById('btn-cancel-modal');
  const btnSave = document.getElementById('btn-save-event');

  if (!modal) return;

  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      openAddEventModalForDay(1);
    });
  }

  const closeModal = () => modal.classList.add('hidden');
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  if (btnSave) {
    btnSave.addEventListener('click', async () => {
      const itemId = document.getElementById('modal-item-id').value;
      const dayVal = parseInt(document.getElementById('modal-day-select').value);
      const timeVal = document.getElementById('modal-time-input').value.trim();
      const titleVal = document.getElementById('modal-title-input').value.trim();
      const addressVal = document.getElementById('modal-address-input').value.trim();
      const noteVal = document.getElementById('modal-note-input').value.trim();
      const statusVal = document.getElementById('modal-status-select').value;

      if (!titleVal) {
        alert('일정/메모 내용을 입력해 주세요.');
        return;
      }

      // Resolve GPS Coordinates for Map Pinning
      let coords = null;
      if (addressVal || titleVal) {
        coords = resolveSlotCoords({ address: addressVal, title: titleVal });
        if (!coords && addressVal) {
          coords = await geocodeAddress(addressVal);
        }
      }

      const dayItem = itineraryData.find(d => d.day === dayVal);
      if (dayItem) {
        if (!dayItem.items) dayItem.items = [];

        if (itemId) {
          // Edit existing item
          const existingItem = dayItem.items.find(i => i.id === itemId);
          if (existingItem) {
            existingItem.time = timeVal;
            existingItem.title = titleVal;
            existingItem.address = addressVal;
            if (coords) existingItem.coords = coords;
            existingItem.note = noteVal;
            existingItem.status = statusVal;
          }
        } else {
          // Add new item
          const newItem = {
            id: 'item-' + Date.now(),
            time: timeVal,
            title: titleVal,
            address: addressVal,
            note: noteVal,
            status: statusVal
          };
          if (coords) newItem.coords = coords;
          dayItem.items.push(newItem);
        }

        saveItineraryData();
        renderItineraryCards(dayVal);
        closeModal();
      }
    });
  }
}
