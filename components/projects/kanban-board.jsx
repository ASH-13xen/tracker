"use client";

import { DndContext, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { ProjectCard } from "@/components/projects/project-card";
import { cn } from "@/lib/utils";

const COLUMNS = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

function Column({ id, label, projects }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[16rem] flex-1 flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 transition-colors",
        isOver && "border-project/50 bg-project/5"
      )}
    >
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <span className="text-xs text-muted-foreground">{projects.length}</span>
      </div>
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}

export function KanbanBoard({ projects, onStatusChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const project = projects.find((p) => p._id === active.id);
    if (project && project.kanbanStatus !== over.id) {
      onStatusChange(active.id, over.id);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            projects={projects.filter((p) => p.kanbanStatus === col.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}
