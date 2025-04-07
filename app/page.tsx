"use client";
import Link from "next/link";
import { ArrowRight, Globe, Shield, MapPin, Bell, User } from "lucide-react";
import { Suspense } from "react";
import SafetyDashboard from "@/components/safety-dashboard";
import DashboardSkeleton from "@/components/dashboard-skeleton";

export default function Home() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#1a0d2c] to-[#0f051a]">
            {/* Header */}

            <header className="sticky top-0 z-50 w-full border-b border-purple-900/30 bg-purple-950/60 backdrop-blur supports-[backdrop-filter]:bg-purple-950/40">
                <div className="container mx-auto flex h-16 items-center px-4">
                    <div className="flex items-center gap-2 font-bold text-xl text-white">
                        <Shield className="h-6 w-6 text-purple-400" />
                        <span>TravelSafe</span>
                    </div>
                    <nav className="ml-auto flex gap-6 items-center">
                        <Link
                            href="/"
                            className="text-sm font-medium text-white hover:text-purple-300 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/map"
                            className="text-sm font-medium text-white/80 hover:text-purple-300 transition-colors"
                        >
                            Safety Map
                        </Link>
                        <Link
                            href="/alerts"
                            className="text-sm font-medium text-white/80 hover:text-purple-300 transition-colors"
                        >
                            Alerts
                        </Link>
                        <button className="flex items-center justify-center rounded-full bg-purple-900/30 p-2 text-white hover:bg-purple-800/50 transition-colors">
                            <User className="h-4 w-4" />
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 flex flex-col justify-center min-h-[80vh] my-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mx-auto">
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Travel with confidence around the world
                        </h1>
                        <p className="text-xl text-purple-200/80">
                            Real-time safety alerts and travel advice for your global
                            adventures.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="/map"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
                            >
                                Explore Safety Map <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            {/* <Link
                                href="/alerts"
                                className="inline-flex h-10 items-center justify-center rounded-md border border-purple-800 bg-transparent px-8 text-sm font-medium text-purple-200 shadow-sm transition-colors hover:bg-purple-900/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
                            >
                                View Alerts
                            </Link> */}
                        </div>
                    </div>
                    <div className="flex justify-center ">
                        <div className="relative h-64 w-64 lg:h-80 lg:w-80">
                            <div
                                className="absolute inset-0 rounded-full bg-purple-700/20 animate-pulse"
                                style={{ animationDuration: "4s" }}
                            ></div>
                            <div
                                className="absolute inset-4 rounded-full bg-purple-600/20 animate-pulse"
                                style={{ animationDuration: "3s" }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Globe className="h-32 w-32 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Your Safety Dashboard
                                </h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Get real-time safety information for your destination
                                </p>
                            </div>
                        </div>
                        <Suspense fallback={<DashboardSkeleton />}>
                            <SafetyDashboard />
                        </Suspense>
                    </div>
                </section>

                {/* Features Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="rounded-lg border border-purple-900/50 bg-purple-950/30 p-6 hover:bg-purple-900/30 transition-colors">
                        <MapPin className="h-10 w-10 text-purple-400 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Global Coverage
                        </h3>
                        <p className="text-purple-200/70">
                            Safety information for over 200 countries and regions
                            worldwide.
                        </p>
                    </div>
                    <div className="rounded-lg border border-purple-900/50 bg-purple-950/30 p-6 hover:bg-purple-900/30 transition-colors">
                        <Bell className="h-10 w-10 text-purple-400 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Real-time Alerts
                        </h3>
                        <p className="text-purple-200/70">
                            Instant notifications about safety concerns in your travel
                            areas.
                        </p>
                    </div>
                    <div className="rounded-lg border border-purple-900/50 bg-purple-950/30 p-6 hover:bg-purple-900/30 transition-colors">
                        <Shield className="h-10 w-10 text-purple-400 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Safety Tips
                        </h3>
                        <p className="text-purple-200/70">
                            Expert advice and recommendations for staying safe abroad.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
