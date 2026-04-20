'use client'
import { getFormattedDate } from "@/common/common";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAssignmentsStore } from "@/store/store"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Assignments() {

    const [isUpcomingOpen, setIsUpcomingOpen] = useState(true);
    const [isPastOpen, setIsPastOpen] = useState(true);

    const assignments = useAssignmentsStore((state) => state.assignments);
    const [upcomingAssignments, pastAssignments] = assignments.reduce(([upcomingAcc, pastAcc], assignment) => {
        if (new Date(assignment.dateDue) >= new Date()) {
            return [[...upcomingAcc, assignment], pastAcc];
        }
        return [upcomingAcc, [...pastAcc, assignment]];
    }, [[], []] as [typeof assignments, typeof assignments]);

    useEffect(() => {
        useAssignmentsStore.getState().fetchAssignments();
    }, []);

    return (
        <div className="justify-center flex">
            <div className="w-190">
                <div className="p-6 flex flex-col select-none border-[#DADCE0] border-b-[0.58333333px]">
                    <h2 className="flex items-center gap-2 text-2xl text-[#444746]">
                        <span className="">Assignments</span>
                    </h2>
                    <div className="flex items-center gap-1">
                        <span>You have</span>
                        <span className="font-bold text-xs h-5 w-5 flex items-center justify-center rounded-sm bg-blue-200 text-blue-600"> {upcomingAssignments.length} </span>
                        <span>upcoming {upcomingAssignments.length === 1 ? "assignment" : "assignments"}.</span>
                    </div>
                </div>
                {upcomingAssignments.length > 0 && <Collapsible open={isUpcomingOpen} onOpenChange={setIsUpcomingOpen} className="flex flex-col">
                    <CollapsibleTrigger className="flex text-2xl p-6 border-b border-[#C4C7C5] cursor-pointer hover:bg-[#1f1f1f14]">
                        <span className="flex-1 flex">Upcoming Assignments</span>
                        <div className="flex-1 flex justify-end">
                            <div className="w-6 flex justify-center">
                                <span className="material-icons-outlined">{isUpcomingOpen ? "expand_less" : "expand_more"}</span>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {upcomingAssignments.map(assignment => (
                            <Collapsible key={assignment.id}>
                                <Link href={`/dashboard/assignments/${assignment.id}`} className="flex items-center px-6 py-2 border-b border-[#e0e0e0] select-none hover:bg-[#1f1f1f14] cursor-pointer">
                                    <div className="flex flex-col flex-1">
                                        <span className="font-medium text-[0.875rem] text-[#1f1f1f]">
                                            {assignment.title}
                                        </span>
                                        <span className="text-[0.75rem] text-[#444746]">Due {getFormattedDate(assignment.dateDue)}</span>
                                    </div>
                                </Link>
                            </Collapsible>
                        ))}
                    </CollapsibleContent>
                </Collapsible>}
                <br />
                {pastAssignments.length > 0 && <Collapsible open={isPastOpen} onOpenChange={setIsPastOpen} className="flex flex-col">
                    <CollapsibleTrigger className="flex text-2xl p-6 border-b border-[#C4C7C5] cursor-pointer hover:bg-[#1f1f1f14]">
                        <span className="flex-1 flex">Past Assignments</span>
                        <div className="flex-1 flex justify-end">
                            <div className="w-6 flex justify-center">
                                <span className="material-icons-outlined">{isPastOpen ? "expand_less" : "expand_more"}</span>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {pastAssignments.map(assignment => (
                            <div key={assignment.id} className="border-b border-[#e0e0e0] select-none w-full flex items-center px-6 hover:bg-[#1f1f1f14] py-2">
                                <div className="items-start flex flex-col flex-1">
                                    <span className="font-medium text-[0.875rem] text-[#1f1f1f] relative">
                                        {assignment.title}
                                    </span>
                                    <span className="text-[0.75rem] text-[#444746]">Due {getFormattedDate(assignment.dateDue)}</span>
                                    <div className="flex flex-1">
                                        <Link href={`/dashboard/assignments/${assignment.id}`} className="flex items-center cursor-pointer text-blue-600 font-bold hover:underline">Open assignment</Link>
                                    </div>
                                </div>
                                <div className="flex items-center flex-1">
                                    <span className="text-[0.75rem] text-[#444746]">{assignment.pointsPossible} points possible</span>
                                </div>
                            </div>
                        ))}
                    </CollapsibleContent>
                </Collapsible>}
            </div >
        </div >
    )
}
