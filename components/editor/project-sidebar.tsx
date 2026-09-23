"use client"

import { FolderOpen, Plus, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

/** Renders project navigation and empty states in a collapsible sidebar. */
export function ProjectSidebar({ isOpen, onClose, className }: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed bottom-0 left-0 top-14 z-40 flex w-80 shrink-0 flex-col border-r border-input bg-background shadow-2xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
      aria-hidden={!isOpen}
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-4">
        <h2 className="text-sm font-semibold text-foreground">Projects</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close project sidebar"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="my-projects" className="flex flex-1 flex-col px-4">
        <TabsList className="w-full">
          <TabsTrigger value="my-projects" className="flex-1">
            My Projects
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex-1">
            Shared
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-projects" className="flex flex-1 flex-col">
          <SidebarEmptyState
            icon={<FolderOpen className="h-8 w-8 text-muted-foreground" />}
            title="No projects yet"
            description="Create your first architecture project to get started."
          />
        </TabsContent>
        <TabsContent value="shared" className="flex flex-1 flex-col">
          <SidebarEmptyState
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
            title="Nothing shared yet"
            description="Projects shared with you will appear here."
          />
        </TabsContent>
      </Tabs>

      <div className="shrink-0 p-4">
        <Button className="w-full">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}

interface SidebarEmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
}

/** Displays a message and icon when a project tab has no entries. */
function SidebarEmptyState({ icon, title, description }: SidebarEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      {icon}
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-[14rem] text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
