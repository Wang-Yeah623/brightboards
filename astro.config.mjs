import { defineConfig } from 'astro/config';

// 部署在 Cloudflare Pages 上(免费,国内访问快,自定义域名方便)
// 部署步骤见 README.md 的「部署」一节
//
// 如果你绑定了自定义域名,把 site 改成你的域名,例如 https://brightboards.com
// 如果用默认的 *.pages.dev 域名,改成 https://your-project.pages.dev
export default defineConfig({
  site: 'https://brightboards.pages.dev',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
