import { Badge } from "@/components/ui/badge";
import { TAG_LABELS } from "@/data/curriculum";
import type { ContentTag } from "@/types";

const VARIANT: Record<ContentTag, "default" | "secondary" | "outline"> = {
  "MS-102-core": "secondary",
  "MS-102-updated": "outline",
  "AB-650-new": "default",
};

export function TagBadge({ tag }: { tag: ContentTag }) {
  return <Badge variant={VARIANT[tag]}>{TAG_LABELS[tag]}</Badge>;
}
