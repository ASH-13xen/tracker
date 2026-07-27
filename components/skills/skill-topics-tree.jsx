"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, MoreVertical } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NameDialog } from "@/components/shared/name-dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { SubtopicRow } from "@/components/shared/subtopic-row";
import { apiPost, apiPatch, apiDelete } from "@/lib/utils/api-client";

export function SkillTopicsTree({ skillId, data, mutate, date }) {
  const [nameDialog, setNameDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const tree = useMemo(() => {
    if (!data) return [];
    return [...data.topics]
      .sort((a, b) => a.order - b.order)
      .map((topic) => ({
        ...topic,
        subtopics: data.subtopics
          .filter((st) => st.topicId === topic._id)
          .sort((a, b) => a.order - b.order),
      }));
  }, [data]);

  async function handleNameSubmit(value) {
    const { mode, targetId, order = 0 } = nameDialog;
    try {
      if (mode === "add-topic")
        await apiPost("/api/skills/topics", { skillId, name: value, order });
      if (mode === "rename-topic")
        await apiPatch(`/api/skills/topics/${targetId}`, { name: value });
      if (mode === "add-subtopic")
        await apiPost("/api/skills/subtopics", { topicId: targetId, name: value, order });
      if (mode === "rename-subtopic")
        await apiPatch(`/api/skills/subtopics/${targetId}`, { name: value });
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteConfirm() {
    const { kind, id } = deleteDialog;
    try {
      if (kind === "topic") await apiDelete(`/api/skills/topics/${id}`);
      if (kind === "subtopic") await apiDelete(`/api/skills/subtopics/${id}`);
      await mutate();
      setDeleteDialog(null);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function markField(subtopicId, field, done) {
    try {
      await apiPost(`/api/skills/subtopics/${subtopicId}/mark`, { field, done, date });
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Topics</h2>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            setNameDialog({
              mode: "add-topic",
              title: "Add topic",
              label: "Topic name",
              order: tree.length,
            })
          }
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add topic
        </Button>
      </div>

      {tree.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          No topics yet — break this skill down into topics and subtopics.
        </div>
      ) : (
        <Accordion multiple className="space-y-2">
          {tree.map((topic) => (
            <AccordionItem
              key={topic._id}
              value={topic._id}
              className="rounded-xl border border-border/60 px-3"
            >
              <div className="flex items-center">
                <AccordionTrigger className="flex-1 py-3 text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    {topic.name}
                    <span className="text-xs font-normal text-muted-foreground">
                      {topic.subtopics.length} subtopics
                    </span>
                  </span>
                </AccordionTrigger>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" />}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        setNameDialog({
                          mode: "rename-topic",
                          targetId: topic._id,
                          title: "Rename topic",
                          label: "Topic name",
                          initialValue: topic.name,
                        })
                      }
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        setDeleteDialog({ kind: "topic", id: topic._id, name: topic.name })
                      }
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <AccordionContent className="space-y-2 pb-4">
                {topic.subtopics.map((subtopic) => (
                  <SubtopicRow
                    key={subtopic._id}
                    subtopic={subtopic}
                    onMarkTheory={(done) => markField(subtopic._id, "theory", done)}
                    onMarkPractice={(done) => markField(subtopic._id, "practice", done)}
                    onRename={() =>
                      setNameDialog({
                        mode: "rename-subtopic",
                        targetId: subtopic._id,
                        title: "Rename subtopic",
                        label: "Subtopic name",
                        initialValue: subtopic.name,
                      })
                    }
                    onDelete={() =>
                      setDeleteDialog({ kind: "subtopic", id: subtopic._id, name: subtopic.name })
                    }
                  />
                ))}

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() =>
                    setNameDialog({
                      mode: "add-subtopic",
                      targetId: topic._id,
                      title: "Add subtopic",
                      label: "Subtopic name",
                      order: topic.subtopics.length,
                    })
                  }
                >
                  <Plus className="mr-1 h-3 w-3" /> Add subtopic
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <NameDialog
        open={!!nameDialog}
        onOpenChange={(open) => !open && setNameDialog(null)}
        title={nameDialog?.title}
        label={nameDialog?.label}
        initialValue={nameDialog?.initialValue}
        onSubmit={handleNameSubmit}
      />
      <ConfirmDeleteDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        title={`Delete "${deleteDialog?.name}"?`}
        description="This also deletes everything nested inside it. This can't be undone."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
