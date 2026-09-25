import { EditorPageClient } from "@/components/editor/editor-page-client"
import { getEditorProjectLists } from "@/lib/project-data"

export default async function EditorPage() {
  const { ownedProjects, sharedProjects } = await getEditorProjectLists()

  return (
    <EditorPageClient
      initialOwnedProjects={ownedProjects}
      initialSharedProjects={sharedProjects}
    />
  )
}
