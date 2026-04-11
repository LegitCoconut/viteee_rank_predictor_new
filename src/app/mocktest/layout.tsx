import { Metadata } from "next";
import getHypertune from "@/lib/hypertune";
import LimitReachedScreen from "@/components/LimitReachedScreen";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Free VITEEE Mock Test 2026 - No Signup Required",
    description:
        "Take free VITEEE 2026 mock tests online without signup. Practice Physics, Chemistry, Maths & Aptitude with real exam pattern. Get instant results with section-wise analysis. 125 questions, 2.5 hours - exactly like the real VITEEE exam.",
    keywords: [
        "viteee mock test 2026", "viteee practice test", "viteee online test",
        "free viteee mock test", "viteee sample paper", "viteee model paper",
        "viteee test series", "viteee previous year questions",
        "viteee physics mock test", "viteee chemistry mock test",
        "viteee maths mock test", "viteee aptitude questions",
        "viteee exam preparation", "viteee practice questions",
        "viteee online practice test free", "vit mock test 2026",
        "viteee CBT practice", "viteee exam simulator",
    ],
    alternates: {
        canonical: '/mocktest',
    },
    openGraph: {
        title: "Free VITEEE Mock Test 2026 - No Signup Required | VIT RANKS",
        description:
            "Practice with free VITEEE mock tests. 125 questions, real exam pattern, instant results. No signup needed.",
        url: '/mocktest',
        images: [
            {
                url: '/mocktest.png',
                width: 1200,
                height: 630,
                alt: 'VIT RANKS - Free VITEEE 2026 Mock Test',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Free VITEEE Mock Test 2026 - No Signup Required",
        description: "Practice with free VITEEE mock tests. 125 questions, real exam pattern, instant results.",
        images: ['/mocktest.png'],
    },
};

export default async function MockTestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const root = await getHypertune();
    const allowTest = root.allowTEST({ fallback: false });

    if (!allowTest) {
        return <LimitReachedScreen />;
    }

    return <>{children}</>;
}
