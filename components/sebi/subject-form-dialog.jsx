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

function toForm(subject) {
  return {
    name: subject?.name || "",
    syllabus: subject?.syllabus || "",
    weightage: subject?.weightage || "",
  };
}

export function SubjectFormDialog({ open, onOpenChange, subject, onSubmit }) {
  const [form, setForm] = useState(() => toForm(subject));
  const [prevOpen, setPrevOpen] = useState(open);
  const [saving, setSaving] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setForm(toForm(subject));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        syllabus: form.syllabus.trim(),
        weightage: form.weightage.trim(),
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{subject ? "Edit subject" : "Add subject"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Subject name</Label>
              <Input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label className="mb-2 block">Syllabus</Label>
              <Textarea
                value={form.syllabus}
                onChange={(e) => setForm((f) => ({ ...f, syllabus: e.target.value }))}
                placeholder="What this subject covers…"
                className="min-h-24 resize-none"
              />
            </div>
            <div>
              <Label className="mb-2 block">Weightage (optional)</Label>
              <Input
                value={form.weightage}
                onChange={(e) => setForm((f) => ({ ...f, weightage: e.target.value }))}
                placeholder="e.g. 10%"
                className="w-32"
              />
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
