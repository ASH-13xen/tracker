"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const ARCHIVE_STYLE = {
  active: "bg-project/20 text-project",
  "on-hold": "bg-muted text-muted-foreground",
  completed: "bg-skill/20 text-skill",
  archived: "bg-muted text-muted-foreground",
};

export function ProjectCard({ project }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab touch-none rounded-xl border border-border/60 bg-card p-3 active:cursor-grabbing"
    >
      <Link
        href={`/projects/${project._id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-medium hover:text-project"
      >
        {project.name}
      </Link>

      {project.archiveStatus !== "active" && (
        <Badge className={cn("ml-2 text-[9px] capitalize", ARCHIVE_STYLE[project.archiveStatus])}>
          {project.archiveStatus}
        </Badge>
      )}

      {project.techStack?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {project.techStack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-[9px]">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 3 && (
            <Badge variant="secondary" className="text-[9px]">
              +{project.techStack.length - 3}
            </Badge>
          )}
        </div>
      )}

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>
            {project.taskDoneCount}/{project.taskCount} tasks
          </span>
          <span>{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1" />
      </div>
    </div>
  );
}
