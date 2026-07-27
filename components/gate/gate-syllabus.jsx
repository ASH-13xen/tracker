"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Plus, GraduationCap } from "lucide-react";
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
import { MoreVertical } from "lucide-react";
import { NameDialog } from "@/components/shared/name-dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { SubtopicRow } from "@/components/shared/subtopic-row";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPost, apiPatch, apiDelete } from "@/lib/utils/api-client";

function buildTree({ subjects, topics, subtopics }) {
  return [...subjects]
    .sort((a, b) => a.order - b.order)
    .map((subject) => ({
      ...subject,
      topics: topics
        .filter((t) => t.subjectId === subject._id)
        .sort((a, b) => a.order - b.order)
        .map((topic) => ({
          ...topic,
          subtopics: subtopics
            .filter((st) => st.topicId === topic._id)
            .sort((a, b) => a.order - b.order),
        })),
    }));
}

export function GateSyllabus({ date }) {
  const { data, mutate } = useSWR("/api/gate");
  const [nameDialog, setNameDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const tree = useMemo(() => (data ? buildTree(data) : []), [data]);

  async function handleNameSubmit(value) {
    const { mode, targetId, order = 0 } = nameDialog;
    try {
      if (mode === "add-subject") await apiPost("/api/gate/subjects", { name: value, order });
      if (mode === "rename-subject") await apiPatch(`/api/gate/subjects/${targetId}`, { name: value });
      if (mode === "add-topic") await apiPost("/api/gate/topics", { subjectId: targetId, name: value, order });
      if (mode === "rename-topic") await apiPatch(`/api/gate/topics/${targetId}`, { name: value });
      if (mode === "add-subtopic") await apiPost("/api/gate/subtopics", { topicId: targetId, name: value, order });
      if (mode === "rename-subtopic") await apiPatch(`/api/gate/subtopics/${targetId}`, { name: value });
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteConfirm() {
    const { kind, id } = deleteDialog;
    try {
      if (kind === "subject") await apiDelete(`/api/gate/subjects/${id}`);
      if (kind === "topic") await apiDelete(`/api/gate/topics/${id}`);
      if (kind === "subtopic") await apiDelete(`/api/gate/subtopics/${id}`);
      await mutate();
      setDeleteDialog(null);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function markField(subtopicId, field, done) {
    try {
      await apiPost(`/api/gate/subtopics/${subtopicId}/mark`, { field, done, date });
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function markRevised(subtopicId) {
    try {
      await apiPost("/api/revisions", { category: "gate", id: subtopicId, date });
      await mutate();
      toast.success("Marked as revised — due again in 7 days");
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (!data) return <Skeleton className="h-80 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <GraduationCap className="h-4 w-4 text-gate" /> Syllabus
        </h2>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            setNameDialog({
              mode: "add-subject",
              title: "Add subject",
              label: "Subject name",
              order: tree.length,
            })
          }
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add subject
        </Button>
      </div>

      {tree.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          No subjects yet — add your first GATE subject to start building the syllabus tree.
        </div>
      ) : (
        <Accordion multiple className="space-y-2">
          {tree.map((subject) => (
            <AccordionItem
              key={subject._id}
              value={subject._id}
              className="rounded-xl border border-border/60 px-3"
            >
              <div className="flex items-center">
                <AccordionTrigger className="flex-1 py-3 text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    {subject.name}
                    <span className="text-xs font-normal text-muted-foreground">
                      {subject.topics.length} topics
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
                          mode: "rename-subject",
                          targetId: subject._id,
                          title: "Rename subject",
                          label: "Subject name",
                          initialValue: subject.name,
                        })
                      }
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        setDeleteDialog({ kind: "subject", id: subject._id, name: subject.name })
                      }
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <AccordionContent className="space-y-3 pb-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() =>
                    setNameDialog({
                      mode: "add-topic",
                      targetId: subject._id,
                      title: "Add topic",
                      label: "Topic name",
                      order: subject.topics.length,
                    })
                  }
                >
                  <Plus className="mr-1 h-3 w-3" /> Add topic
                </Button>

                {subject.topics.map((topic) => (
                  <div key={topic._id} className="rounded-lg bg-muted/40 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium">{topic.name}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button size="icon" variant="ghost" className="h-6 w-6" />}
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
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

                    <div className="space-y-2">
                      {topic.subtopics.map((subtopic) => (
                        <SubtopicRow
                          key={subtopic._id}
                          subtopic={subtopic}
                          showRevision
                          onMarkTheory={(done) => markField(subtopic._id, "theory", done)}
                          onMarkPractice={(done) => markField(subtopic._id, "practice", done)}
                          onMarkRevised={() => markRevised(subtopic._id)}
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
                            setDeleteDialog({
                              kind: "subtopic",
                              id: subtopic._id,
                              name: subtopic.name,
                            })
                          }
                        />
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2 text-xs"
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
                  </div>
                ))}
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
