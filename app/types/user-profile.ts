import type { Course } from "~/utils/Interfaces";
export interface SocialLinkItem {
  name: string;
  url: string;
}

export interface UpdateProfilePayload {
  // Common fields
  firstName?: string;
  lastName?: string;
  name?: string;
  bio?: string;
  phone?: string;
  avatar?: string;
  skills?: string[];
  // API currently expects socialLinks as an array; we allow object for UI, and transform before send.
  socialLinks?: SocialLinkItem[];

  // Student fields
  program?: string;
  year?: string;
  gen?: string;

  // Teacher fields
  department?: string;
  position?: string;
  courses?: Course[] | string[];
  yearsOfExperience?: number;
}
