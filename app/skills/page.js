"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Plus, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillCard } from "@/components/skills/skill-card";
import { SkillFormDialog } from "@/components/skills/skill-form-dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { apiPost, apiPatch, apiDelete } from "@/lib/utils/api-client";

export default function SkillsPage() {
  const { data: skills, mutate } = useSWR("/api/skills");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function handleSubmit(payload) {
    try {
      if (editing) await apiPatch(`/api/skills/${editing._id}`, payload);
      else await apiPost("/api/skills", payload);
      await mutate();
      toast.success(editing ? "Skill updated" : "Skill added");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteConfirm() {
    try {
      await apiDelete(`/api/skills/${deleting._id}`);
      await mutate();
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <BrainCircuit className="h-5 w-5 text-skill" /> Skills
          </h1>
          <p className="text-sm text-muted-foreground">
            Weekday skill hours and weekend development time, tracked per skill.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add skill
        </Button>
      </div>

      {!skills ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : skills.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No skills yet — add one to start tracking theory, practice, and progress.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard
              key={skill._id}
              skill={skill}
              onEdit={(s) => {
                setEditing(s);
                setFormOpen(true);
              }}
              onDelete={(s) => setDeleting(s)}
            />
          ))}
        </div>
      )}

      <SkillFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        skill={editing}
        onSubmit={handleSubmit}
      />
      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete "${deleting?.name}"?`}
        description="This also deletes all its topics and subtopics. This can't be undone."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
