'use client'
import { Assignment, Material } from "@/generated/prisma/client";
import { getFormattedDate } from "@/common/common";
import { useAssignmentsStore, useMaterialsStore } from "@/store/store"
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import parse from "html-react-parser";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);


  const [hoverById, setHoverById] = useState<Record<string, boolean>>({});

  const router = useRouter();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [associatedMaterials, setMaterials] = useState<Material[] | null>(null);

  useEffect(() => {

    async function fetchAssignment() {
      const a = await useAssignmentsStore.getState().getAssignment(id);

      if (a === null)
        router.push("/dashboard/assignments")

      await useMaterialsStore.getState().fetchAssignmentMaterials(a!.title);

      const materials = useMaterialsStore.getState().assignmentMaterials

      setAssignment(a);
      setMaterials(materials);
    }
    fetchAssignment();
  }, [id, router]);

  if (assignment === null || associatedMaterials === null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="justify-center flex">
      <div className="w-190 p-6">
        <div className="py-6 flex flex-col select-none border-b border-[#C4C7C5] text-[#1f1f1f]">
          <h2 className="flex items-center gap-2 text-2xl text-[#444746]">
            <span className="text-[32px]">{assignment.title}</span>
          </h2>
          <h5 className="text-[14px] font-medium">
            <span>Due {getFormattedDate(assignment.dateDue)}</span>
          </h5>
          <h5 className="text-[14px]">
            <span>{assignment.pointsPossible} points possible</span>
          </h5>
        </div>
        <div className="flex flex-col py-6 border-b border-[#C4C7C5] gap-6">
          <div>
            {parse(assignment.description)}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
              <span className="material-symbols-outlined text-white bg-blue-500 rounded-full p-1.5">book</span>
              <span className="text-{#1f1f1f] text-[24px] font-medium">Materials</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {associatedMaterials.map(material => {

                const isHovered = !!hoverById[material.id]

                return (
                  <div key={material.id}
                    onMouseOver={() => setHoverById((prev) => ({ ...prev, [material.id]: true }))}
                    onMouseLeave={() => setHoverById((prev) => ({ ...prev, [material.id]: false }))}
                    className={cn("border border-[#C4C7C5] rounded-md p-4 flex flex-col cursor-pointer")}>
                    <span className={cn("text-[#1f1f1f] text-[16px] font-medium truncate", isHovered && "text-blue-600")}>{material.title}</span>
                    <span className="text-[#444746] text-[14px] font-normal truncate h-4">{parse(material.description)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div >
        <div className="py-6 flex justify-between">
          <button className="px-3 py-2 bg-blue-100 text-blue-300 font-medium rounded-full" disabled title="This assignment is not currently accepting new submissions.">Upload submission</button>
          <Link href="/dashboard/assignments" className="cursor-pointer px-2 py-2 font-medium text-blue-600 hover:bg-blue-100 rounded-full">Back to assignments</Link>
        </div>
      </div >
    </div>
  )
}
