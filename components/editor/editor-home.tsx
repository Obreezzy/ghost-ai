"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EditorHomeProps {
  onCreateProject: () => void
}

export function EditorHome({ onCreateProject }: EditorHomeProps) {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 py-16">
      <div className="flex max-w-xl flex-col items-center text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-copy-primary sm:text-4xl">
          Create a project or open an existing one
        </h1>
        <p className="mt-4 text-base leading-7 text-copy-muted">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <Button
          className="mt-8 rounded-xl bg-brand px-5 text-base text-background hover:bg-brand/90"
          onClick={onCreateProject}
        >
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </div>
    </div>
  )
}
