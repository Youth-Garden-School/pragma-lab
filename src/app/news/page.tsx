"use client"

import Header from "@/components/Common/Layout/Header";
import Footer from "@/components/Common/Layout/Footer";

import Image from "next/image";
import Link from "next/link";
import { newsimage } from "./data";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function News() {
    const featuredNews = newsimage.filter(item => item.category === "Tin nổi bật");
    const latestNews = newsimage.filter(item => item.category === "Mới cập nhật");
    const allNews = newsimage;

    const [latestIndex, setLatestIndex] = useState(0);
    const [allIndex, setAllIndex] = useState(0);
    const visibleLatest = latestNews.slice(latestIndex, latestIndex + 4);
    const visibleAll = allNews.slice(allIndex, allIndex + 6);

    return(
        <div className="min-h-screen pt-[120px]">
            <Header />
            <div className="min-h-screen pt-[60px] pb-[60px] max-w-5xl mx-auto space-y-8">
                <h1 className="text-2xl font-bold text-cyan-400">| Tin nổi bật</h1>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[60%]">
                        <Link
                            key={featuredNews[0].id}
                            href={featuredNews[0].url}
                            className="block border rounded-xl shadow hover:shadow-lg transition h-full"
                        >
                            <div className="relative w-full h-64">
                                <Image
                                    src={featuredNews[0].image}
                                    alt={featuredNews[0].title}
                                    fill
                                    className="object-cover rounded-t-xl"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="font-semibold text-xl">{featuredNews[0].title}</h2>
                                {featuredNews[0].date && (
                                    <p className="text-xs text-gray-400 mt-1">{featuredNews[0].date}</p>
                                )}
                            </div>
                        </Link>
                    </div>
                    <div className="w-full lg:w-[40%] space-y-4">
                        {featuredNews.map((item, index) => (
                            (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    className="flex items-start gap-4 border rounded-xl shadow hover:shadow-lg transition p-2"
                                >
                                    <div className="relative flex-shrink-0 w-24 h-24">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-semibold text-sm md:text-base">{item.title}</h2>
                                        {item.date && (
                                            <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                                        )}
                                    </div>
                                </Link>
                            )
                        ))}
                    </div>
                </div>

                {/* Mới cập nhật */}
                <h1 className="text-2xl font-bold text-cyan-400">| Mới cập nhật</h1>
                <div className="relative">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => setLatestIndex(Math.max(latestIndex - 4, 0))}
                            className="p-2 disabled:opacity-30"
                            disabled={latestIndex === 0}
                        >
                            <ChevronLeft />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                            {visibleLatest.map(item => (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    className="block border rounded-xl shadow hover:shadow-lg transition"
                                >
                                    <div className="relative w-full h-36">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover rounded-t-xl"
                                        />
                                    </div>
                                    <div className="p-2">
                                        <h2 className="font-semibold text-sm line-clamp-2">{item.title}</h2>
                                        {item.date && (
                                            <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <button
                            onClick={() => setLatestIndex(Math.min(latestIndex + 4, latestNews.length - 4))}
                            className="p-2 disabled:opacity-30"
                            disabled={latestIndex + 4 >= latestNews.length}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                {/* Tất cả */}
                <h1 className="text-2xl font-bold text-cyan-400">| Tất cả</h1>
                <div className="relative">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => setAllIndex(Math.max(allIndex - 6, 0))}
                            className="p-2 disabled:opacity-30"
                            disabled={allIndex === 0}
                        >
                            <ChevronLeft />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {visibleAll.map(item => (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    className="flex items-start gap-4 border rounded-xl shadow hover:shadow-lg transition p-2"
                                >
                                    <div className="relative w-24 h-24 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-semibold text-sm md:text-base line-clamp-2">{item.title}</h2>
                                        {item.date && (
                                            <p className="text-xs text-gray-400 mt-1">Ngày đăng: {item.date}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <button
                            onClick={() => setAllIndex(Math.min(allIndex + 6, allNews.length - 6))}
                            className="p-2 disabled:opacity-30"
                            disabled={allIndex + 6 >= allNews.length}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}