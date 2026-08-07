"use client";

import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

export function TopicRow({ topic, onToggle, onRename, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-1.5">
      <label className="flex min-w-0 flex-1 items-center gap-2">
        <Checkbox
          checked={!!topic.done}
          onCheckedChange={(checked) => onToggle(checked === true)}
        />
        <span className="truncate text-sm">{topic.name}</span>
        {topic.done && topic.markedLater && (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="text-[9px]">
                later
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Backdated entry</TooltipContent>
          </Tooltip>
        )}
        {topic.done && topic.doneAt && (
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {format(new Date(topic.doneAt), "d MMM, h:mm a")}
          </span>
        )}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" />}>
          <MoreVertical className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
