/**
 * Reference document management and DMS integration.
 *   POST /api/reference/:protocolId/upload  (multipart: file, doc_kind)
 *   GET  /api/reference?protocolId=         (DMS documents for the protocol)
 */
import { Router } from "express";
import multer from "multer";
import { asyncHandler, param } from "@shared/middleware";
import { ValidationError } from "@shared/errors";
import { nowIso, uuid } from "@shared/lib";
import { repos } from "@shared/db";
import {
  REFERENCE_DOC_KINDS,
  ReferenceDocumentRepository,
} from "@app/data/03_-_ICF_Creation_-_Setup/ReferenceDocumentRepository";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_UPLOAD_BYTES } });

export async function uploadReferenceDocument(protocolId: string, file: Express.Multer.File | undefined, docKind: string) {
  if (!file) throw new ValidationError("A file is required");
  if (!REFERENCE_DOC_KINDS.includes(docKind as (typeof REFERENCE_DOC_KINDS)[number])) {
    throw new ValidationError(`doc_kind must be one of: ${REFERENCE_DOC_KINDS.join(", ")}`);
  }
  if (!repos.protocols.findOne({ protocol_id: protocolId })) throw new ValidationError(`Unknown protocol ${protocolId}`);
  return ReferenceDocumentRepository.saveDocumentMetadata({
    id: uuid(),
    protocol_id: protocolId,
    doc_kind: docKind as (typeof REFERENCE_DOC_KINDS)[number],
    file_name: file.originalname,
    bucket_name: "icf-reference-uploads",
    uploaded_at: nowIso(),
    source: "upload",
    size: file.size,
  });
}

export async function fetchDMSDocuments(protocolId: string | undefined) {
  if (!protocolId) throw new ValidationError("Protocol must be selected before fetching DMS documents.");
  return (await ReferenceDocumentRepository.getDocumentsByProtocol(protocolId)).filter((d) => d.source === "dms");
}

export const router = Router();

router.post(
  "/reference/:protocolId/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    res.status(201).json(await uploadReferenceDocument(param(req, "protocolId"), req.file, String(req.body?.doc_kind ?? "")));
  }),
);

router.get(
  "/reference",
  asyncHandler(async (req, res) => {
    res.json(await fetchDMSDocuments(req.query.protocolId ? String(req.query.protocolId) : undefined));
  }),
);
