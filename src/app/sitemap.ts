import { MetadataRoute } from 'next'

// W3C-Datetime without fractional seconds. Google's sitemap parser has been
// known to reject lastmod values that include milliseconds (e.g. ...35.941Z),
// so we strip the millisecond portion before emitting.
const lastModified = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ranks.vhome.co.in'

    const routes: Array<{
        path: string
        changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
        priority: number
    }> = [
        { path: '/',              changeFrequency: 'weekly',  priority: 1.0 },
        { path: '/mocktest',      changeFrequency: 'weekly',  priority: 0.9 },
        { path: '/ranks',         changeFrequency: 'weekly',  priority: 0.9 },
        { path: '/ranks/info',    changeFrequency: 'monthly', priority: 0.7 },
        { path: '/mocktest/setup',changeFrequency: 'monthly', priority: 0.7 },
        { path: '/mocktest/results', changeFrequency: 'monthly', priority: 0.5 },
        { path: '/donate',        changeFrequency: 'monthly', priority: 0.4 },
        { path: '/terms',         changeFrequency: 'yearly',  priority: 0.3 },
    ]

    return routes.map(route => ({
        url: `${baseUrl}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }))
}
