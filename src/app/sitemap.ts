import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrls = [
        'https://ranks.vhome.co.in'
    ]

    const routes = [
        {
            path: '',
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            path: '/mocktest',
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            path: '/mocktest/setup',
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            path: '/mocktest/results',
            changeFrequency: 'monthly' as const,
            priority: 0.5,
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
