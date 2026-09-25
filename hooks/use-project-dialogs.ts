"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { Project } from "@/types/project"

export type ProjectDialog = "create" | "rename" | "delete" | null

export interface ProjectDialogsState {
  projects: Project[]
  activeDialog: ProjectDialog
  selectedProject: Project | null
  formName: string
  slugPreview: string
  isLoading: boolean
  openCreateDialog: () => void
  openRenameDialog: (project: Project) => void
  openDeleteDialog: (project: Project) => void
  closeDialog: () => void
  onDialogOpenChange: (open: boolean) => void
  setFormName: (name: string) => void
  submitCreate: () => void
  submitRename: () => void
  submitDelete: () => void
}

interface UseProjectDialogsOptions {
  initialProjects?: Project[]
  activeProjectId?: string | null
  onProjectCreated?: (project: Project) => void
  onProjectRenamed?: (project: Project) => void
  onProjectDeleted?: (projectId: string, deletedActiveProject: boolean) => void
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function createRoomSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

function buildRoomId(name: string): string {
  const base = slugify(name) || "untitled-project"
  return `${base}-${createRoomSuffix()}`
}

function normalizeProject(project: { id: string; name: string; ownerId?: string }): Project {
  const role = project.ownerId ? "owner" : "collaborator"
  return {
    id: project.id,
    name: project.name,
    slug: `${slugify(project.name) || "untitled-project"}-${project.id.slice(-6)}`,
    role,
  }
}

export function useProjectDialogs({
  initialProjects = [],
  activeProjectId = null,
  onProjectCreated,
  onProjectRenamed,
  onProjectDeleted,
}: UseProjectDialogsOptions = {}): ProjectDialogsState {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [activeDialog, setActiveDialog] = useState<ProjectDialog>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formName, setFormName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const pendingActionRef = useRef<number | null>(null)

  const slugPreview = useMemo(() => buildRoomId(formName), [formName])

  useEffect(() => {
    setProjects((currentProjects) => {
      const isSameProjectSet =
        currentProjects.length === initialProjects.length &&
        currentProjects.every((project, index) => {
          const incomingProject = initialProjects[index]
          return (
            incomingProject &&
            project.id === incomingProject.id &&
            project.name === incomingProject.name &&
            project.slug === incomingProject.slug &&
            project.role === incomingProject.role
          )
        })

      return isSameProjectSet ? currentProjects : initialProjects
    })
  }, [initialProjects])

  useEffect(() => {
    return () => {
      if (pendingActionRef.current !== null) {
        window.clearTimeout(pendingActionRef.current)
      }
    }
  }, [])

  const closeDialog = useCallback(() => {
    setActiveDialog(null)
    setSelectedProject(null)
    setFormName("")
  }, [])

  const onDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !isLoading) {
        closeDialog()
      }
    },
    [closeDialog, isLoading]
  )

  const openCreateDialog = useCallback(() => {
    if (isLoading) {
      return
    }

    setActiveDialog("create")
    setSelectedProject(null)
    setFormName("")
  }, [isLoading])

  const openRenameDialog = useCallback(
    (project: Project) => {
      if (isLoading) {
        return
      }

      setActiveDialog("rename")
      setSelectedProject(project)
      setFormName(project.name)
    },
    [isLoading]
  )

  const openDeleteDialog = useCallback(
    (project: Project) => {
      if (isLoading) {
        return
      }

      setActiveDialog("delete")
      setSelectedProject(project)
      setFormName("")
    },
    [isLoading]
  )

  const submitCreate = useCallback(async () => {
    const name = formName.trim()

    if (!name || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const createdProject = (await response.json()) as {
        id: string
        name: string
        ownerId: string
      }

      const nextProject: Project = {
        id: createdProject.id,
        name: createdProject.name,
        slug: `${slugify(createdProject.name) || "untitled-project"}-${createdProject.id.slice(-6)}`,
        role: "owner",
      }

      setProjects((currentProjects) => [nextProject, ...currentProjects])
      onProjectCreated?.(nextProject)
      closeDialog()
    } catch {
      setIsLoading(false)
      return
    }

    setIsLoading(false)
  }, [closeDialog, formName, isLoading, onProjectCreated])

  const submitRename = useCallback(async () => {
    const name = formName.trim()

    if (!name || !selectedProject || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to rename project")
      }

      const updatedProject = (await response.json()) as {
        id: string
        name: string
        ownerId: string
      }

      const nextProject: Project = {
        id: updatedProject.id,
        name: updatedProject.name,
        slug: `${slugify(updatedProject.name) || "untitled-project"}-${updatedProject.id.slice(-6)}`,
        role: "owner",
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) => (project.id === selectedProject.id ? nextProject : project))
      )
      onProjectRenamed?.(nextProject)
      closeDialog()
    } catch {
      setIsLoading(false)
      return
    }

    setIsLoading(false)
  }, [closeDialog, formName, isLoading, onProjectRenamed, selectedProject])

  const submitDelete = useCallback(async () => {
    if (!selectedProject || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== selectedProject.id)
      )
      onProjectDeleted?.(selectedProject.id, selectedProject.id === activeProjectId)
      closeDialog()
    } catch {
      setIsLoading(false)
      return
    }

    setIsLoading(false)
  }, [activeProjectId, closeDialog, isLoading, onProjectDeleted, selectedProject])

  return {
    projects,
    activeDialog,
    selectedProject,
    formName,
    slugPreview,
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    onDialogOpenChange,
    setFormName,
    submitCreate,
    submitRename,
    submitDelete,
  }
}
