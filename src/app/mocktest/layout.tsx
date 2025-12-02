import { Metadata } from "next";
import getHypertune from "@/lib/hypertune";
import LimitReachedScreen from "@/components/LimitReachedScreen";

export const metadata: Metadata = {
    title: "Free VITEEE Mock Test 2026 - No Signup Required | VIT RANKS",
    description:
        "Take free, hassle-free VITEEE mock tests without any signups or unnecessary steps. Prepare for VITEEE 2026 with our comprehensive mock tests and resources.",
    keywords: [
        "viteee 2026",
        "viteee registration",
        "viteee registration 2026",
        "viteee exam",
        "vit",
        "viteee exam date",
        "viteee 2026 registration date",
        "viteee exam date 2026",
        "jee",
        "viteee form",
        "viteee 2025",
        "viteee application",
        "viteee fees",
        "bitsat",
        "viteee entrance exam",
        "vellore",
        "viteee college",
        "vit vellore",
        "jee mains",
        "bitsat 2026",
        "viteee registration last date",
        "viteee syllabus",
        "viteee 2026 registration last date",
        "vit registration",
        "what is viteee",
        "viteee.vit.ac.in 2026",
        "viteee admit card 2025",
        "cucet",
        "vit eee",
        "vit application form 2025 last date",
        "viteee preparation books",
        "amity university",
        "best engineering colleges in india",
        "niser",
        "viteee exam pattern and cutoff",
        "jee main 2026 registration",
    ],
    openGraph: {
        title: "Free VITEEE Mock Test 2026 - No Signup Required | VIT RANKS",
        description:
            "Take free, hassle-free VITEEE mock tests without any signups or unnecessary steps. Prepare for VITEEE 2026 with our comprehensive mock tests and resources.",
        images: ["/mocktest.png"],
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
