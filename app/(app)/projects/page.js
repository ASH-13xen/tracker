"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Plus, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { apiPost, apiPatch } from "@/lib/utils/api-client";

const FILTERS = [
  { value: "active", label: "Active" },
  { value: "all", label: "All" },
  { value: "on-hold", label: "On hold" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export default function ProjectsPage() {
  const { data: projects, mutate } = useSWR("/api/projects");
  const [filter, setFilter] = useState("active");
  const [formOpen, setFormOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!projects) return [];
    if (filter === "all") return projects;
    return projects.filter((p) => p.archiveStatus === filter);
  }, [projects, filter]);

  async function handleCreate(payload) {
    try {
      await apiPost("/api/projects", payload);
      await mutate();
      toast.success("Project added");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleStatusChange(id, kanbanStatus) {
    const previous = projects;
    mutate(
      projects.map((p) => (p._id === id ? { ...p, kanbanStatus } : p)),
      { revalidate: false }
    );
    try {
      await apiPatch(`/api/projects/${id}`, { kanbanStatus });
    } catch (err) {
      toast.error(err.message);
      mutate(previous, { revalidate: false });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <FolderKanban className="h-5 w-5 text-project" /> Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Weekend development time, tracked project by project. Drag cards between columns.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Add project
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {!projects ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No projects here yet.
        </div>
      ) : (
        <KanbanBoard projects={filtered} onStatusChange={handleStatusChange} />
      )}

      <ProjectFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleCreate} />
    </div>
  );
}
