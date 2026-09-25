"use client"

import type { ReactNode } from "react"
import { FolderOpen, Pencil, Plus, Trash2, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Project } from "@/types/project"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  ownedProjects: Project[]
  sharedProjects: Project[]
  onCreateProject: () => void
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
  className?: string
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  className,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close project sidebar"
          className="fixed inset-x-0 bottom-0 top-14 z-30 cursor-pointer border-0 bg-base/80 lg:hidden"
          tabIndex={-1}
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-14 z-40 flex w-80 shrink-0 flex-col border-r border-surface-border bg-surface shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          <h2 className="text-sm font-semibold text-copy-primary">Projects</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close project sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="flex min-h-0 flex-1 flex-col px-4">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="my-projects"
            className="mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto pr-1"
          >
            <ProjectList
              projects={ownedProjects}
              emptyIcon={<FolderOpen className="h-8 w-8 text-copy-muted" />}
              emptyTitle="No projects yet"
              emptyDescription="Create your first architecture project to get started."
              onRenameProject={onRenameProject}
              onDeleteProject={onDeleteProject}
            />
          </TabsContent>
          <TabsContent
            value="shared"
            className="mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto pr-1"
          >
            <ProjectList
              projects={sharedProjects}
              emptyIcon={<Users className="h-8 w-8 text-copy-muted" />}
              emptyTitle="Nothing shared yet"
              emptyDescription="Projects shared with you will appear here."
              onRenameProject={onRenameProject}
              onDeleteProject={onDeleteProject}
            />
          </TabsContent>
        </Tabs>

        <div className="shrink-0 p-4">
          <Button className="w-full rounded-xl" onClick={onCreateProject} type="button">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}

interface ProjectListProps {
  projects: Project[]
  emptyIcon: ReactNode
  emptyTitle: string
  emptyDescription: string
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

function ProjectList({
  projects,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  onRenameProject,
  onDeleteProject,
}: ProjectListProps) {
  if (projects.length === 0) {
    return <SidebarEmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="space-y-1">
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          onRename={onRenameProject}
          onDelete={onDeleteProject}
        />
      ))}
    </div>
  )
}

interface ProjectItemProps {
  project: Project
  onRename: (project: Project) => void
  onDelete: (project: Project) => void
}

function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
  const isOwner = project.role === "owner"

  return (
    <div className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-surface-border hover:bg-elevated">
      <FolderOpen className="h-4 w-4 shrink-0 text-copy-muted" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-copy-primary">{project.name}</p>
        <p className="truncate text-xs text-copy-muted">{project.slug}</p>
      </div>
      {isOwner ? (
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-copy-muted hover:text-copy-primary"
            onClick={() => onRename(project)}
            aria-label={`Rename ${project.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-copy-muted hover:text-state-error"
            onClick={() => onDelete(project)}
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <span className="shrink-0 text-[0.65rem] uppercase tracking-[0.12em] text-copy-faint">
          Shared
        </span>
      )}
    </div>
  )
}

interface SidebarEmptyStateProps {
  icon: ReactNode
  title: string
  description: string
}

function SidebarEmptyState({ icon, title, description }: SidebarEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      {icon}
      <p className="text-sm font-medium text-copy-primary">{title}</p>
      <p className="max-w-[14rem] text-xs text-copy-muted">{description}</p>
    </div>
  )
}
