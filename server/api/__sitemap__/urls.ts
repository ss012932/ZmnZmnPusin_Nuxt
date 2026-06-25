import { defineSitemapEventHandler, asSitemapUrl } from '#imports'

/**
 * 動態提供所有文章頁面 URL 給 @nuxtjs/sitemap
 * GET /api/__sitemap__/urls
 */
export default defineSitemapEventHandler(async () => {
  try {
    const data = await $fetch<{ data: any[] }>(
      'https://zmnzmnpusin-api.zmnzmnpusin.com.tw/api/public/categories'
    )

    const urls: ReturnType<typeof asSitemapUrl>[] = []

    for (const main of data?.data ?? []) {
      const mainCode = main.code || main.id

      // 主類別直屬文章（無子類別）
      for (const art of main.articles ?? []) {
        urls.push(asSitemapUrl({
          loc:        `/${mainCode}/${art.code || art.id}`,
          lastmod:    art.publishedAt || undefined,
          priority:   0.7,
          changefreq: 'monthly',
        }))
      }

      // 子類別文章
      for (const sub of main.subCategories ?? []) {
        const subCode = sub.code || sub.id
        for (const art of sub.articles ?? []) {
          urls.push(asSitemapUrl({
            loc:        `/${mainCode}/${subCode}/${art.code || art.id}`,
            lastmod:    art.publishedAt || undefined,
            priority:   0.7,
            changefreq: 'monthly',
          }))
        }
      }
    }

    return urls
  } catch {
    return []
  }
})
