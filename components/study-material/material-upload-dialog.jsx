"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { apiPostForm } from "@/lib/utils/api-client";

export function MaterialUploadDialog({ open, onOpenChange, kind, id, onDone }) {
  const [type, setType] = useState("file");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setType("file");
      setTitle("");
      setContent("");
      setFile(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    if (type === "file" && !file) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("title", title.trim());
      formData.set("type", type);
      formData.set("attachedToKind", kind);
      formData.set("attachedToId", id);
      if (type === "file") formData.set("file", file);
      else formData.set("content", content);

      await apiPostForm("/api/study-material", formData);
      toast.success("Material added");
      onDone();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add study material</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Tabs value={type} onValueChange={setType}>
              <TabsList className="w-full">
                <TabsTrigger value="file" className="flex-1">
                  File
                </TabsTrigger>
                <TabsTrigger value="text" className="flex-1">
                  Text
                </TabsTrigger>
                <TabsTrigger value="link" className="flex-1">
                  Link
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div>
              <Label className="mb-2 block">Title</Label>
              <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            {type === "file" && (
              <div>
                <Label className="mb-2 block">File</Label>
                <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            )}
            {type === "text" && (
              <div>
                <Label className="mb-2 block">Notes</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-32 resize-none"
                />
              </div>
            )}
            {type === "link" && (
              <div>
                <Label className="mb-2 block">URL</Label>
                <Input
                  type="url"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="https://…"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !title.trim() || (type === "file" && !file)}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
