import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const BOARDS_DIR = path.resolve(__dirname, '../../boards');

const VALID_THEMES = ['warm', 'soft', 'bright', 'quiet', 'mono'];
const MAX_LINE_LEN = 140;
const MAX_LINES = 5;
const MAX_TAGS = 3;

function toArray(v) {
  if (v === null || v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function toText(v) {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object' && typeof v.text === 'string') return v.text.trim();
  return '';
}

function parseImage(v) {
  if (!v) return null;
  if (typeof v === 'string') {
    const src = v.trim();
    return src ? { src, alt: '' } : null;
  }
  if (typeof v === 'object' && v.src) {
    const src = String(v.src).trim();
    if (!src) return null;
    return { src, alt: String(v.alt || '').trim().slice(0, 200) };
  }
  return null;
}

function parseSong(v) {
  if (!v) return null;
  if (typeof v === 'string') {
    const url = v.trim();
    return url ? { url, title: '', why: '' } : null;
  }
  if (typeof v === 'object' && v.url) {
    const url = String(v.url).trim();
    if (!url) return null;
    return {
      url,
      title: String(v.title || '').trim().slice(0, 120),
      why: String(v.why || '').trim().slice(0, 200),
    };
  }
  return null;
}

function normalize(data, slug) {
  return {
    slug,
    name: (data?.name ? String(data.name) : slug).trim(),
    emoji: (data?.emoji ? String(data.emoji) : '✦').trim(),
    theme: VALID_THEMES.includes(data?.theme) ? data.theme : 'warm',
    to_self: toArray(data?.to_self)
      .map(toText)
      .filter(Boolean)
      .slice(0, MAX_LINES)
      .map((s) => s.slice(0, MAX_LINE_LEN)),
    to_strangers: toArray(data?.to_strangers)
      .map(toText)
      .filter(Boolean)
      .slice(0, MAX_LINES)
      .map((s) => s.slice(0, MAX_LINE_LEN)),
    tags: toArray(data?.tags).map(toText).filter(Boolean).slice(0, MAX_TAGS),
    link: data?.link ? String(data.link).trim() : '',
    mood_today: data?.mood_today ? String(data.mood_today).trim() : '',
    image: parseImage(data?.image),
    song: parseSong(data?.song),
  };
}

function readOneBoard(slug) {
  const file = path.join(BOARDS_DIR, slug, 'board.yml');
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf8');
  let data;
  try {
    data = yaml.load(raw);
  } catch (e) {
    console.error(`Failed to parse ${file}:`, e.message);
    return null;
  }
  if (!data || typeof data !== 'object') return null;
  const board = normalize(data, slug);
  if (board.to_self.length === 0 && board.to_strangers.length === 0) return null;
  return board;
}

export function getAllBoards() {
  if (!fs.existsSync(BOARDS_DIR)) return [];
  const entries = fs.readdirSync(BOARDS_DIR, { withFileTypes: true });
  const slugs = entries
    .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort();

  const boards = [];
  for (const slug of slugs) {
    const b = readOneBoard(slug);
    if (b) boards.push(b);
  }
  return boards;
}

export function getBoardBySlug(slug) {
  return readOneBoard(slug);
}

export function getRandomFeatured(count = 3, seed = 0) {
  const all = getAllBoards();
  if (all.length <= count) return all;
  let s = seed || Date.now();
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const shuffled = [...all].sort(() => rand() - 0.5);
  return shuffled.slice(0, count);
}
