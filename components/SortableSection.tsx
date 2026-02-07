"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { ReactNode } from "react";

export default function SortableSection({
  id,
  children
}: {
  id: string;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className="absolute -left-3 top-4 h-6 w-6 rounded-full border border-ink/20 bg-white text-ink/40 text-xs flex items-center justify-center cursor-grab"
        {...attributes}
        {...listeners}
        aria-label="Drag section"
      >
        ::
      </div>
      {children}
    </div>
  );
}
