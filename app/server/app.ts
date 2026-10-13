/**
 * Builds the Express app — mounts every controller under /api and exposes the
 * verification gate GET /api/health → { status: "ok" }.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { Database, MockDatabase, RealDatabase } from "@shared/db";
import { errorHandler, requestLogger } from "@shared/middleware";
import { NotFoundError } from "@shared/errors";

// Data-lane routers
import { router as editRefineDocumentController } from "@app/data/05_-_ICF_Creation_-_Edit_and_Refine/DocumentController";
import { router as userContextController } from "@app/data/Global_Navigation_Header/UserController";
import { router as sectionController } from "@app/data/Table_of_Contents/SectionController";
// Logic-lane routers
import { router as authSessionController } from "@app/controller/01_-_Onboarding/AuthenticationSessionService";
import { router as userController } from "@app/controller/01_-_Onboarding/UserController";
import { router as protocolController } from "@app/controller/02_-_ICF_Dashboard/ProtocolController";
import { router as setupProtocolService } from "@app/controller/03_-_ICF_Creation_-_Setup/ProtocolService";
import { router as referenceDocumentService } from "@app/controller/03_-_ICF_Creation_-_Setup/ReferenceDocumentService";
import { router as templateService } from "@app/controller/03_-_ICF_Creation_-_Setup/TemplateService";
import { router as reviewDocumentController } from "@app/controller/06_-_ICF_Creation_-_Review/DocumentController";
import { router as publishController } from "@app/controller/07_-_ICF_Creation_-_Preview/publish.routes";
import { router as aiEditorController } from "@app/controller/AI_Document_Editor/AIEditorController";
import { router as openRouterDocumentController } from "@app/controller/AI_Openrouter_SDK/documentService";
import { router as submissionController } from "@app/controller/Bottom_Bar_-_Edit/DocumentSubmissionController";
import { router as submitApprovalController } from "@app/controller/Bottom_Bar_-_Review/submitApproval.routes";
import { router as generationController } from "@app/controller/Bottom_Bar_-_Setup/GenerationController";
import { router as commentController } from "@app/controller/Comment_Actions/CommentService";
import { router as reviewerController } from "@app/controller/Comment_Actions/ReviewerService";
import { router as editActionsController } from "@app/controller/Edit_Actions/DocumentService";
import { router as versionController } from "@app/controller/Review_Actions/DocumentVersionService";

export function createApp(opts: { useMockDb?: boolean; quiet?: boolean } = {}) {
  const USE_MOCK_DB = opts.useMockDb ?? (process.env.USE_MOCK_DB ?? "true") !== "false";

  // Initialize database adapter
  if (USE_MOCK_DB) {
    if (!opts.quiet) console.log("[server] Using mock database");
    Database.setAdapter(new MockDatabase());
  } else {
    if (!opts.quiet) console.log("[server] Using real database");
    Database.setAdapter(new RealDatabase(process.env.DB_URL));
  }

  const app = express();

  // Middleware
  app.use(express.json({ limit: "2mb" }));
  if (!opts.quiet) app.use(requestLogger);

  // Health check (verification gate)
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Mount controllers under /api
  for (const router of [
    authSessionController,
    userController,
    userContextController,
    protocolController,
    setupProtocolService,
    referenceDocumentService,
    templateService,
    generationController,
    // specific /documents/:id/* routes before the generic /documents/:id
    versionController,
    reviewDocumentController,
    sectionController,
    editActionsController,
    aiEditorController,
    submissionController,
    submitApprovalController,
    editRefineDocumentController,
    commentController,
    reviewerController,
    publishController,
    openRouterDocumentController,
  ]) {
    app.use("/api", router);
  }

  app.use("/api", (req, _res, next) => next(new NotFoundError(`No route for ${req.method} ${req.originalUrl}`)));

  // Production: serve the built client
  const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
  if (process.env.NODE_ENV === "production" && fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(distDir, "index.html")));
  }

  app.use(errorHandler);

  return app;
}
