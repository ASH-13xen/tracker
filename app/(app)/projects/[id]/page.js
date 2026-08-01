"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { TaskList } from "@/components/projects/task-list";
import { TimeLog } from "@/components/projects/time-log";
import { MaterialList } from "@/components/study-material/material-list";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { apiPatch, apiDelete } from "@/lib/utils/api-client";

const ARCHIVE_STYLE = {
  active: "bg-project/20 text-project",
  "on-hold": "bg-muted text-muted-foreground",
  completed: "bg-skill/20 text-skill",
  archived: "bg-muted text-muted-foreground",
};

const LINK_LABELS = { repo: "Repository", demo: "Demo", deploy: "Deployment", design: "Design" };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, mutate } = useSWR(`/api/projects/${id}`);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleEditSubmit(payload) {
    try {
      await apiPatch(`/api/projects/${id}`, payload);
      await mutate();
      toast.success("Project updated");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    try {
      await apiDelete(`/api/projects/${id}`);
      toast.success("Project deleted");
      router.push("/projects");
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (!data) return <Skeleton className="h-96 w-full" />;

  const links = Object.entries(data.links || {}).filter(([, url]) => url);

  return (
    <div className="space-y-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to projects
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{data.name}</h1>
            <Badge className={`text-[10px] capitalize ${ARCHIVE_STYLE[data.archiveStatus]}`}>
              {data.archiveStatus}
            </Badge>
          </div>
          {data.description && (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{data.description}</p>
          )}
          {data.techStack?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-[10px]">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
          {links.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {links.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-project hover:underline"
                >
                  {LINK_LABELS[key]} <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {data.taskDoneCount}/{data.taskCount} tasks done
          </span>
          <span>{data.progress}%</span>
        </div>
        <Progress value={data.progress} className="h-1.5" />
      </div>

      <TaskList projectId={id} tasks={data.tasks} mutate={mutate} />
      <TimeLog projectId={id} timeLogs={data.timeLogs} mutate={mutate} />
      <MaterialList kind="project" id={id} />

      <ProjectFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={data}
        onSubmit={handleEditSubmit}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${data.name}"?`}
        description="This also deletes all its tasks and time logs. This can't be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
