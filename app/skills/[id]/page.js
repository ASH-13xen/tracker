"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Pencil, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillFormDialog } from "@/components/skills/skill-form-dialog";
import { SkillTopicsTree } from "@/components/skills/skill-topics-tree";
import { MaterialList } from "@/components/study-material/material-list";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DateNav } from "@/components/dashboard/date-nav";
import { apiPatch, apiDelete } from "@/lib/utils/api-client";
import { todayKey } from "@/lib/utils/date-helpers";
import { format } from "date-fns";
import Link from "next/link";

const STATUS_STYLE = {
  active: "bg-skill/20 text-skill",
  paused: "bg-muted text-muted-foreground",
  mastered: "bg-project/20 text-project",
};

export default function SkillDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, mutate } = useSWR(`/api/skills/${id}`);
  const [date, setDate] = useState(todayKey());
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const progress = useMemo(() => {
    if (!data) return 0;
    const total = data.subtopics.length * 2;
    if (total === 0) return 0;
    const done = data.subtopics.reduce(
      (sum, st) => sum + (st.theoryDone ? 1 : 0) + (st.practiceDone ? 1 : 0),
      0
    );
    return Math.round((done / total) * 100);
  }, [data]);

  async function handleEditSubmit(payload) {
    try {
      await apiPatch(`/api/skills/${id}`, payload);
      await mutate();
      toast.success("Skill updated");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    try {
      await apiDelete(`/api/skills/${id}`);
      toast.success("Skill deleted");
      router.push("/skills");
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (!data) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <Link
        href="/skills"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to skills
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{data.name}</h1>
            <Badge className={`text-[10px] capitalize ${STATUS_STYLE[data.status]}`}>
              {data.status}
            </Badge>
          </div>
          {data.targetGoal?.description && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Target className="h-3.5 w-3.5" />
              {data.targetGoal.description}
              {data.targetGoal.deadline &&
                ` — by ${format(new Date(data.targetGoal.deadline), "d MMM yyyy")}`}
            </p>
          )}
          {data.resourceLinks?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {data.resourceLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-skill hover:underline"
                >
                  {link.label} <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Overall progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <DateNav date={date} onChange={setDate} />

      <SkillTopicsTree skillId={id} data={data} mutate={mutate} date={date} />

      <MaterialList kind="skill" id={id} />

      <SkillFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        skill={data}
        onSubmit={handleEditSubmit}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${data.name}"?`}
        description="This also deletes all its topics and subtopics. This can't be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
