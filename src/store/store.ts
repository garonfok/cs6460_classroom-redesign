import { FormattedAnnouncement, FormattedGrade } from '@/app/types/types';
import { Assignment, Material } from '@/generated/prisma/client';
import { create } from 'zustand'

interface UserState {
  userId: string | null;
  userFullName: string | null;
  getUserInfo: () => Promise<void>;
};

interface AnnouncementState {
  announcements: FormattedAnnouncement[];
  fetchAnnouncements: () => Promise<void>;
  markAnnouncementAsSeen: (announcementId: string) => Promise<void>;
  addComment: (announcementId: string, content: string) => Promise<void>;
}

interface GradesState {
  grades: FormattedGrade[];
  fetchGrades: () => Promise<void>;
  markGradeAsSeen: (assignmentId: string) => Promise<void>;
}

interface AssignmentsState {
  assignments: Assignment[];
  fetchAssignments: () => Promise<void>;
  getAssignment: (assignmentId: string) => Promise<Assignment | null>;
}

interface MaterialsState {
  assignmentMaterials: Material[];
  fetchAssignmentMaterials: (assignmentName: string) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  userId: null,
  userFullName: null,
  getUserInfo: async () => {
    try {
      const userInfoResponse = await fetch('/api/authenticate');

      if (!userInfoResponse.ok) {
        console.error('Failed to fetch user info');
        return;
      }

      const userInfo: { id: string; fullName: string } = await userInfoResponse.json();
      set({ userId: userInfo.id, userFullName: userInfo.fullName });
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  },
}));

const useAnnouncementStore = create<AnnouncementState>((set) => ({
  announcements: [],
  fetchAnnouncements: async () => {
    try {
      const announcementsResponse = await fetch('/api/announcements');
      if (!announcementsResponse.ok) {
        console.error('Failed to fetch announcements');
        return;
      }

      const announcements: FormattedAnnouncement[] = await announcementsResponse.json();

      set({ announcements });

    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  },
  markAnnouncementAsSeen: async (announcementId: string) => {
    const response = await fetch(`/api/announcements/${announcementId}/seen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to mark announcement as seen');
    }
  },
  addComment: async (announcementId: string, content: string) => {
    const response = await fetch(`/api/announcements/${announcementId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      console.error('Failed to add comment');
    }
  }
}));

const useGradesStore = create<GradesState>((set) => ({
  grades: [],
  fetchGrades: async () => {
    try {
      const gradesResponse = await fetch('/api/grades');
      if (!gradesResponse.ok) {
        console.error('Failed to fetch grades');
        return;
      }

      const grades: FormattedGrade[] = await gradesResponse.json();

      set({ grades });

    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  },
  markGradeAsSeen: async (assignmentId: string) => {
    const response = await fetch(`/api/grades/${assignmentId}/seen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('Failed to mark grade as seen');
    }
  },
}));

const useAssignmentsStore = create<AssignmentsState>((set) => ({
  assignments: [],
  fetchAssignments: async () => {
    try {
      const response = await fetch('/api/assignments');
      if (!response.ok) {
        console.error('Failed to fetch assignments');
        return;
      }

      const assignments: Assignment[] = await response.json();
      set({ assignments });
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  },
  getAssignment: async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`);
      if (!response.ok) {
        console.error('Failed to fetch assignment');
        return null;
      }

      const assignment: Assignment = await response.json();
      return assignment;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      return null;
    }
  },
}));

const useMaterialsStore = create<MaterialsState>(set => ({
  assignmentMaterials: [],
  fetchAssignmentMaterials: async (assignmentName: string) => {
    try {
      const response = await fetch(`/api/materials/${assignmentName}`);
      if (!response.ok) {
        console.error('Failed to fetch materials');
      }

      const materials: Material[] = await response.json();
      set({ assignmentMaterials: materials})
    } catch (error) {
      console.log("Error fetching materials:", error)
    }
  }
}))

export { useUserStore, useAnnouncementStore, useGradesStore, useAssignmentsStore, useMaterialsStore };
