"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreVertical, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NameDialog } from "@/components/shared/name-dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { TopicRow } from "@/components/sebi/topic-row";
import { apiPost, apiPatch, apiDelete } from "@/lib/utils/api-client";

export function SubjectCard({ subject, topics, mutate, date, onEditSubject, onDeleteSubject }) {
  const [nameDialog, setNameDialog] = useState(null);
  const [deleteTopic, setDeleteTopic] = useState(null);

  async function handleNameSubmit(value) {
    const { mode, targetId } = nameDialog;
    try {
      if (mode === "add-topic") {
        await apiPost("/api/sebi/topics", { subjectId: subject._id, name: value, order: topics.length });
      }
      if (mode === "rename-topic") {
        await apiPatch(`/api/sebi/topics/${targetId}`, { name: value });
      }
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleToggle(topicId, done) {
    try {
      await apiPost(`/api/sebi/topics/${topicId}/mark`, { done, date });
      await mutate();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteTopicConfirm() {
    try {
      await apiDelete(`/api/sebi/topics/${deleteTopic._id}`);
      await mutate();
      setDeleteTopic(null);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{subject.name}</p>
          {subject.weightage && (
            <Badge className="bg-gate/20 text-[10px] text-gate">{subject.weightage}</Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button size="icon" variant="ghost" className="h-7 w-7" />}>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditSubject(subject)}>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDeleteSubject(subject)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        {subject.syllabus && (
          <p className="text-sm text-muted-foreground">{subject.syllabus}</p>
        )}

        <div className="space-y-1.5">
          {topics.map((topic) => (
            <TopicRow
              key={topic._id}
              topic={topic}
              onToggle={(done) => handleToggle(topic._id, done)}
              onRename={() =>
                setNameDialog({
                  mode: "rename-topic",
                  targetId: topic._id,
                  title: "Rename topic",
                  label: "Topic name",
                  initialValue: topic.name,
                })
              }
              onDelete={() => setDeleteTopic(topic)}
            />
          ))}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="text-xs"
          onClick={() =>
            setNameDialog({ mode: "add-topic", title: "Add topic", label: "Topic name" })
          }
        >
          <Plus className="mr-1 h-3 w-3" /> Add topic
        </Button>
      </CardContent>

      <NameDialog
        open={!!nameDialog}
        onOpenChange={(open) => !open && setNameDialog(null)}
        title={nameDialog?.title}
        label={nameDialog?.label}
        initialValue={nameDialog?.initialValue}
        onSubmit={handleNameSubmit}
      />
      <ConfirmDeleteDialog
        open={!!deleteTopic}
        onOpenChange={(open) => !open && setDeleteTopic(null)}
        title={`Delete "${deleteTopic?.name}"?`}
        description="This can't be undone."
        onConfirm={handleDeleteTopicConfirm}
      />
    </Card>
  );
}
