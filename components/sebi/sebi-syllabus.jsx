"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Plus, Landmark, MoreVertical } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NameDialog } from "@/components/shared/name-dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { SubjectFormDialog } from "@/components/sebi/subject-form-dialog";
import { SubjectCard } from "@/components/sebi/subject-card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPost, apiPatch, apiDelete } from "@/lib/utils/api-client";

function buildTree(data) {
  const { phases, papers, subjects, topics } = data;
  return [...phases]
    .sort((a, b) => a.order - b.order)
    .map((phase) => ({
      ...phase,
      papers: papers
        .filter((p) => p.phaseId === phase._id)
        .sort((a, b) => a.order - b.order)
        .map((paper) => ({
          ...paper,
          subjects: subjects
            .filter((s) => s.paperId === paper._id)
            .sort((a, b) => a.order - b.order)
            .map((subject) => ({
              ...subject,
              topics: topics
                .filter((t) => t.subjectId === subject._id)
                .sort((a, b) => a.order - b.order),
            })),
        })),
    }));
}

export function SebiSyllabus({ date }) {
  const { data, mutate } = useSWR("/api/sebi");
  const [activePhase, setActivePhase] = useState(null);
  const [activePaper, setActivePaper] = useState(null);
  const [nameDialog, setNameDialog] = useState(null);
  const [subjectDialog, setSubjectDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const tree = useMemo(() => (data ? buildTree(data) : []), [data]);

  const currentPhase =
    tree.find((p) => p._id === activePhase) ?? tree[0];
  const currentPaper =
    currentPhase?.papers.find((p) => p._id === activePaper) ?? currentPhase?.papers[0];

  async function handleNameSubmit(value) {
    const { mode, targetId, order = 0 } = nameDialog;
    try {
      if (mode === "add-phase") await apiPost("/api/sebi/phases", { name: value, order });
      if (mode === "rename-phase") await apiPatch(`/api/sebi/phases/${targetId}`, { name: value });
      if (mode === "add-paper")
        await apiPost("/api/sebi/papers", { phaseId: targetId, name: value, order });
      if (mode === "rename-paper") await apiPatch(`/api/sebi/papers/${targetId}`, { name: value });
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSubjectSubmit(payload) {
    try {
      if (subjectDialog.mode === "add") {
        await apiPost("/api/sebi/subjects", {
          ...payload,
          paperId: subjectDialog.paperId,
          order: subjectDialog.order,
        });
      } else {
        await apiPatch(`/api/sebi/subjects/${subjectDialog.subject._id}`, payload);
      }
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteConfirm() {
    const { kind, id } = deleteDialog;
    try {
      if (kind === "phase") await apiDelete(`/api/sebi/phases/${id}`);
      if (kind === "paper") await apiDelete(`/api/sebi/papers/${id}`);
      if (kind === "subject") await apiDelete(`/api/sebi/subjects/${id}`);
      await mutate();
      setDeleteDialog(null);
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (!data) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Landmark className="h-4 w-4 text-gate" /> Syllabus
        </h2>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            setNameDialog({ mode: "add-phase", title: "Add phase", label: "Phase name", order: tree.length })
          }
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add phase
        </Button>
      </div>

      {tree.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          No phases yet — add your first phase to start building the syllabus.
        </div>
      ) : (
        <Tabs value={currentPhase?._id} onValueChange={setActivePhase}>
          <div className="flex items-center gap-1">
            <TabsList>
              {tree.map((phase) => (
                <TabsTrigger key={phase._id} value={phase._id}>
                  {phase.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {currentPhase && (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button size="icon" variant="ghost" className="h-7 w-7" />}>
                  <MoreVertical className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() =>
                      setNameDialog({
                        mode: "rename-phase",
                        targetId: currentPhase._id,
                        title: "Rename phase",
                        label: "Phase name",
                        initialValue: currentPhase.name,
                      })
                    }
                  >
                    Rename phase
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      setDeleteDialog({ kind: "phase", id: currentPhase._id, name: currentPhase.name })
                    }
                  >
                    Delete phase
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {tree.map((phase) => (
            <TabsContent key={phase._id} value={phase._id} className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Papers
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() =>
                    setNameDialog({
                      mode: "add-paper",
                      targetId: phase._id,
                      title: "Add paper",
                      label: "Paper name",
                      order: phase.papers.length,
                    })
                  }
                >
                  <Plus className="mr-1 h-3 w-3" /> Add paper
                </Button>
              </div>

              {phase.papers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                  No papers yet.
                </div>
              ) : (
                <Tabs
                  value={phase._id === currentPhase._id ? currentPaper?._id : phase.papers[0]?._id}
                  onValueChange={setActivePaper}
                >
                  <div className="flex items-center gap-1">
                    <TabsList>
                      {phase.papers.map((paper) => (
                        <TabsTrigger key={paper._id} value={paper._id}>
                          {paper.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {currentPaper && phase._id === currentPhase._id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button size="icon" variant="ghost" className="h-7 w-7" />}
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onClick={() =>
                              setNameDialog({
                                mode: "rename-paper",
                                targetId: currentPaper._id,
                                title: "Rename paper",
                                label: "Paper name",
                                initialValue: currentPaper.name,
                              })
                            }
                          >
                            Rename paper
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              setDeleteDialog({
                                kind: "paper",
                                id: currentPaper._id,
                                name: currentPaper.name,
                              })
                            }
                          >
                            Delete paper
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {phase.papers.map((paper) => (
                    <TabsContent key={paper._id} value={paper._id} className="space-y-3 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Subjects
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                          onClick={() =>
                            setSubjectDialog({
                              mode: "add",
                              paperId: paper._id,
                              order: paper.subjects.length,
                            })
                          }
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add subject
                        </Button>
                      </div>

                      {paper.subjects.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                          No subjects yet.
                        </div>
                      ) : (
                        <div className="grid gap-3 lg:grid-cols-2">
                          {paper.subjects.map((subject) => (
                            <SubjectCard
                              key={subject._id}
                              subject={subject}
                              topics={subject.topics}
                              mutate={mutate}
                              date={date}
                              onEditSubject={(s) => setSubjectDialog({ mode: "edit", subject: s })}
                              onDeleteSubject={(s) =>
                                setDeleteDialog({ kind: "subject", id: s._id, name: s.name })
                              }
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      <NameDialog
        open={!!nameDialog}
        onOpenChange={(open) => !open && setNameDialog(null)}
        title={nameDialog?.title}
        label={nameDialog?.label}
        initialValue={nameDialog?.initialValue}
        onSubmit={handleNameSubmit}
      />
      <SubjectFormDialog
        open={!!subjectDialog}
        onOpenChange={(open) => !open && setSubjectDialog(null)}
        subject={subjectDialog?.mode === "edit" ? subjectDialog.subject : null}
        onSubmit={handleSubjectSubmit}
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
