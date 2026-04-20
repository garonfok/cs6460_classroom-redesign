'use client'
import { FormattedGrade } from "@/app/types/types";
import { getFormattedDate } from "@/common/common";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useGradesStore } from "@/store/store"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Grades() {

    const [openById, setOpenById] = useState<Record<string, boolean>>({});

    const [isUngradedOpen, setIsUngradedOpen] = useState(true);
    const [isGradedOpen, setIsGradedOpen] = useState(true);

    const router = useRouter();

    const grades = useGradesStore((state) => state.grades);
    const [gradedAssignments, ungradedAssignments] = grades.reduce(([gradedAcc, ungradedAcc], grade) => {
        if (grade.points !== null && grade.pointsPossible !== null) {
            return [[...gradedAcc, grade], ungradedAcc];
        }
        return [gradedAcc, [...ungradedAcc, grade]];
    }, [[], []] as [typeof grades, typeof grades]);

    useEffect(() => {
        useGradesStore.getState().fetchGrades();
    }, []);

    async function handleClick(event: React.MouseEvent<HTMLAnchorElement>, grade: FormattedGrade) {
        event.preventDefault();
        if (!grade.seen) {
            await useGradesStore.getState().markGradeAsSeen(grade.id);
        }

        useGradesStore.getState().fetchGrades();
        router.push(`/dashboard/assignments/${grade.id}`);
    }

    return (
        <div className="justify-center flex">
            <div className="w-190">
                <div className="p-6 flex flex-col select-none border-[#DADCE0] border-b-[0.58333333px]">
                    <h2 className="flex items-center gap-2 text-2xl text-[#444746]">
                        <span className="">Gradebook</span>
                    </h2>
                    <div className="flex items-center gap-1">
                        <span>You have</span>
                        <span className="font-bold text-xs h-5 w-5 flex items-center justify-center rounded-sm bg-blue-200 text-blue-600"> {ungradedAssignments.length} </span>
                        <span>ungraded {ungradedAssignments.length === 1 ? "assignment" : "assignments"}.</span>
                    </div>
                </div>
                {ungradedAssignments.length > 0 && <Collapsible open={isUngradedOpen} onOpenChange={setIsUngradedOpen} className="flex flex-col">
                    <CollapsibleTrigger className="flex text-2xl p-6 border-b border-[#C4C7C5] cursor-pointer hover:bg-[#1f1f1f14]">
                        <span className="flex-1 flex">Ungraded</span>
                        <div className="flex-1 flex justify-end">
                            <div className="w-6 flex justify-center">
                                <span className="material-icons-outlined">{isUngradedOpen ? "expand_less" : "expand_more"}</span>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {ungradedAssignments.map(grade => (
                            <Collapsible key={grade.id}>
                                <Link href={`/dashboard/assignments/${grade.id}`} className="flex items-center px-6 py-2 border-b border-[#e0e0e0] select-none hover:bg-[#1f1f1f14] cursor-pointer">
                                    <div className="flex flex-col flex-1">
                                        <span className="font-medium text-[0.875rem] text-[#1f1f1f]">
                                            {grade.title}
                                        </span>
                                        <span className="text-[0.75rem] text-[#444746]">Due {getFormattedDate(grade.dateDue)}</span>
                                    </div>
                                    <div className="text-[0.75rem] text-[#444746]">/{grade.pointsPossible}</div>
                                </Link>
                            </Collapsible>
                        ))}
                    </CollapsibleContent>
                </Collapsible>}
                <br />
                {gradedAssignments.length > 0 && <Collapsible open={isGradedOpen} onOpenChange={setIsGradedOpen} className="flex flex-col">
                    <CollapsibleTrigger className="flex text-2xl p-6 border-b border-[#C4C7C5] cursor-pointer hover:bg-[#1f1f1f14]">
                        <span className="flex-1 flex">Graded</span>
                        <div className="flex-1 flex justify-end">
                            <div className="w-6 flex justify-center">
                                <span className="material-icons-outlined">{isUngradedOpen ? "expand_less" : "expand_more"}</span>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {gradedAssignments.map(grade => {
                            const isOpen = !!openById[grade.id];
                            return (
                                <Collapsible key={grade.id} open={isOpen} onOpenChange={(open) => setOpenById((prev) => ({ ...prev, [grade.id]: open }))} className="border-b border-[#e0e0e0] select-none">
                                    <CollapsibleTrigger className="w-full flex items-center px-6 hover:bg-[#1f1f1f14] py-2">
                                        <div className="items-start flex flex-col flex-1">
                                            <span className="font-medium text-[0.875rem] text-[#1f1f1f] relative">
                                                {!grade.seen && <div className="h-2 w-2 bg-blue-300 absolute -left-4 top-1/2 transform -translate-y-1/2 rounded-full" />}
                                                {grade.title}
                                            </span>
                                            <span className="text-[0.75rem] text-[#444746]">Due {getFormattedDate(grade.dateDue)}</span>
                                            <div className="flex flex-1">
                                                <Link onClick={async (event) => await handleClick(event, grade)} href={`/assignments/${grade.id}`} className="flex items-center cursor-pointer text-blue-600 font-bold hover:underline">Open assignment</Link>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-bold text-xl text-[#1f1f1f]">{grade.points}</span>
                                            <span className="text-[0.75rem] text-[#444746]">/{grade.pointsPossible}</span>
                                        </div>
                                        <div className="flex-1 flex justify-end">
                                            <div className="w-6 flex justify-center">
                                                <span className="material-icons-outlined" style={{ fontSize: 18 }}>{isOpen ? "expand_less" : "expand_more"}</span>
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="flex flex-col mx-2 px-6 pb-2">
                                            <div className="flex items-center border-t border-[#e0e0e0] px-2pt-2 gap-1">
                                                <span className="font-medium text-[0.875rem] text-[#1f1f1f]">Teacher Feedback</span>
                                            </div>
                                            <span className="text-[0.875rem] text-[#444746] whitespace-pre-wrap">{grade.comments || "No feedback provided."}</span>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            )
                        })}
                    </CollapsibleContent>
                </Collapsible>}
            </div >
        </div >
    )
}
