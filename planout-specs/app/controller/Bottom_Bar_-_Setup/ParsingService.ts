/**
 * Background parsing step of the generation pipeline: resolves the protocol
 * and its reference documents into a structured ICF-generate payload.
 */
import { contextFor, repos } from "@shared/db";
import { NotFoundError } from "@shared/errors";
import type { IcfContext } from "@shared/lib";
import { createLogger } from "@shared/lib";

const log = createLogger("parsing");

export interface ParsedProtocol {
  context: IcfContext;
  referenceFiles: string[];
}

export function parseDocumentStructure(protocolId: string, templateId: string, referenceIds: string[]): ParsedProtocol {
  const protocol = repos.protocols.findOne({ protocol_id: protocolId });
  if (!protocol) throw new NotFoundError(`Protocol ${protocolId} not found`);
  const referenceFiles = referenceIds
    .map((id) => repos.referenceDocuments.findById(id)?.file_name)
    .filter((f): f is string => Boolean(f));
  return { context: contextFor(protocol, templateId), referenceFiles };
}

/** Marks the job PARSED once structure extraction succeeds. */
export function triggerParsingPipeline(jobId: string, templateId: string): ParsedProtocol | null {
  const job = repos.generationJobs.findById(jobId);
  if (!job) return null;
  try {
    const parsed = parseDocumentStructure(job.protocol_id, templateId, job.reference_ids);
    repos.generationJobs.update(jobId, { status: "PARSED" });
    log.info(`Job ${jobId} parsed (${parsed.referenceFiles.length} reference files)`);
    return parsed;
  } catch (e) {
    repos.generationJobs.update(jobId, { status: "FAILED", error: (e as Error).message });
    return null;
  }
}
