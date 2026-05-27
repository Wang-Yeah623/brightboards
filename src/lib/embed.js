// 识别音乐/视频 URL,返回 { kind, embedSrc, audioSrc, label, originalUrl }
// kind: 'iframe' (大多数平台) | 'audio' (直接 mp3) | null (无法识别)

const PATTERNS = [
  {
    label: 'YouTube',
    test: /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{6,})/i,
    toEmbed: (m) => `https://www.youtube.com/embed/${m[1]}`,
    aspect: '16/9',
  },
  {
    label: 'Bilibili',
    test: /bilibili\.com\/video\/(BV[\w]+)/i,
    toEmbed: (m) =>
      `https://player.bilibili.com/player.html?bvid=${m[1]}&autoplay=0&high_quality=1&danmaku=0`,
    aspect: '16/9',
  },
  {
    label: '网易云音乐',
    test: /music\.163\.com\/(?:#\/)?(?:song|m\/song)\?(?:[^#]*&)?id=(\d+)/i,
    toEmbed: (m) =>
      `https://music.163.com/outchain/player?type=2&id=${m[1]}&auto=0&height=66`,
    aspect: '330/86',
    fixedSize: { width: 330, height: 86 },
  },
  {
    label: 'Spotify',
    test: /open\.spotify\.com\/(track|album|playlist|episode)\/([\w]+)/i,
    toEmbed: (m) => `https://open.spotify.com/embed/${m[1]}/${m[2]}`,
    aspect: '16/5',
  },
  {
    label: 'SoundCloud',
    test: /soundcloud\.com\/[\w-]+\/[\w-]+/i,
    toEmbed: (m) =>
      `https://w.soundcloud.com/player/?url=${encodeURIComponent(
        'https://' + m[0].replace(/^https?:\/\//, '')
      )}&color=%23e87850&auto_play=false&show_user=true`,
    aspect: '16/5',
  },
  {
    label: 'Apple Music',
    test: /music\.apple\.com\/[\w]+\/(album|song|playlist)\/[\w-]+\/[\w-]+/i,
    toEmbed: (m) =>
      `https://embed.music.apple.com${m[0].replace(/^https?:\/\/music\.apple\.com/, '')}`,
    aspect: '16/5',
  },
];

const MP3_PATTERN = /\.mp3(\?|$)/i;

export function detectMedia(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  if (MP3_PATTERN.test(trimmed)) {
    return {
      kind: 'audio',
      audioSrc: trimmed,
      embedSrc: null,
      label: 'Audio',
      aspect: null,
      fixedSize: null,
      originalUrl: trimmed,
    };
  }

  for (const p of PATTERNS) {
    const m = trimmed.match(p.test);
    if (m) {
      return {
        kind: 'iframe',
        embedSrc: p.toEmbed(m),
        audioSrc: null,
        label: p.label,
        aspect: p.aspect || '16/9',
        fixedSize: p.fixedSize || null,
        originalUrl: trimmed,
      };
    }
  }

  return null;
}

export function isMediaUrl(url) {
  return detectMedia(url) !== null;
}
