import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import type { Project } from "@/types/project";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function createProjectSlug(name: string, projectId: string): string {
  const base = slugify(name) || "untitled-project";
  return `${base}-${projectId.slice(-6)}`;
}

export async function getEditorProjectLists(): Promise<{
  ownedProjects: Project[];
  sharedProjects: Project[];
}> {
  const { userId } = await auth();

  if (!userId) {
    return { ownedProjects: [], sharedProjects: [] };
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      include: { collaborators: true },
    }),
    email
      ? prisma.project.findMany({
          where: {
            collaborators: {
              some: {
                email,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          include: { collaborators: true },
        })
      : Promise.resolve([]),
  ]);

  const normalize = (project: {
    id: string;
    name: string;
    ownerId: string;
  }): Project => ({
    id: project.id,
    name: project.name,
    slug: createProjectSlug(project.name, project.id),
    role: project.ownerId === userId ? "owner" : "collaborator",
  });

  return {
    ownedProjects: ownedProjects.map(normalize),
    sharedProjects: sharedProjects.map(normalize),
  };
}
