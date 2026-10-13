/** Read-model shapes returned by the API and shared by multiple features. */
import { z } from "zod";
import { zDocumentEntity, zSectionEntity } from "./entities";

export const zSectionView = zSectionEntity.extend({
  /** "3" for a top-level section, "3.1" for a subsection */
  number: z.string(),
  isAiGenerated: z.boolean(),
});
export type SectionView = z.infer<typeof zSectionView>;

export const zDocumentView = zDocumentEntity.extend({
  metadata: z.object({ sections: z.array(zSectionView) }).catchall(z.unknown()),
  protocol_name: z.string().optional(),
  study_title: z.string().optional(),
  sponsor: z.string().optional(),
});
export type DocumentView = z.infer<typeof zDocumentView>;
