"use client"

import type { FormEvent } from "react"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Project } from "@/types/project"
import type { ProjectDialog } from "@/hooks/use-project-dialogs"

interface ProjectDialogsProps {
  activeDialog: ProjectDialog
  selectedProject: Project | null
  formName: string
  slugPreview: string
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  onFormNameChange: (name: string) => void
  onSubmitCreate: () => void
  onSubmitRename: () => void
  onSubmitDelete: () => void
}

export function ProjectDialogs({
  activeDialog,
  selectedProject,
  formName,
  slugPreview,
  isLoading,
  onOpenChange,
  onClose,
  onFormNameChange,
  onSubmitCreate,
  onSubmitRename,
  onSubmitDelete,
}: ProjectDialogsProps) {
  return (
    <>
      <Dialog open={activeDialog === "create"} onOpenChange={onOpenChange}>
        <DialogContent className="border-surface-border bg-elevated sm:max-w-md sm:rounded-3xl">
          <form
            className="flex flex-col gap-5"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              onSubmitCreate()
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-copy-primary">Create project</DialogTitle>
              <DialogDescription className="text-copy-muted">
                Give your architecture workspace a name.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-copy-secondary"
                htmlFor="create-project-name"
              >
                Project name
              </label>
              <Input
                id="create-project-name"
                name="projectName"
                value={formName}
                onChange={(event) => onFormNameChange(event.target.value)}
                placeholder="e.g. Payments platform"
                className="rounded-xl border-surface-border bg-subtle text-copy-primary placeholder:text-copy-muted focus-visible:ring-brand focus-visible:ring-offset-base dark:border-subtle-border dark:bg-elevated dark:text-copy-primary dark:placeholder:text-copy-muted dark:focus-visible:ring-brand dark:focus-visible:ring-offset-base"
                disabled={isLoading}
                required
                autoFocus
              />
            </div>

            <SlugPreview slug={slugPreview} />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-brand text-background hover:bg-brand/90"
                disabled={isLoading || !formName.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {isLoading ? "Creating..." : "Create project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "rename"} onOpenChange={onOpenChange}>
        <DialogContent className="border-surface-border bg-elevated sm:max-w-md sm:rounded-3xl">
          <form
            className="flex flex-col gap-5"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              onSubmitRename()
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-copy-primary">Rename project</DialogTitle>
              <DialogDescription className="text-copy-muted">
                Current project name: {selectedProject?.name ?? "Unknown project"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-copy-secondary"
                htmlFor="rename-project-name"
              >
                Project name
              </label>
              <Input
                id="rename-project-name"
                name="projectName"
                value={formName}
                onChange={(event) => onFormNameChange(event.target.value)}
                className="rounded-xl border-surface-border bg-subtle text-copy-primary placeholder:text-copy-muted focus-visible:ring-brand focus-visible:ring-offset-base dark:border-subtle-border dark:bg-elevated dark:text-copy-primary dark:placeholder:text-copy-muted dark:focus-visible:ring-brand dark:focus-visible:ring-offset-base"
                disabled={isLoading}
                required
                autoFocus
              />
            </div>

            <SlugPreview slug={slugPreview} />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-brand text-background hover:bg-brand/90"
                disabled={isLoading || !formName.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "delete"} onOpenChange={onOpenChange}>
        <DialogContent className="border-surface-border bg-elevated sm:max-w-md sm:rounded-3xl">
          <div className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle className="text-copy-primary">Delete project</DialogTitle>
              <DialogDescription className="text-copy-muted">
                Are you sure you want to delete {selectedProject?.name ?? "this project"}? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="rounded-xl"
                onClick={onSubmitDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isLoading ? "Deleting..." : "Delete project"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface SlugPreviewProps {
  slug: string
}

function SlugPreview({ slug }: SlugPreviewProps) {
  return (
    <div className="space-y-2 rounded-xl border border-surface-border bg-subtle p-3">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-copy-muted">
        Slug preview
      </p>
      <code className="block text-sm text-copy-primary" aria-live="polite">
        {slug || "—"}
      </code>
    </div>
  )
}
