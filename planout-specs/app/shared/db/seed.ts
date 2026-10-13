import type {
  AuditLogEntity,
  CommentEntity,
  DocumentEntity,
  DocumentStatus,
  DocumentVersionEntity,
  ProtocolEntity,
  ReferenceDocumentEntity,
  ReviewerEntity,
  SectionEntity,
  TemplateEntity,
  UserEntity,
} from "../schema/entities";
import { buildIcfSections, flattenIcfSections, sectionsToMarkdown, type IcfContext } from "../lib/icfContent";
import type { DbState } from "./adapter";

export const DEMO_USER_ID = "u-1";
export const DEMO_TOKEN = "demo-token";
export const DEFAULT_SPONSOR = "BioNovaTx Inc.";
export const DEFAULT_PI = "Dr. Sarah Johnson, MD, PhD";

interface ProtocolSeed {
  protocol_id: string;
  protocol_version: string;
  protocol_name: string;
  icf_name: string;
  title: string;
  phase: string;
  category: string;
  drug_code: string;
  condition: string;
  conditionShort: string;
  comparator: string;
  imaging: string;
  status: DocumentStatus;
  last_modified: string;
  owner_id?: string;
  reviewer_id?: string | null;
}

const CATEGORY_DEFAULTS: Record<string, Pick<ProtocolSeed, "comparator" | "imaging">> = {
  Oncology: { comparator: "standard chemotherapy", imaging: "CT or MRI scans of your chest and any areas where cancer has spread" },
  "CNS / Neurology": { comparator: "placebo (an inactive substance)", imaging: "MRI scan of your brain and cognitive assessments" },
  Immunology: { comparator: "placebo (an inactive substance)", imaging: "Joint examination and X-ray imaging where needed" },
  Cardiology: { comparator: "standard heart failure therapy", imaging: "Chest X-ray and cardiac MRI" },
  Endocrinology: { comparator: "metformin (standard therapy)", imaging: "HbA1c and fasting glucose tests" },
  Respiratory: { comparator: "standard inhaled therapy", imaging: "Lung function tests and chest CT scan" },
  Hematology: { comparator: "standard of care therapy", imaging: "Bone marrow sample and blood counts" },
};

const DESIGN_ROWS: ProtocolSeed[] = [
  {
    protocol_id: "PROTO-2024-001", protocol_version: "v2.1", protocol_name: "Phase III RCT of OncoPlex-X in NSCLC",
    icf_name: "OncoPlex-X Phase III ICF", title: "A Phase III Randomized Controlled Trial of OncoPlex-X in Advanced Non-Small Cell Lung Cancer",
    phase: "Phase III", category: "Oncology", drug_code: "OncoPlex-X (ZB-110)",
    condition: "advanced non-small cell lung cancer (NSCLC)", conditionShort: "advanced NSCLC",
    ...CATEGORY_DEFAULTS.Oncology, status: "Approved", last_modified: "2026-05-10T09:12:00.000Z",
  },
  {
    protocol_id: "PROTO-2024-002", protocol_version: "v1.4", protocol_name: "Phase II NeuroClear-Y Alzheimer's Study",
    icf_name: "NeuroClear-Y AD Study ICF", title: "Phase II Study of NeuroClear-Y for the Treatment of Early Alzheimer's Disease",
    phase: "Phase II", category: "CNS / Neurology", drug_code: "NeuroClear-Y (NC-220)",
    condition: "early Alzheimer's disease", conditionShort: "early Alzheimer's disease",
    ...CATEGORY_DEFAULTS["CNS / Neurology"], status: "In Review", last_modified: "2026-05-09T14:30:00.000Z", reviewer_id: DEMO_USER_ID,
  },
  {
    protocol_id: "PROTO-2024-003", protocol_version: "v1.0", protocol_name: "Phase I First-in-Human ZA-123 Study",
    icf_name: "ZA-123 First-in-Human ICF", title: "Phase I First-in-Human Dose Escalation Study of ZA-123 in Healthy Volunteers",
    phase: "Phase I", category: "Immunology", drug_code: "ZA-123 (Anti-IL-17 mAb)",
    condition: "inflammatory conditions (tested first in healthy volunteers)", conditionShort: "inflammatory disease",
    ...CATEGORY_DEFAULTS.Immunology, status: "In Review", last_modified: "2026-05-08T11:05:00.000Z", reviewer_id: DEMO_USER_ID,
  },
  {
    protocol_id: "PROTO-2024-004", protocol_version: "v3.2", protocol_name: "CardioGuard-Z Heart Failure Trial",
    icf_name: "CardioGuard-Z HF Trial ICF", title: "Phase III Multi-Center Trial of CardioGuard-Z in Patients with Heart Failure",
    phase: "Phase III", category: "Cardiology", drug_code: "CardioGuard-Z (CG-310)",
    condition: "chronic heart failure", conditionShort: "heart failure",
    ...CATEGORY_DEFAULTS.Cardiology, status: "Draft", last_modified: "2026-05-07T16:45:00.000Z",
  },
  {
    protocol_id: "PROTO-2024-005", protocol_version: "v1.8", protocol_name: "DiabetaCore-M Type 2 Diabetes Evaluation",
    icf_name: "DiabetaCore-M Diabetes ICF", title: "Phase II Evaluation of DiabetaCore-M in Adults with Type 2 Diabetes",
    phase: "Phase II", category: "Endocrinology", drug_code: "DiabetaCore-M (DM-505)",
    condition: "type 2 diabetes", conditionShort: "type 2 diabetes",
    ...CATEGORY_DEFAULTS.Endocrinology, status: "In Review", last_modified: "2026-05-06T10:20:00.000Z",
  },
  {
    protocol_id: "PROTO-2023-089", protocol_version: "v2.5", protocol_name: "ImmunoBoost-R Rheumatoid Arthritis Study",
    icf_name: "ImmunoBoost-R RA Study ICF", title: "Phase III Study of ImmunoBoost-R in Moderate-to-Severe Rheumatoid Arthritis",
    phase: "Phase III", category: "Immunology", drug_code: "ImmunoBoost-R (IB-789)",
    condition: "moderate-to-severe rheumatoid arthritis", conditionShort: "rheumatoid arthritis",
    ...CATEGORY_DEFAULTS.Immunology, status: "Approved", last_modified: "2026-05-05T08:50:00.000Z",
  },
];

// [drug, condition, conditionShort, category, phase, status]
const EXTRA: [string, string, string, string, string, DocumentStatus][] = [
  ["PulmoClear-A", "chronic obstructive pulmonary disease (COPD)", "COPD", "Respiratory", "Phase II", "Draft"],
  ["HemaStat-B", "sickle cell disease", "sickle cell disease", "Hematology", "Phase II", "Draft"],
  ["OncoPlex-X", "metastatic colorectal cancer", "colorectal cancer", "Oncology", "Phase II", "In Review"],
  ["NeuroClear-Y", "mild cognitive impairment", "cognitive impairment", "CNS / Neurology", "Phase I", "In Review"],
  ["CardioGuard-Z", "atrial fibrillation", "atrial fibrillation", "Cardiology", "Phase II", "In Review"],
  ["DermaHeal-K", "moderate plaque psoriasis", "psoriasis", "Immunology", "Phase III", "In Review"],
  ["LymphoTarget-Q", "relapsed follicular lymphoma", "follicular lymphoma", "Oncology", "Phase II", "Approved"],
  ["GlucoSense-P", "type 1 diabetes", "type 1 diabetes", "Endocrinology", "Phase II", "Approved"],
  ["RespiraFlow-D", "severe asthma", "severe asthma", "Respiratory", "Phase III", "Approved"],
  ["MyeloGuard-V", "multiple myeloma", "multiple myeloma", "Hematology", "Phase III", "Approved"],
  ["BreastShield-T", "HER2-positive breast cancer", "breast cancer", "Oncology", "Phase III", "Approved"],
  ["SpinaCalm-N", "multiple sclerosis", "multiple sclerosis", "CNS / Neurology", "Phase III", "Approved"],
  ["LupoRelief-S", "systemic lupus erythematosus", "lupus", "Immunology", "Phase II", "Approved"],
  ["VascuFlow-H", "pulmonary arterial hypertension", "pulmonary hypertension", "Cardiology", "Phase III", "Approved"],
  ["ThyroBalance-E", "Graves' disease", "Graves' disease", "Endocrinology", "Phase II", "Approved"],
  ["PancreaX-L", "metastatic pancreatic cancer", "pancreatic cancer", "Oncology", "Phase III", "Approved"],
  ["MigraStop-C", "chronic migraine", "chronic migraine", "CNS / Neurology", "Phase III", "Approved"],
  ["ColiCalm-U", "ulcerative colitis", "ulcerative colitis", "Immunology", "Phase III", "Approved"],
  ["RenaGuard-W", "chronic kidney disease", "kidney disease", "Cardiology", "Phase II", "Approved"],
];

function extraRows(): ProtocolSeed[] {
  return EXTRA.map(([drug, condition, conditionShort, category, phase, status], i) => {
    const n = 88 - i;
    const code = `${drug.split("-")[1]}${drug.charAt(0)}-${200 + i * 7}`;
    const day = new Date(Date.UTC(2026, 3, 28 - i, 9 + (i % 7), (i * 13) % 60));
    return {
      protocol_id: `PROTO-2023-${String(n).padStart(3, "0")}`,
      protocol_version: `v${1 + (i % 3)}.${i % 5}`,
      protocol_name: `${drug} ${conditionShort.replace(/^\w/, (c) => c.toUpperCase())} Study`,
      icf_name: `${drug} ${conditionShort.split(" ").map((w) => w[0]?.toUpperCase()).join("")} ICF`,
      title: `${phase} Study of ${drug} in Patients with ${condition.replace(/^\w/, (c) => c.toUpperCase())}`,
      phase,
      category,
      drug_code: `${drug} (${code})`,
      condition,
      conditionShort,
      ...(CATEGORY_DEFAULTS[category] ?? CATEGORY_DEFAULTS.Oncology),
      status,
      last_modified: day.toISOString(),
    };
  });
}

const REVIEWERS: Omit<ReviewerEntity, "id" | "document_id" | "acted">[] = [
  { name: "Sarah Chen", role: "Medical Reviewer" },
  { name: "James Liu", role: "Legal / Regulatory" },
  { name: "Priya Nair", role: "Privacy Officer" },
];

const SEED_COMMENTS: { sectionNo: number; sectionTitle: string; owner: string; text: string; h: number; m: number }[] = [
  { sectionNo: 5, sectionTitle: "Benefits", owner: "Sarah Chen", text: "The benefits section could be more specific about expected outcomes for NSCLC patients.", h: 10, m: 23 },
  { sectionNo: 11, sectionTitle: "Consent Statement", owner: "James Liu", text: "Please clarify the legal jurisdiction for dispute resolution in the consent statement.", h: 11, m: 15 },
  { sectionNo: 8, sectionTitle: "Confidentiality", owner: "Priya Nair", text: "FDA reference in confidentiality section needs the latest 2024 regulation number.", h: 11, m: 42 },
];

export const SEED_TEMPLATES: TemplateEntity[] = [
  { id: "standard", name: "Standard ICF", description: "General adult consent form for most clinical trials", recommended: true },
  { id: "pediatric", name: "Pediatric ICF", description: "Age-appropriate language for studies involving minors", recommended: false },
  { id: "oncology", name: "Oncology ICF", description: "Enhanced risk disclosure for oncology studies", recommended: false },
  { id: "emergency", name: "Emergency Research", description: "Waiver of consent for emergency/critical care studies", recommended: false },
];

export function contextFor(p: ProtocolEntity, template?: string): IcfContext {
  const defaults = CATEGORY_DEFAULTS[p.category] ?? CATEGORY_DEFAULTS.Oncology;
  const abbrev = /\(([^)]{2,12})\)/.exec(p.condition)?.[1];
  return {
    protocolId: p.protocol_id,
    studyTitle: p.title,
    drug: p.drug_code.split(" (")[0],
    condition: p.condition,
    conditionShort: abbrev ? `${p.condition.split(" ")[0]} ${abbrev}` : p.condition.split("(")[0].trim(),
    sponsor: p.sponsor,
    principalInvestigator: p.principal_investigator,
    comparator: defaults.comparator,
    imaging: defaults.imaging,
    participants: 600,
    centers: 50,
    template,
  };
}

/** Build section rows for a document from a protocol (shared with generation pipeline). */
export function buildSectionRows(documentId: string, ctx: IcfContext): SectionEntity[] {
  const flat = flattenIcfSections(buildIcfSections(ctx));
  const parentIds: string[] = [];
  const rows: SectionEntity[] = [];
  let top = 0;
  flat.forEach((r, i) => {
    const id = `${documentId}-s${i + 1}`;
    if (r.parentIndex === null) parentIds[top++] = id;
    rows.push({
      id,
      document_id: documentId,
      title: r.title,
      content: r.content,
      position: i,
      status: "AI Generated",
      version: 1,
      ai_label: "AI Generated",
      parent_id: r.parentIndex === null ? null : parentIds[r.parentIndex],
      is_ai_generated: true,
    });
  });
  return rows;
}

export function createSeedState(): DbState {
  const now = new Date().toISOString();
  const users: UserEntity[] = [
    {
      id: DEMO_USER_ID, firstName: "Mike", lastName: "Evans", email: "mike.evans@consentiq.example",
      avatarUrl: null, role: "ICF Author", secondaryRole: "Medical Writer", locale: "en-US",
      timezone: "America/New_York", lastLoginAt: now, pendingNotifications: 3,
    },
  ];

  const seeds = [...DESIGN_ROWS, ...extraRows()];
  const protocols: ProtocolEntity[] = [];
  const documents: DocumentEntity[] = [];
  const sections: SectionEntity[] = [];
  const reviewers: ReviewerEntity[] = [];
  const comments: CommentEntity[] = [];
  const auditLogs: AuditLogEntity[] = [];
  const documentVersions: DocumentVersionEntity[] = [];
  const referenceDocuments: ReferenceDocumentEntity[] = [];

  seeds.forEach((s, idx) => {
    const pid = `p-${s.protocol_id.toLowerCase()}`;
    const protocol: ProtocolEntity = {
      id: pid, protocol_id: s.protocol_id, protocol_version: s.protocol_version, protocol_name: s.protocol_name,
      title: s.title, phase: s.phase, category: s.category, drug_code: s.drug_code,
      description: s.title, sponsor: DEFAULT_SPONSOR, principal_investigator: DEFAULT_PI,
      condition: s.condition, status: "Active", last_modified: s.last_modified,
    };
    protocols.push(protocol);

    const docId = `doc-${s.protocol_id.toLowerCase()}`;
    const rows = buildSectionRows(docId, { ...contextFor(protocol, "standard"), conditionShort: s.conditionShort, comparator: s.comparator, imaging: s.imaging });
    sections.push(...rows);
    const created = new Date(new Date(s.last_modified).getTime() - 14 * 864e5).toISOString();
    documents.push({
      id: docId, protocol_id: s.protocol_id, icf_name: s.icf_name, icf_version: s.protocol_version.replace(/^v/, "v"),
      template: "standard", status: s.status, content: sectionsToMarkdown(rows), metadata: { template_name: "Standard ICF" },
      published_at: s.status === "Approved" ? s.last_modified : null, created_at: created, last_modified: s.last_modified,
      owner_id: s.owner_id ?? DEMO_USER_ID, reviewer_id: s.reviewer_id ?? null,
    });

    const approved = s.status === "Approved";
    REVIEWERS.forEach((r, i) => reviewers.push({ id: `${docId}-r${i + 1}`, document_id: docId, ...r, acted: approved }));

    const day = new Date(s.last_modified);
    SEED_COMMENTS.forEach((c, i) => {
      const ts = new Date(day.getFullYear(), day.getMonth(), day.getDate(), c.h, c.m).toISOString();
      comments.push({
        id: `${docId}-c${i + 1}`, document_id: docId, section: `${c.sectionNo}. ${c.sectionTitle}`, owner: c.owner,
        comment_text: idx === 0 || !c.text.includes("NSCLC") ? c.text : c.text.replace("NSCLC", s.conditionShort),
        status: approved ? "Resolved" : "Open", parent_id: null, timestamp: ts,
      });
    });

    const audit = (n: number, action: string, user: string, offsetH: number, resource = docId) =>
      auditLogs.push({
        id: `${docId}-a${n}`, document_id: docId, user_id: user === "Mike Evans" ? DEMO_USER_ID : `ext-${user}`,
        user_name: user, action, resource_id: resource,
        timestamp: new Date(new Date(created).getTime() + offsetH * 36e5).toISOString(),
      });
    audit(1, "Document Created", "Mike Evans", 0);
    audit(2, "AI Generation Completed", "Consent IQ AI", 0.1);
    audit(3, "Manual Edit", "Mike Evans", 26, `${docId}-s1`);
    if (s.status !== "Draft") audit(4, "Submitted for Review", "Mike Evans", 50);
    if (approved) audit(5, "Approved", "Sarah Chen", 200);

    const [maj, min] = s.protocol_version.replace("v", "").split(".").map(Number);
    const snapshot = rows.map((r) => ({ title: r.title, content: r.content }));
    const prevSnapshot = snapshot.map((r) =>
      r.title === "Benefits" ? { ...r, content: "You may not benefit from taking part in this study. Information from this study may help others in the future." } :
      r.title === "Confidentiality" ? { ...r, content: "Your study records will be kept confidential to the extent permitted by law." } : r,
    );
    if (maj > 1 || min > 0) {
      documentVersions.push({
        id: `${docId}-v-prev`, document_id: docId, version_number: min > 0 ? `${maj}.${min - 1}` : `${maj - 1}.9`,
        status: "Superseded", is_current: false, created_at: created, snapshot: prevSnapshot,
      });
    }
    documentVersions.push({
      id: `${docId}-v-cur`, document_id: docId, version_number: `${maj}.${min}`, status: s.status,
      is_current: true, created_at: s.last_modified, snapshot,
    });

    const drug = s.drug_code.split(" (")[0];
    referenceDocuments.push(
      { id: `${pid}-ib`, protocol_id: s.protocol_id, doc_kind: "Investigation Brochure", file_name: `${drug}_Investigator_Brochure_v4.pdf`, bucket_name: "dms-archive", uploaded_at: created, source: "dms", size: 2_480_000 },
      { id: `${pid}-lm`, protocol_id: s.protocol_id, doc_kind: "Lab Manual", file_name: `${s.protocol_id}_Lab_Manual_v2.pdf`, bucket_name: "dms-archive", uploaded_at: created, source: "dms", size: 910_000 },
    );
  });

  return {
    users,
    sessions: [{ id: DEMO_TOKEN, token: DEMO_TOKEN, userId: DEMO_USER_ID }],
    protocols,
    documents,
    sections,
    referenceDocuments,
    templates: SEED_TEMPLATES,
    generationJobs: [],
    comments,
    reviewers,
    auditLogs,
    documentVersions,
    documentGenerations: [],
    documentSections: [],
  };
}
