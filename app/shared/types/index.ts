/**
 * Client/server contracts. Every type is derived from a server-side Zod
 * schema via z.infer — never hand-written. Type-only re-exports, so importing
 * this barrel from the client pulls in no server code.
 */
export type { ApiResponse, Paginated } from "./api";
export type {
  UserEntity, ProtocolEntity, DocumentEntity, DocumentStatus, SectionEntity, CommentEntity, CommentStatus,
  ReviewerEntity, AuditLogEntity, DocumentVersionEntity, ReferenceDocumentEntity, TemplateEntity,
  SectionView, DocumentView,
} from "../schema";
export type { TaskCounts } from "@app/data/01_-_Onboarding/TaskService";
export type { UserMe } from "@app/data/01_-_Onboarding/UserController";
export type { DashboardProtocol, DashboardStats } from "@app/data/02_-_ICF_Dashboard/ProtocolRepository";
export type { ProtocolListResponse } from "@app/data/02_-_ICF_Dashboard/ProtocolController";
export type { ReferenceDocumentDTO, ProtocolOptionDTO, TemplateDTO } from "@app/data/03_-_ICF_Creation_-_Setup/DataModels";
export type { CatalogProtocol } from "@app/data/03_-_ICF_Creation_-_Setup/ProtocolRepository";
export type { EditorDocument } from "@app/data/05_-_ICF_Creation_-_Edit_and_Refine/DocumentRepository";
export type { RewriteResponse } from "@app/data/05_-_ICF_Creation_-_Edit_and_Refine/DocumentController";
export type { DocumentDTO, AuditEntryDTO } from "@app/data/06_-_ICF_Creation_-_Review/DocumentDTO";
export type { AIEditedSection } from "@app/data/AI_Document_Editor/AISectionRepository";
export type { GenerateJobAccepted, GenerationEvent } from "@app/data/Bottom_Bar_-_Setup/GenerationController";
export type { Comment } from "@app/data/Comment_Actions/CommentRepository";
export type { Reviewer } from "@app/data/Comment_Actions/ReviewerRepository";
export type { UserContext } from "@app/data/Global_Navigation_Header/UserContextService";
export type { Section } from "@app/data/Table_of_Contents/DocumentRepository";
export type { DocumentVersionView, CompareResult } from "@app/controller/Review_Actions/DocumentVersionService";
export type { GeneratedDocumentResponse } from "@app/controller/AI_Openrouter_SDK/documentService";
