"use client";

import { useState } from "react";
import useSWR from "swr";
import { BookOpen, BrainCircuit, FolderKanban } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MaterialList } from "@/components/study-material/material-list";

export default function StudyMaterialPage() {
  const { data: skills } = useSWR("/api/skills");
  const { data: projects } = useSWR("/api/projects");
  const [selected, setSelected] = useState(null);

  const loading = !skills || !projects;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <BookOpen className="h-5 w-5" /> Study Material
        </h1>
        <p className="text-sm text-muted-foreground">
          Documents, notes, and links attached to a skill or project, saved for later.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <div className="space-y-4">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <BrainCircuit className="h-3.5 w-3.5 text-skill" /> Skills
            </p>
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : skills.length === 0 ? (
              <p className="text-xs text-muted-foreground">No skills yet.</p>
            ) : (
              <ul className="space-y-1">
                {skills.map((skill) => (
                  <li key={skill._id}>
                    <button
                      onClick={() => setSelected({ kind: "skill", id: skill._id, name: skill.name })}
                      className={cn(
                        "w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-accent/50",
                        selected?.kind === "skill" &&
                          selected.id === skill._id &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      {skill.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <FolderKanban className="h-3.5 w-3.5 text-project" /> Projects
            </p>
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : projects.length === 0 ? (
              <p className="text-xs text-muted-foreground">No projects yet.</p>
            ) : (
              <ul className="space-y-1">
                {projects.map((project) => (
                  <li key={project._id}>
                    <button
                      onClick={() =>
                        setSelected({ kind: "project", id: project._id, name: project.name })
                      }
                      className={cn(
                        "w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-accent/50",
                        selected?.kind === "project" &&
                          selected.id === project._id &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      {project.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          {!selected ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              Select a skill or project to view its study material.
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">{selected.name}</p>
              <MaterialList kind={selected.kind} id={selected.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
