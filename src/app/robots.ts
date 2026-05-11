import { MetadataRoute } from 'next'

// Block list shared across every UA — we never want /api or the live mocktest
// runtime page indexed, regardless of crawler.
const DISALLOW = ['/api/', '/mocktest/start']

// Explicit allows for AI / LLM crawlers. Several of these (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended) check for their own named UA and back off
// when absent, so listing them by name materially improves indexing odds in
// ChatGPT, Claude, Perplexity, Gemini, Apple Intelligence and CCBot-fed
// datasets. We allow them site-wide except the same /api and live-mocktest
// pages that no UA should crawl.
const AI_BOTS = [
    // OpenAI / ChatGPT
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    // Anthropic / Claude
    'ClaudeBot',
    'Claude-Web',
    'Claude-SearchBot',
    'anthropic-ai',
    // Perplexity
    'PerplexityBot',
    'Perplexity-User',
    // Google AI (separate from Googlebot, which controls Search; this opts in
    // to Gemini and AI Overviews training/citation use)
    'Google-Extended',
    // Apple Intelligence
    'Applebot-Extended',
    // Common Crawl — feeds virtually every open-source LLM training set
    'CCBot',
    // Meta AI
    'meta-externalagent',
    'FacebookBot',
    // ByteDance / Doubao / TikTok search
    'Bytespider',
    // Mistral, You.com, Cohere
    'MistralAI-User',
    'YouBot',
    'cohere-ai',
    // Diffbot (used by several enterprise AI search products)
    'Diffbot',
    // DuckDuckGo AI
    'DuckAssistBot',
]

export default function robots(): MetadataRoute.Robots {
    const aiRules = AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOW,
    }))

    return {
        rules: [
            // Default for every UA we don't name explicitly
            {
                userAgent: '*',
                allow: '/',
                disallow: DISALLOW,
            },
            ...aiRules,
        ],
        sitemap: 'https://ranks.vhome.co.in/sitemap.xml',
        host: 'https://ranks.vhome.co.in',
    }
}
