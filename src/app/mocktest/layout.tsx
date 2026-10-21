import { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
    title: "Free VITEEE Mock Test 2027 - No Signup Required",
    description:
        "Take free VITEEE 2027 mock tests online without signup. Practice Physics, Chemistry, Maths & Aptitude with real exam pattern. Get instant results with section-wise analysis. 100 questions, 2 hours - exactly like the real VITEEE exam.",
    keywords: [
        // Mock test core
        "viteee mock test", "viteee mock tests", "viteee mock test 2027",
        "viteee practice test", "viteee practice test online",
        "viteee online practice test free", "free viteee mock test",
        "viteee online test", "viteee test series", "viteee exam simulator",
        "viteee CBT practice", "vit mock test 2027",

        // Previous year papers (high impressions)
        "viteee pyq", "viteee pyqs", "viteee previous year question paper",
        "viteee previous year question papers", "viteee pyq chapterwise pdf",
        "viteee sample paper", "viteee question paper", "viteee model paper",
        "viteee previous year questions",

        // Subject-wise practice
        "viteee physics mock test", "viteee chemistry mock test",
        "viteee maths mock test", "viteee aptitude questions",
        "viteee practice questions",

        // Exam & marking
        "viteee exam pattern", "viteee syllabus", "viteee syllabus 2027",
        "does viteee have negative marking", "viteee exam preparation",

        // Registration / date context
        "viteee registration", "viteee registration 2027",
        "viteee exam date", "viteee exam date 2027",
        "viteee slot booking", "viteee otbs", "viteee admit card",

        // Brand
        "vit", "vit exam", "vit entrance", "vit entrance exam",
        "vit entrance exam 2027", "vit eee", "vit vellore",
        "vit university",

        // NRI / admissions context
        "vit nri", "vit nri admission", "vit nri entrance",
        "vit nri entrance exam", "viteee nri",
        "vit admission", "vit admission 2027", "viteee counselling",
    ],
    alternates: {
        canonical: '/mocktest',
    },
    openGraph: {
        title: "Free VITEEE Mock Test 2027 - No Signup Required | VIT RANKS",
        description:
            "Practice with free VITEEE mock tests. 100 questions, real exam pattern, instant results. No signup needed.",
        url: '/mocktest',
        images: [
            {
                url: '/mocktest.png',
                width: 1200,
                height: 630,
                alt: 'VIT RANKS - Free VITEEE 2027 Mock Test',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Free VITEEE Mock Test 2027 - No Signup Required",
        description: "Practice with free VITEEE mock tests. 100 questions, real exam pattern, instant results.",
        images: ['/mocktest.png'],
    },
};

export default function MockTestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
