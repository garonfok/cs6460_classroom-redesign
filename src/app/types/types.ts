import { AnnouncementComment, User } from "@/generated/prisma/client";

export type FormattedAnnouncement = {
  id: string;
  content: string;
  author: User;
  comments: FormattedAnnouncementComment[];
  dateCreated: Date;
  seen: boolean;
};

export type FormattedAnnouncementComment = Omit<AnnouncementComment, "authorId"> & {
  author: User
};

export type FormattedGrade = {
  id: string;
  title: string;
  description: string;
  dateDue: Date;
  points: number | null;
  pointsPossible: number | null;
  comments: string | null;
  seen: boolean;
};
