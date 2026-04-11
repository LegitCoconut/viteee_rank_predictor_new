import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/mocktest/start'],
            },
        ],
        sitemap: 'https://ranks.vhome.co.in/sitemap.xml',
    }
}
