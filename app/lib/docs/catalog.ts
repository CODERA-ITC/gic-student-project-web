import folderStructureMd from "../../../docs/FOLDER_STRUCTURE_DETAILS.md?raw";
import middlewareMd from "../../../docs/MIDDLEWARE_DETAILS.md?raw";
import stateManagementMd from "../../../docs/STATE_MANAGEMENT_DETAILS.md?raw";

export interface ProjectDocItem {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export const projectDocs: ProjectDocItem[] = [
  {
    slug: "folder-structure",
    title: "Folder Structure Details",
    description:
      "How the frontend is organized and where to place pages, components, stores, services, and middleware.",
    content: folderStructureMd,
  },
  {
    slug: "state-management",
    title: "State Management Details",
    description:
      "Pinia store responsibilities, major actions, and state flow patterns used in the project.",
    content: stateManagementMd,
  },
  {
    slug: "middleware",
    title: "Middleware Details",
    description:
      "Route middleware behavior, usage examples, and role-based access patterns.",
    content: middlewareMd,
  },
];

export const getProjectDocBySlug = (slug: string) =>
  projectDocs.find((doc) => doc.slug === slug);
