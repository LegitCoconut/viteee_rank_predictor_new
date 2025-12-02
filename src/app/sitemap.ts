import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrls = [
        'https://vitranks.malabarmatrix.site',
        'https://ranks.vhome.co.in'
    ]

    const routes = [
        {
            path: '',
            changeFrequency: 'yearly' as const,
            priority: 1,
        },
        {
            path: '/mocktest',
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        },
        {
            path: '/mocktest/setup',
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            path: '/mocktest/start',
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
    ]

    return baseUrls.flatMap(baseUrl =>
        routes.map(route => ({
            url: `${baseUrl}${route.path}`,
            lastModified: new Date(),
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        }))
    )
}
