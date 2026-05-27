<div align="center">

# BrightBoards · 心灯墙

> *每个人都是自己人生路上的灯塔，亦愿伸手，托举身旁同行之人。*

一个让每一个走过这里的人都被看见的留言项目 ——<br/>
每个人在仓库里都有自己的一块画板，<br/>
写一句给自己的话，写一句给陌生人的话，互相点亮。

[![Build](https://img.shields.io/badge/build-pending-lightgrey)]()
[![Boards](https://img.shields.io/badge/boards-5-ffb86c)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Made with care](https://img.shields.io/badge/made%20with-care-ff6b9d)]()

[**👉 浏览所有人的画板**](#) · [**🌱 创建你的画板**](CONTRIBUTING.md) · [**💡 这是为什么**](#这是为什么)

</div>

---

## 这是为什么

在这个技术越来越内卷、AI 越来越发达、"想进步又无从进步"的时代，我们很容易把自己活成一组指标 —— commit 数、followers、Star 数、KPI、绩效。慢慢地，连"我还好吗"这个最基本的问题都不会问自己了。

BrightBoards 想做一件很小的事：

**给每一个走过这里的人，一块属于自己的小小画板。**

在你的画板上：

- 写一句 **给自己** 的话 — 当你又开始内耗的时候，回来读它一遍
- 写一句 **给陌生人** 的话 — 给一个你永远不会认识的人，一点点光

每一次新的 PR 合并，就是又一个人在世界的某个角落悄悄说：「我在这里，我也在挣扎，但我愿意伸出一只手」。

而你这只手，会被另一个我们永远不会知道是谁的人接住。

---

## 怎么参与（5 分钟）

最简单的方式：花 5 分钟，给自己造一块板子。

1. **Fork** 本仓库
2. 在 `boards/` 下新建一个文件夹，用你的 GitHub 用户名（例如 `boards/your-name/`）
3. 把 [`boards/_template.yml`](boards/_template.yml) 复制到你的文件夹里，**重命名为 `board.yml`**
4. 打开它，写两句话 —— 一句给自己，一句给陌生人
5. 提 Pull Request

合并后，你的画板会自动出现在网站首页和你的专属页面里，还会生成一张可以嵌入到你 GitHub Profile README 的 **SVG 心灯卡**。

> 完整流程见 [**CONTRIBUTING.md**](CONTRIBUTING.md)。

---

## 看几块已经被点亮的画板

| 画板 | 一句话 |
| :--- | :--- |
| [🌱 **panda-walker**](boards/panda-walker/board.yml) | "今天的我，做到 60% 就够了。" |
| [🫧 **enough-already**](boards/enough-already/board.yml) | "把 '我应该' 换成 '我可以'。" |
| [🌅 **freshly-started**](boards/freshly-started/board.yml) | "迟到一点点开始，也是开始。" |
| [🌙 **quiet-walker**](boards/quiet-walker/board.yml) | "你能读到这里，说明你今天没有放弃自己。" |
| [◐ **still-here**](boards/still-here/board.yml) | "活下来就是赢。其他的，慢慢来。" |

> 你的会出现在下一行。

---

## 这个项目的来历

我是一个很容易内耗、很容易焦虑、很容易拿自己跟别人比的人。我做这个项目，一半是为了帮自己，一半是为了帮和我一样的人。

我也很坦诚地承认 —— 我**想要**这个项目获得很多 Star，因为那会让我觉得"被看见"。但我同时知道，"用 Star 数证明自己价值"这件事，恰恰是这个项目想帮所有人放下的东西。

这个张力是真实的，我不打算假装它不存在。如果你也带着这个张力走进来，欢迎你 —— 你不是一个人。

---

## 设计原则

- **门槛低**：会用 markdown / 会改一个 YAML 文件，就能参与
- **被看见，但不被消费**：每个人的板子都有自己的页面，不靠流量算法
- **真诚 > 漂亮**：组件是为了让真诚的话被更好地呈现，不是为了让你装饰得"足够分享"
- **永远拒绝**：仇恨、攻击、推广、自怜表演

不符合上面原则的 PR 会被礼貌地关闭。详见 [CONTRIBUTING.md](CONTRIBUTING.md#我们不接受什么)。

---

## 部署到 Cloudflare Pages（免费）

本项目默认按 Cloudflare Pages 部署，免费 + 国内访问快 + 自定义域名方便。

1. 把仓库 push 到你的 GitHub
2. 登录 [Cloudflare dashboard](https://dash.cloudflare.com/) → **Pages** → **Create a project** → **Connect to Git**
3. 选你刚 push 的仓库，配置 build：
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: `20`（在 Environment variables 里设 `NODE_VERSION=20`）
4. 点 **Save and Deploy**

完成后你会拿到一个 `*.pages.dev` 的 URL，2 分钟左右上线。之后每次 push 到 `main` 都会自动重新部署。

> **自定义域名**：在 Pages 项目里 Settings → Custom domains 添加，Cloudflare 自动签发 HTTPS 证书。
>
> **本仓库的 `.github/workflows/deploy.yml`** 只负责在 PR 时跑 validate + build —— 防止有人 push 坏画板进来。真正的部署由 Cloudflare Pages 自己接管。

部署完成后，记得回到 [`astro.config.mjs`](astro.config.mjs) 把 `site` 改成你的真实域名（影响 OG meta 和 sitemap）。

---

## License

[MIT](LICENSE) — 代码自由使用。但请记得：**每个人的画板里写的话，都是 ta 留给世界的礼物，请像对待礼物一样对待它们。**

<div align="center">

— 致此刻正在看这段文字的你 —

**你来到这里，本身就是了不起的事。**

</div>
