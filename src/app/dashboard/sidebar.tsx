"use client";
import React, { Dispatch, SetStateAction, useState } from "react";

export default function Sidebar({ isOpen, setIsOpenAction, }: {
    isOpen: boolean,
    setIsOpenAction: Dispatch<SetStateAction<boolean>>
}) {

    const [isSidebarTempOpen, setIsSidebarTempOpen] = useState(false);

    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        event.stopPropagation();
        if (isOpen || isSidebarTempOpen) return;

        setIsSidebarTempOpen(true);
        setIsOpenAction(true);
    }

    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        event.stopPropagation();
        if (!isOpen || !isSidebarTempOpen) return;

        setIsSidebarTempOpen(false);
        setIsOpenAction(false);
    }


    return (
        <div className={`h-screen flex text-[0.875rem] font-medium leading-5 p-3 ${isOpen && "w-75"}`}>
            <div className={"w-full"} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a className={"cursor-pointer h-12 flex items-center select-none rounded-full hover:bg-[#eee]"}>
                    <span className="h-6 mx-1 text-center w-10 material-symbols-outlined">home</span>
                    <span className={`${!isOpen && "hidden"}`}>Home</span>
                </a>
                <a className={"cursor-pointer h-12 flex items-center select-none rounded-full hover:bg-[#eee]"}>
                    <span className="h-6 mx-1 text-center w-10 material-icons">calendar_today</span>
                    <span className={`${!isOpen && "hidden"}`}>Calendar</span>
                </a>
                <a className={"cursor-pointer h-12 flex items-center select-none rounded-full hover:bg-[#eee]"}>
                    <span className="h-6 mx-1 text-center w-10 material-icons">person</span>
                    <span className={`${!isOpen && "hidden"}`}>People</span>
                </a>
                <a className={"cursor-pointer h-12 flex items-center select-none rounded-full hover:bg-[#eee]"}>
                    <span className="h-6 mx-1 text-center w-10 material-symbols-outlined">auto_stories</span>
                    <span className={`${!isOpen && "hidden"}`}>Resources</span>
                </a>
                <a className={"cursor-pointer h-12 flex items-center select-none rounded-full hover:bg-[#eee]"}>
                    <span className="h-6 mx-1 text-center w-10 material-symbols-outlined">assistant</span>
                    <span className={`${!isOpen && "hidden"}`}>Gemini</span>
                </a>
            </div>
            <ul></ul>
        </div>
    );
}
