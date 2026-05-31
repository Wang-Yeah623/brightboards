#!/usr/bin/env node
// 校验所有 boards/*/board.yml 是否符合规范
// 在 CI 上跑, 也可以在本地 `npm run validate` 跑
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const BOARDS_DIR = path.resolve('boards');
const VALID_THEMES = ['warm', 'soft', 'bright', 'quiet', 'mono'];
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const MAX_LINE_LEN = 140;
const MAX_LINES = 5;
const MAX_TAGS = 3;

// 允许的 song 平台 URL 模式
const SONG_PATTERNS = [
  /youtube\.com\/watch\?v=/i,
  /youtu\.be\//i,
  /youtube\.com\/embed\//i,
  /youtube\.com\/shorts\//i,
  /bilibili\.com\/video\/BV/i,
  /music\.163\.com\/(?:#\/)?(?:song|m\/song)\?/i,
  /open\.spotify\.com\/(track|album|playlist|episode)\//i,
  /soundcloud\.com\/[\w-]+\/[\w-]+/i,
  /music\.apple\.com\//i,
  /\.mp3(\?|$)/i,
];

let errors = 0;
let checked = 0;
const errLines = [];

function err(file, msg) {
  errLines.push(`  ✗ ${file}\n    ${msg}`);
  errors++;
}

function getText(v) {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object' && typeof v.text === 'string') return v.text;
  return null;
}

function validateBoard(slug) {
  const relFile = `boards/${slug}/board.yml`;
  const fullFile = path.join(BOARDS_DIR, slug, 'board.yml');

  if (!SLUG_PATTERN.test(slug)) {
    err(
      relFile,
      `文件夹名 "${slug}" 不规范 — 只能含小写英文、数字、横线,且须以字母或数字开头`
    );
    return;
  }

  if (!fs.existsSync(fullFile)) {
    err(relFile, '该文件夹下缺少 board.yml');
    return;
  }

  let data;
  try {
    data = yaml.load(fs.readFileSync(fullFile, 'utf8'));
  } catch (e) {
    err(relFile, `YAML 解析失败: ${e.message}`);
    return;
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    err(relFile, '文件应该是一个 YAML 对象');
    return;
  }

  const toSelfRaw = data.to_self;
  const toStrangersRaw = data.to_strangers;
  const toSelf = Array.isArray(toSelfRaw) ? toSelfRaw : toSelfRaw ? [toSelfRaw] : [];
  const toStrangers = Array.isArray(toStrangersRaw)
    ? toStrangersRaw
    : toStrangersRaw
      ? [toStrangersRaw]
      : [];

  const validSelf = toSelf.map(getText).filter((t) => t && t.trim());
  const validStr = toStrangers.map(getText).filter((t) => t && t.trim());

  if (validSelf.length === 0 && validStr.length === 0) {
    err(relFile, '至少要有 to_self 或 to_strangers 中的一条 — 这块板子不能是空的');
    return;
  }

  if (toSelf.length > MAX_LINES) {
    err(relFile, `to_self 最多 ${MAX_LINES} 条 (当前 ${toSelf.length} 条)`);
  }
  if (toStrangers.length > MAX_LINES) {
    err(relFile, `to_strangers 最多 ${MAX_LINES} 条 (当前 ${toStrangers.length} 条)`);
  }

  validSelf.forEach((text, i) => {
    if (text.length > MAX_LINE_LEN) {
      err(
        relFile,
        `to_self[${i}] 超过 ${MAX_LINE_LEN} 字 (当前 ${text.length} 字) — 让它更短一点,读它的人才能 3 秒收到`
      );
    }
  });
  validStr.forEach((text, i) => {
    if (text.length > MAX_LINE_LEN) {
      err(
        relFile,
        `to_strangers[${i}] 超过 ${MAX_LINE_LEN} 字 (当前 ${text.length} 字)`
      );
    }
  });

  if (data.theme !== undefined && !VALID_THEMES.includes(data.theme)) {
    err(
      relFile,
      `theme "${data.theme}" 不在允许列表内, 应是 ${VALID_THEMES.join(' / ')}`
    );
  }

  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      err(relFile, 'tags 应该是一个列表');
    } else if (data.tags.length > MAX_TAGS) {
      err(relFile, `tags 最多 ${MAX_TAGS} 个 (当前 ${data.tags.length} 个)`);
    }
  }

  if (data.image !== undefined && data.image !== null) {
    const img = typeof data.image === 'string' ? { src: data.image } : data.image;
    const src = img && typeof img === 'object' ? img.src : null;
    if (!src || typeof src !== 'string') {
      err(relFile, 'image 缺少 src 字段(或不是字符串)');
    } else if (!/^https:\/\//i.test(src) && !src.startsWith('./')) {
      err(
        relFile,
        `image.src 必须是 https:// 链接或 ./ 相对路径,当前: ${src.slice(0, 80)}`
      );
    }
  }

  if (data.song !== undefined && data.song !== null) {
    const song = typeof data.song === 'string' ? { url: data.song } : data.song;
    const url = song && typeof song === 'object' ? song.url : null;
    if (!url || typeof url !== 'string') {
      err(relFile, 'song 缺少 url 字段(或不是字符串)');
    } else {
      const matched = SONG_PATTERNS.some((p) => p.test(url));
      if (!matched) {
        err(
          relFile,
          `song.url 不在支持的平台列表内 (YouTube/Bilibili/网易云/Spotify/SoundCloud/Apple Music/直接 .mp3): ${url.slice(0, 80)}`
        );
      }
    }
  }

  if (data.level !== undefined && ![1, 2, 3].includes(data.level)) {
    err(relFile, `level 只能是 1 / 2 / 3 (当前 ${JSON.stringify(data.level)})。一般不用手填,系统会按你的贡献数自动解锁`);
  }

  if (data.by !== undefined && (typeof data.by !== 'string' || !data.by.trim())) {
    err(relFile, 'by 应该是一个非空字符串(你的作者标识,如 GitHub 用户名 —— 用它把你的多块画板归到一起算贡献等级)');
  }

  checked++;
}

function main() {
  if (!fs.existsSync(BOARDS_DIR)) {
    console.error('No boards/ directory found.');
    process.exit(1);
  }

  const slugs = fs
    .readdirSync(BOARDS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort();

  console.log(`\n  Validating ${slugs.length} board(s)...\n`);

  for (const slug of slugs) {
    validateBoard(slug);
  }

  if (errors > 0) {
    console.log(errLines.join('\n\n'));
    console.log(`\n  ✗ ${errors} 个错误, ${checked} 块通过校验.\n`);
    console.log('  如果你不确定怎么改,看看 CONTRIBUTING.md 或在 PR 里 @ 我们.\n');
    process.exit(1);
  }

  console.log(`  ✓ 所有 ${checked} 块画板都通过校验.\n`);
}

main();
