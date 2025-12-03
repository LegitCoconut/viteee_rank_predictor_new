"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Link from "next/link";

export default function LimitReachedScreen() {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const difference = nextMonth.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft("Refreshing...");
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md text-center shadow-lg border-border/50">
                <CardHeader className="space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Limit Reached</CardTitle>
                    <CardDescription className="text-base">
                        Our free tier services have hit their maximum capacity for this month.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Resets in</p>
                        <p className="text-3xl font-bold tracking-tight font-mono">{timeLeft}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Please check back next month or upgrade for priority access.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/">Return Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
