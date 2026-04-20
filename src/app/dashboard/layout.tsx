"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/dashboard/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useAnnouncementStore, useGradesStore, useUserStore } from "@/store/store";
import { getFirstInitial, getUserColor } from "@/common/common";

export default function LayoutWrapper({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const pathname = usePathname();

    const announcements = useAnnouncementStore((state) => state.announcements)
    const grades = useGradesStore((state) => state.grades)
    const userFullName = useUserStore((state) => state.userFullName);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [clientPathname, setClientPathname] = useState<string | null>('')

    useEffect(() => {
        setClientPathname(pathname)
        useAnnouncementStore.getState().fetchAnnouncements();
        useGradesStore.getState().fetchGrades();
        useUserStore.getState().getUserInfo();
    }, [pathname])

    function toggleSidebar() {
        setIsSidebarOpen(!isSidebarOpen);
    }

    function getNumUnread(num: number) {
        if (num > 99) {
            return "99+";
        }
        return num.toString();
    }

    return (
        <div className={"bg-[#f8fafd]"}>
            <header className="flex items-center">
                <div className="flex items-center h-16 pl-6">
                    <span className="mr-4 flex items-center">
                        <button
                            className="w-10 h-10 -m-2 p-2 rounded-full text-[#444746] cursor-pointer hover:bg-[#eee]"
                            onClick={() => toggleSidebar()}>
                            <span className="select-none material-icons">menu</span>
                        </button>
                    </span>
                    <h1 className="flex items-center text-[#444746]">
                        <Link className="flex items-center ml-2 mr-0.5 hover:text-blue-600 hover:underline"
                            target="_self"
                            href="/dashboard">
                            <Image src="https://www.gstatic.com/classroom/logo_square_rounded.svg" className="h-7" height={28} width={28}
                                alt="CS6460 Grassroom" />
                            <span className="ml-2.5 text-[1.5rem]">Grassroom</span>
                        </Link>
                        <span className="flex items-center">
                            <span className="select-none material-icons">chevron_right</span>
                        </span>
                        <a className="flex items-center ml-2 mr-0.5 text-[1.375rem] hover:text-blue-600 hover:underline"
                            target="_self" href={"/dashboard"}>
                            <span>CS6460 Redesign Prototype</span>
                        </a>
                    </h1>
                </div>
                <div className="mx-4 pr-4 flex-1" />
                <div className="flex items-center pr-6 gap-5 select-none">
                    <span className="material-symbols-outlined">apps</span>
                    <div>
                        <div className="rounded-full mr-4 h-8 w-8 flex items-center justify-center text-white select-none text-md font-medium" style={{
                            backgroundColor: getUserColor(userFullName || "User")
                        }}>
                            {getFirstInitial(userFullName || "User")}
                        </div>
                    </div>
                </div>
            </header>
            <div className={"flex"}>
                <div className={"bg-[#f8fafd] text-[#444746]"}>
                    <Sidebar isOpen={isSidebarOpen}
                        setIsOpenAction={setIsSidebarOpen} />
                </div>
                <div className={"bg-white w-full rounded-tl-4xl flex flex-col text-[0.875rem] text-[#1f1f1f] border-b"}>
                    <div className={"border-b border-[#dadce0]"}>
                        <nav className={"flex ml-6 mr-3"}>
                            <div
                                className={`flex shrink-0 h-full relative font-normal hover:bg-[#eee] ${clientPathname === "/dashboard" ? "text-blue-600 border-b-3 border-blue-600" : "text-[#444746]"} `}>
                                <Link href="/dashboard/"
                                    scroll={false}
                                    className={"py-0.5 px-6 h-12 flex items-center shrink-0 gap-2"}>
                                    <span>Announcements</span>
                                    {announcements.filter(a => !a.seen).length > 0 && (<span className={`rounded-full h-5 w-5 flex items-center justify-center bg-blue-200 text-blue-600 font-bold text-xs`}>
                                        {getNumUnread(announcements.filter(a => !a.seen).length)}
                                    </span>)}
                                </Link>
                            </div>
                            <div
                                className={`flex shrink-0 h-full relative font-normal hover:bg-[#eee] ${clientPathname?.startsWith("/dashboard/grades") ? "text-blue-600 border-b-3 border-blue-600" : "text-[#444746]"} `}>
                                <Link href="/dashboard/grades"
                                    className={"py-0.5 px-6 h-12 flex items-center shrink-0 gap-2"}>
                                    <span>Grades</span>
                                    {grades.filter(g => !g.seen).length > 0 && (<span className={`rounded-full h-5 w-5 flex items-center justify-center bg-blue-200 text-blue-600 font-bold text-xs`}>
                                        {getNumUnread(grades.filter(g => !g.seen).length)}
                                    </span>)}
                                </Link>
                            </div>
                            <div className={`flex shrink-0 h-full relative font-normal hover:bg-[#eee] ${clientPathname?.startsWith("/dashboard/assignments") ? "text-blue-600 border-b-3 border-blue-600" : "text-[#444746]"} `}>
                                <Link href="/dashboard/assignments"
                                    className={"py-0.5 px-6 h-12 flex items-center shrink-0"}>Assignments</Link>
                            </div>
                            {/* <div className={`flex shrink-0 h-full relative font-normal hover:bg-[#eee] ${clientPathname?.startsWith("/dashboard/materials") ? "text-blue-600 border-b-3 border-blue-600" : "text-[#444746]"} `}>
                                <Link href="/dashboard/materials"
                                    className={"py-0.5 px-6 h-12 flex items-center shrink-0"}>Materials</Link>
                            </div> */}
                        </nav>
                    </div>
                    {children}
                </div>
            </div >
        </div >
    );
}
