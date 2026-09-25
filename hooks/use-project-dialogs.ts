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

const initialProjects: Project[] = [
  {
    id: "project-commerce",
    name: "Commerce Platform",
    slug: "commerce-platform",
    role: "owner",
  },
  {
    id: "project-analytics",
    name: "Analytics Dashboard",
    slug: "analytics-dashboard",
    role: "owner",
  },
  {
    id: "project-collaboration",
    name: "Team Collaboration",
    slug: "team-collaboration",
    role: "collaborator",
  },
]

const mockActionDelay = 250

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function createProjectId(): string {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useProjectDialogs(): ProjectDialogsState {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [activeDialog, setActiveDialog] = useState<ProjectDialog>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formName, setFormName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const pendingActionRef = useRef<number | null>(null)

  const slugPreview = useMemo(() => slugify(formName), [formName])

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

  const startMockAction = useCallback(
    (action: () => void) => {
      if (isLoading || pendingActionRef.current !== null) {
        return
      }

      setIsLoading(true)
      pendingActionRef.current = window.setTimeout(() => {
        pendingActionRef.current = null
        action()
        setIsLoading(false)
        closeDialog()
      }, mockActionDelay)
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

  const submitCreate = useCallback(() => {
    const name = formName.trim()

    if (!name || isLoading) {
      return
    }

    startMockAction(() => {
      setProjects((currentProjects) => [
        ...currentProjects,
        {
          id: createProjectId(),
          name,
          slug: slugPreview,
          role: "owner",
        },
      ])
    })
  }, [formName, isLoading, slugPreview, startMockAction])

  const submitRename = useCallback(() => {
    const name = formName.trim()

    if (!name || !selectedProject || isLoading) {
      return
    }

    const projectId = selectedProject.id
    startMockAction(() => {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === projectId
            ? { ...project, name, slug: slugPreview }
            : project
        )
      )
    })
  }, [formName, isLoading, selectedProject, slugPreview, startMockAction])

  const submitDelete = useCallback(() => {
    if (!selectedProject || isLoading) {
      return
    }

    const projectId = selectedProject.id
    startMockAction(() => {
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId)
      )
    })
  }, [isLoading, selectedProject, startMockAction])

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
