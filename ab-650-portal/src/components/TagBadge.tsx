import { TAG_LABELS } from '../data/curriculum'
import type { ContentTag } from '../types'

const CLASS_MAP: Record<ContentTag, string> = {
  'MS-102-core': 'tag tag-core',
  'MS-102-updated': 'tag tag-updated',
  'AB-650-new': 'tag tag-new',
}

export function TagBadge({ tag }: { tag: ContentTag }) {
  return <span className={CLASS_MAP[tag]}>{TAG_LABELS[tag]}</span>
}
