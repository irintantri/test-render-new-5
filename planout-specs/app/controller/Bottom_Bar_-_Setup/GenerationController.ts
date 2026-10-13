/**
 * ICF generation entry points.
 *   POST /api/generate          { protocol_id, template_id | template_value } → 202 GenerateJobAccepted | 400
 *   POST /api/v1/icf/generate   { protocolId, referenceIds, templateId }      → 202 { status: "SUCCESS", ...job }
 *   GET  /api/icf/generation/:jobId  → SSE stream of { status, progress, step_label, document_id }
 *                                      (plain JSON snapshot when not requested as text/event-stream)
 */
import { Router, type Request, type Response } from "express";
import { param } from "@shared/middleware";
import { repos } from "@shared/db";
import { ValidationError, NotFoundError } from "@shared/errors";
import { generateRequestSchema } from "@app/data/Bottom_Bar_-_Setup/GenerationController";
import { initiateICFGeneration, toGenerationEvent } from "@app/data/Bottom_Bar_-_Setup/GenerationService";
import { triggerParsingPipeline } from "./ParsingService";

export function handleGenerateICF(body: unknown) {
  const parsed = generateRequestSchema.safeParse(body ?? {});
  if (!parsed.success) throw new ValidationError("Missing required protocol or template identifiers.");
  const accepted = initiateICFGeneration(parsed.data.protocol_id, parsed.data.template_id, parsed.data.reference_ids);
  triggerParsingPipeline(accepted.job_id, parsed.data.template_id);
  return accepted;
}

function streamJob(req: Request, res: Response) {
  const jobId = param(req, "jobId");
  const initial = repos.generationJobs.findById(jobId);
  if (!initial) throw new NotFoundError("Generation job not found");

  if (!String(req.headers.accept ?? "").includes("text/event-stream")) {
    res.json(toGenerationEvent(initial));
    return;
  }
  res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  const send = () => {
    const job = repos.generationJobs.findById(jobId);
    if (!job) return close();
    const evt = toGenerationEvent(job);
    res.write(`data: ${JSON.stringify(evt)}\n\n`);
    if (evt.status === "complete" || evt.status === "failed") close();
  };
  const timer = setInterval(send, 500);
  const close = () => {
    clearInterval(timer);
    res.end();
  };
  req.on("close", () => clearInterval(timer));
  send();
}

export const router = Router();

router.post("/generate", (req, res) => {
  res.status(202).json(handleGenerateICF(req.body));
});

router.post("/v1/icf/generate", (req, res) => {
  res.status(202).json({ ...handleGenerateICF(req.body), job_status: "PENDING", status: "SUCCESS" });
});

router.get("/icf/generation/:jobId", streamJob);
