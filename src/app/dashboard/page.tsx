"use client";
import { getFirstInitial, getFormattedDate, getUserColor } from "@/common/common";
import { useAnnouncementStore, useUserStore } from "@/store/store"
import { FormattedAnnouncement } from "@/app/types/types";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function Announcements() {

  const announcements = useAnnouncementStore((state) => state.announcements);
  const userStore = useUserStore();
  const userFullName = userStore.userFullName;

  const [openById, setOpenById] = useState<Record<string, boolean>>({});

  useEffect(() => {
    useAnnouncementStore.getState().fetchAnnouncements();
    useUserStore.getState().getUserInfo();
  }, []);

  function handleClick(event: React.MouseEvent<HTMLDivElement>, announcement: FormattedAnnouncement) {
    // event.preventDefault();

    if (!announcement.seen) {
      useAnnouncementStore.getState().markAnnouncementAsSeen(announcement.id);

      // Optimistically update the UI
      const updatedAnnouncements = announcements.map((a) => {
        if (a.id === announcement.id) {
          return { ...a, seen: true };
        }
        return a;
      });
      useAnnouncementStore.setState({ announcements: updatedAnnouncements });
    }
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>, announcementId: string) {
    const formData = new FormData(event.currentTarget);
    event.currentTarget.reset();
    event.preventDefault();
    const content = formData.get(`content-${announcementId}`) as string;

    await useAnnouncementStore.getState().addComment(announcementId, content);
    await useAnnouncementStore.getState().fetchAnnouncements();
  }

  return (
    <div className="justify-center flex">
      <div className="w-190">
        {announcements.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()).map((announcement) => {
          const isOpen = !!openById[announcement.id];
          return (
            <div key={announcement.id} className={`bg-[#f0f4f9] mb-4 rounded-[.75rem] mt-6 flex flex-col ${announcement.seen ? '' : 'ring-2 ring-blue-600'}`} onClick={(event) => handleClick(event, announcement)}>
              <div className="flex flex-col border-b border-[#d1d5db]">
                <div className="text-sm px-4 pt-4 text-gray-500 mb-2 flex items-center">
                  <div className="rounded-full mr-4 h-10 w-10 flex items-center justify-center text-white select-none text-lg font-medium" style={{
                    backgroundColor: getUserColor(announcement.author.name)
                  }}>
                    {getFirstInitial(announcement.author.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[.875rem] font-medium text-[#1f1f1f]">{announcement.author.name}</span>
                    <span className="text-[.875rem] text-[#444746]">
                      {getFormattedDate(announcement.dateCreated)}
                    </span>
                  </div>
                </div>
                <div className="px-4">{announcement.content}</div>
              </div>
              <div className="py-1">
                <Collapsible open={isOpen} onOpenChange={(open) => setOpenById((prev) => ({ ...prev, [announcement.id]: open }))}>
                  <CollapsibleTrigger className="flex gap-4 items-center cursor-pointer text-blue-600 font-bold mx-2 my-2 rounded-full hover:bg-blue-100 px-2 py-2">
                    <span className="text-center material-icons-outlined" style={{ fontSize: "18px" }}>comment</span>
                    <span>
                      {isOpen ? "Hide comments" : announcement.comments.length > 0 ? `View comments (${announcement.comments.length})` : "Add a comment"}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mx-4 my-2 flex flex-col gap-4">
                    {announcement.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-4">
                        <div className="rounded-full h-8 w-8 flex items-center justify-center text-white select-none text-md font-medium" style={{
                          backgroundColor: getUserColor(comment.author.name)
                        }}>
                          {getFirstInitial(comment.author.name)}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-[.875rem] font-medium text-[#1f1f1f]">{comment.author.name}</span>
                            <span className="text-[.675rem]">
                              {getFormattedDate(comment.dateCreated)}
                            </span>
                          </div>
                          <span className="text-[.875rem] text-[#444746]">
                            {comment.content}
                          </span>
                        </div>
                      </div>
                    ))}
                    <form onSubmit={async (event) => await handleSubmit(event, announcement.id)} className="flex items-center gap-4">
                      <span className="rounded-full h-8 w-8 flex items-center justify-center text-white select-none text-md font-medium" style={{
                        backgroundColor: getUserColor(userFullName || "User")
                      }}>
                        {getFirstInitial(userFullName || "User")}
                      </span>
                      <input required type="text" name={`content-${announcement.id}`} className="border rounded-full border-gray-300 px-4 py-1 placeholder:text-xs flex-1" placeholder="Add class comment" />
                      <button type="submit" className="cursor-pointer material-symbols-outlined text-gray-500" style={{ fontSize: "28px" }}>send</button>
                    </form>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
