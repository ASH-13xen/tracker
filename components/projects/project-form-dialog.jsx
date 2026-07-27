"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ARCHIVE_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "on-hold", label: "On hold" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

function emptyForm(project) {
  return {
    name: project?.name || "",
    description: project?.description || "",
    techStack: (project?.techStack || []).join(", "),
    archiveStatus: project?.archiveStatus || "active",
    repo: project?.links?.repo || "",
    demo: project?.links?.demo || "",
    deploy: project?.links?.deploy || "",
    design: project?.links?.design || "",
  };
}

export function ProjectFormDialog({ open, onOpenChange, project, onSubmit }) {
  const [form, setForm] = useState(() => emptyForm(project));
  const [prevOpen, setPrevOpen] = useState(open);
  const [saving, setSaving] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setForm(emptyForm(project));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description,
        techStack: form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        archiveStatus: form.archiveStatus,
        links: {
          repo: form.repo,
          demo: form.demo,
          deploy: form.deploy,
          design: form.design,
        },
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{project ? "Edit project" : "Add project"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Name</Label>
              <Input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label className="mb-2 block">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="min-h-20 resize-none"
              />
            </div>
            <div>
              <Label className="mb-2 block">Tech stack</Label>
              <Input
                value={form.techStack}
                onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))}
                placeholder="Next.js, MongoDB, Tailwind (comma-separated)"
              />
            </div>
            <div>
              <Label className="mb-2 block">Status</Label>
              <Select
                value={form.archiveStatus}
                onValueChange={(v) => setForm((f) => ({ ...f, archiveStatus: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ARCHIVE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-2 block">Repo URL</Label>
                <Input
                  value={form.repo}
                  onChange={(e) => setForm((f) => ({ ...f, repo: e.target.value }))}
                  placeholder="https://github.com/…"
                />
              </div>
              <div>
                <Label className="mb-2 block">Demo URL</Label>
                <Input
                  value={form.demo}
                  onChange={(e) => setForm((f) => ({ ...f, demo: e.target.value }))}
                />
              </div>
              <div>
                <Label className="mb-2 block">Deploy URL</Label>
                <Input
                  value={form.deploy}
                  onChange={(e) => setForm((f) => ({ ...f, deploy: e.target.value }))}
                />
              </div>
              <div>
                <Label className="mb-2 block">Design URL</Label>
                <Input
                  value={form.design}
                  onChange={(e) => setForm((f) => ({ ...f, design: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.name.trim()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
