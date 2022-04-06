/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');

(async () => {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
  const postres = await fetch(`${process.env.NEXT_PUBLIC_API}/blogs`);
  const posts = await postres.json();
  const catres = await fetch(`${process.env.NEXT_PUBLIC_API}/categories`);
  const cats = await catres.json();
  const tagres = await fetch(`${process.env.NEXT_PUBLIC_API}/tags`);
  const tags = await tagres.json();
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby([
    'pages/**/*{.js,.jsx,.tsx}',
    '!pages/_*{.jsx,.tsx}',
    '!pages/500{.jsx,.tsx}',
    '!pages/api',
    '!pages/auth',
    '!pages/admin',
    '!pages/user',
    '!pages/account',
    '!pages/profile',
    '!pages/**/[id]{.jsx,.tsx}',
    '!pages/**/[slug]{.jsx,.tsx}'
  ]);

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .map((page) => {
                const path = page.replace('pages', '').replace('.jsx', '');
                const route = path === '/index' ? '' : path;

                return `
                        <url>
                            <loc>${`https://bot-thk.vercel.app${route}`}</loc>
                        </url>
                    `;
              })
              .join('')}
                ${posts
                  .map(({ _id }) => {
                    return `
                            <url>
                                <loc>${`https://bot-thk.vercel.app/blogs/${_id}`}</loc>
                            </url>
                        `;
                  })
                  .join('')}
                ${cats
                  .map(({ slug }) => {
                    return `
                            <url>
                                <loc>${`https://bot-thk.vercel.app/categories/${slug}`}</loc>
                            </url>
                        `;
                  })
                  .join('')}
                ${tags
                  .map(({ slug }) => {
                    return `
                            <url>
                                <loc>${`https://bot-thk.vercel.app/tags/${slug}`}</loc>
                            </url>
                        `;
                  })
                  .join('')}
        </urlset>
    `;

  // If you're not using Prettier, you can remove this.
  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html'
  });

  fs.writeFileSync('public/sitemap.xml', formatted);
})();
