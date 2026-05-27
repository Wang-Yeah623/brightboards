# 怎么造你自己的板子

整个流程大概 5 分钟。**不需要会写代码**，只要会改一个 YAML 文件就行。

---

## 一、Fork & 建文件夹

1. 点右上角 **Fork** 把仓库 fork 到你自己账号下
2. 把 fork 出来的仓库 clone 到本地（或者直接在 GitHub 网页上编辑）
3. 在 `boards/` 下面新建一个文件夹，名字用你想要的任何 slug（推荐用你的 GitHub 用户名或一个有意义的代号）

```
boards/
├── panda-walker/
├── quiet-walker/
└── 你的名字/        ← 新建
```

> ⚠️ 文件夹名只能用小写英文、数字、`-`，不能有空格、大写字母或中文（否则 URL 会出问题）。

---

## 二、复制模板

把 [`boards/_template.yml`](boards/_template.yml) 复制到你刚建的文件夹里，**重命名为 `board.yml`**。

```
boards/your-name/
└── board.yml
```

---

## 三、写两句话

打开 `board.yml`，**最少需要填两个字段**：

```yaml
to_self:
  - "你想对此刻正在内耗的自己说的一句话"

to_strangers:
  - "你想对一个永远不会认识的人说的一句话"
```

其他字段都是选填的，但建议至少给自己一个 emoji 和一个主题。看 [完整字段说明](#完整字段说明) 在下面。

---

## 四、提 PR

提交并发起 Pull Request。PR 标题建议写：

```
🌱 New board: your-name
```

我们会尽快合并。合并后：

- 你的画板会出现在网站首页轮播池
- 你拥有一个专属页面 `https://<域名>/boards/your-name/`
- 自动生成一张可嵌入个人 GitHub Profile README 的 SVG 心灯卡

---

## 完整字段说明

```yaml
# ─── 必填 ────────────────────────────────────────────────

# 你的名字（任意，可以是 ID、可以是化名、可以是中文）
name: "熊猫漫步"

# 写给自己的话，1 到 5 条
to_self:
  - "今天的我，做到 60% 就够了。"
  - "我不需要赢，只需要在。"

# 写给陌生访客的话，1 到 5 条
to_strangers:
  - "你能读到这里，说明你今天没有放弃自己 — 这本身就是了不起的事。"


# ─── 选填 ────────────────────────────────────────────────

# 一个能代表你的 emoji（一个就好）
emoji: "🌱"

# 主题色调，影响你的板子外观
# 可选: warm / soft / bright / quiet / mono
theme: warm

# 三个以内的标签
tags: ["反内卷", "够好就行", "今天也活着"]

# 你想留下的一个链接（个人主页/博客/Twitter/任何）
link: "https://github.com/your-username"

# 你写这块板子那天的状态（一个词，给未来回看的你看的）
mood_today: "平静"


# ─── 选填: 一张图 ──────────────────────────────────────

# 简写: 直接给一个 https:// 链接
image: "https://images.unsplash.com/photo-..."

# 或者带描述（更可访问）:
image:
  src: "https://images.unsplash.com/photo-..."
  alt: "雨夜窗边一盏小灯"


# ─── 选填: 一首歌 ──────────────────────────────────────
# 支持 YouTube / Bilibili / 网易云音乐 / Spotify / SoundCloud / Apple Music / 直接 .mp3 链接

# 简写:
song: "https://music.163.com/song?id=..."

# 或者带标题和"为什么":
song:
  url: "https://music.163.com/song?id=..."
  title: "夜空中最亮的星 — 逃跑计划"
  why: "凌晨三点听这首歌的时候，我做了一个决定。"
```

> **关于图片**：必须用 `https://` 开头的外链（推荐 Unsplash、Pexels、你自己的图床）。我们故意不允许上传图片到仓库，避免仓库越长越大。
>
> **关于歌**：支持自动嵌入 player 的平台有 YouTube / Bilibili / 网易云 / Spotify / SoundCloud / Apple Music，以及任何 `.mp3` 直接链接。其他链接会被 PR validate 阻止。

---

## 我们不接受什么

我们会礼貌地关闭以下 PR：

- **攻击/仇恨/歧视** — 任何针对群体或个人的攻击
- **推广/广告** — 推销产品、引流到付费服务、招募社群（个人主页链接 OK，付费引流不 OK）
- **政治/宗教传教** — 这里是给所有人的安静角落
- **自怜表演** — 真诚分享内心挣扎 ≠ 把痛苦当流量。我们鼓励真诚，反对炫耀痛苦
- **盗用他人的话** — 引用名言请注明出处；不要把别人的话署成自己的
- **超长内容** — 每条 `to_self` / `to_strangers` 不超过 140 字，让读它的人能在 3 秒内收到这份礼物

如果你的 PR 被关闭，我们会留下一段温和的解释 —— 那不是对你的否定，只是对内容的边界。

---

## 多块板子？

可以。

如果你想为不同的"自己"分别留一块板子（比如「焦虑的我」「平静的我」「3 年前的我」），可以在 `boards/` 下建多个文件夹：

```
boards/your-name/board.yml
boards/your-name-3-years-ago/board.yml
```

但请：一个 PR 只新增一块板子，让我们一块一块地点亮。

---

## 改你已有的板子

随时欢迎。提一个新 PR，标题写：

```
✨ Update board: your-name
```

无论是更新内容、改主题、加 emoji —— 这块画板永远是你的，你想改就改。

---

## 还有问题？

开 issue 问就好。或者来 [boards/panda-walker](boards/panda-walker/board.yml) 那块板子下留个 comment —— 我会看到。
