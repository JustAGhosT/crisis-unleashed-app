import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  title: string;
  totalCount: number;
  isDragOver: boolean;
  isInvalidDrop: boolean;
  className?: string;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  headerRight?: React.ReactNode;
  children?: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({
  title,
  totalCount,
  isDragOver,
  isInvalidDrop,
  className,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
  headerRight,
  children,
}) => {
  return (
    <Card
      className={cn(
        "bg-slate-800/50 border-slate-600 transition-colors",
        isDragOver && "border-amber-400 ring-2 ring-amber-400/50",
        isInvalidDrop && "border-red-500 ring-2 ring-red-500/50",
        className,
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {title}
            <Badge variant="outline" className="ml-2">
              {totalCount} cards
            </Badge>
          </CardTitle>
          {headerRight}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

DropZone.displayName = "DropZone";
