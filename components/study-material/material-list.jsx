"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { FileText, Link2, StickyNote, Download, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { MaterialUploadDialog } from "@/components/study-material/material-upload-dialog";
import { apiDelete } from "@/lib/utils/api-client";
import { format } from "date-fns";

const TYPE_ICON = { file: FileText, text: StickyNote, link: Link2 };

export function MaterialList({ kind, id }) {
  const { data: materials, mutate } = useSWR(id ? `/api/study-material?kind=${kind}&id=${id}` : null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function handleDeleteConfirm() {
    try {
      await apiDelete(`/api/study-material/${deleting._id}`);
      await mutate();
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (!id) return null;

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Study material</p>
          <Button size="sm" variant="secondary" onClick={() => setUploadOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add material
          </Button>
        </div>

        {!materials ? (
          <Skeleton className="h-24 w-full" />
        ) : materials.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No study material yet — upload a document, paste notes, or save a link.
          </p>
        ) : (
          <ul className="space-y-2">
            {materials.map((material) => {
              const Icon = TYPE_ICON[material.type];
              return (
                <li
                  key={material._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{material.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {format(new Date(material.createdAt), "d MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {material.type === "file" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        render={
                          <a
                            href={`/api/study-material/${material._id}/download`}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {material.type === "link" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        render={<a href={material.content} target="_blank" rel="noopener noreferrer" />}
                      >
                        <Link2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {material.type === "text" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => setViewing(material)}
                      >
                        View
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => setDeleting(material)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      <MaterialUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        kind={kind}
        id={id}
        onDone={() => mutate()}
      />

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-sm text-foreground">{viewing?.content}</p>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete "${deleting?.title}"?`}
        description="This can't be undone."
        onConfirm={handleDeleteConfirm}
      />
    </Card>
  );
}
