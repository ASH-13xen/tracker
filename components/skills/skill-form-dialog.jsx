"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
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

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "mastered", label: "Mastered" },
];

function emptyForm() {
  return {
    name: "",
    status: "active",
    resourceLinks: [],
    targetGoalDescription: "",
    targetGoalDeadline: "",
  };
}

function toForm(skill) {
  if (!skill) return emptyForm();
  return {
    name: skill.name || "",
    status: skill.status || "active",
    resourceLinks: skill.resourceLinks || [],
    targetGoalDescription: skill.targetGoal?.description || "",
    targetGoalDeadline: skill.targetGoal?.deadline
      ? skill.targetGoal.deadline.slice(0, 10)
      : "",
  };
}

export function SkillFormDialog({ open, onOpenChange, skill, onSubmit }) {
  const [form, setForm] = useState(() => toForm(skill));
  const [prevOpen, setPrevOpen] = useState(open);
  const [saving, setSaving] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setForm(toForm(skill));
  }

  function updateLink(index, field, value) {
    setForm((f) => {
      const links = [...f.resourceLinks];
      links[index] = { ...links[index], [field]: value };
      return { ...f, resourceLinks: links };
    });
  }

  function addLink() {
    setForm((f) => ({ ...f, resourceLinks: [...f.resourceLinks, { label: "", url: "" }] }));
  }

  function removeLink(index) {
    setForm((f) => ({ ...f, resourceLinks: f.resourceLinks.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        status: form.status,
        resourceLinks: form.resourceLinks.filter((l) => l.label.trim() && l.url.trim()),
        targetGoal: {
          description: form.targetGoalDescription,
          deadline: form.targetGoalDeadline ? new Date(form.targetGoalDeadline) : null,
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
            <DialogTitle>{skill ? "Edit skill" : "Add skill"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Skill name</Label>
              <Input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. System Design"
              />
            </div>

            <div>
              <Label className="mb-2 block">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Target goal</Label>
              <Textarea
                value={form.targetGoalDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, targetGoalDescription: e.target.value }))
                }
                placeholder="e.g. Comfortable designing a scalable system in interviews"
                className="mb-2 min-h-16 resize-none"
              />
              <Input
                type="date"
                value={form.targetGoalDeadline}
                onChange={(e) => setForm((f) => ({ ...f, targetGoalDeadline: e.target.value }))}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Resource links</Label>
                <Button type="button" size="sm" variant="ghost" onClick={addLink}>
                  <Plus className="mr-1 h-3 w-3" /> Add link
                </Button>
              </div>
              <div className="space-y-2">
                {form.resourceLinks.map((link, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) => updateLink(i, "label", e.target.value)}
                      className="w-1/3"
                    />
                    <Input
                      placeholder="https://…"
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeLink(i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
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
