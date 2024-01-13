import { DndContext } from "@dnd-kit/core";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <DndContext>{children}</DndContext>;
}
