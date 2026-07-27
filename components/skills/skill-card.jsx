"use client";

import Link from "next/link";
import { MoreVertical, Target } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

const STATUS_STYLE = {
  active: "bg-skill/20 text-skill",
  paused: "bg-muted text-muted-foreground",
  mastered: "bg-project/20 text-project",
};

export function SkillCard({ skill, onEdit, onDelete }) {
  return (
    <Card className="relative transition-colors hover:border-skill/40">
      <Link href={`/skills/${skill._id}`} className="absolute inset-0" aria-label={skill.name} />
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <p className="text-sm font-semibold">{skill.name}</p>
          <Badge className={`mt-1.5 text-[10px] capitalize ${STATUS_STYLE[skill.status]}`}>
            {skill.status}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button size="icon" variant="ghost" className="relative z-10 h-7 w-7" />}
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(skill)}>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(skill)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{skill.progress}%</span>
        </div>
        <Progress value={skill.progress} className="h-1.5" />

        {skill.targetGoal?.description && (
          <div className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Target className="mt-0.5 h-3 w-3 shrink-0" />
            <span className="line-clamp-2">
              {skill.targetGoal.description}
              {skill.targetGoal.deadline &&
                ` — by ${format(new Date(skill.targetGoal.deadline), "d MMM yyyy")}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
