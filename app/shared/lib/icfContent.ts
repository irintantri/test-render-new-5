/**
 * Deterministic ICF section builder. Used by the seed data and by the
 * generation pipeline when no AI provider is configured.
 */
export interface IcfContext {
  protocolId: string;
  studyTitle: string;
  drug: string;
  condition: string;
  conditionShort: string;
  sponsor: string;
  principalInvestigator: string;
  comparator: string;
  participants: number;
  centers: number;
  imaging: string;
  template?: string;
}

export interface IcfSectionDraft {
  title: string;
  content: string;
  children?: IcfSectionDraft[];
}

export function buildIcfSections(c: IcfContext): IcfSectionDraft[] {
  const intro =
    c.template === "pediatric"
      ? "You and your child are being asked to take part in a research study. This form provides you with information about the study. A member of the research team will discuss this information with you and your child and answer any questions you may have."
      : "You are being asked to take part in a research study. This form provides you with information about the study. A member of the research team will discuss this information with you and answer any questions you may have.";
  const emergencyNote =
    c.template === "emergency"
      ? "\nBecause this study involves emergency care, you may have been enrolled before consent could be obtained. You are now being asked whether you wish to continue."
      : "";

  return [
    {
      title: "Introduction",
      content: `${intro}
Your participation is voluntary. You may refuse to participate or discontinue your participation at any time without penalty or loss of benefits to which you are otherwise entitled. You will be given a copy of this form to keep.${emergencyNote}
**Study Title:** ${c.studyTitle}
**Principal Investigator:** ${c.principalInvestigator}
**Sponsor:** ${c.sponsor}
**Protocol Number:** ${c.protocolId}`,
    },
    {
      title: "Purpose of the Study",
      content: `This research study is testing a new investigational drug called ${c.drug} to see if it works better than current standard treatments for ${c.condition}.
The main purposes of this study are to:
- Find out if ${c.drug} can help people with ${c.conditionShort} live longer
- Determine if ${c.drug} reduces disease activity more effectively than ${c.comparator}
- Monitor and evaluate the safety of ${c.drug} when given to people with ${c.conditionShort}
- Understand how ${c.drug} affects quality of life and disease symptoms

Approximately ${c.participants} patients from about ${c.centers} medical centers around the world will participate in this study.`,
    },
    {
      title: "Study Procedures",
      content: `If you agree to participate in this study, you will be randomly assigned (like flipping a coin) to receive either ${c.drug} or ${c.comparator}.`,
      children: [
        {
          title: "Screening Period",
          content: `**2–3 weeks before treatment starts:**
- Medical history review and physical examination
- Blood tests (approximately 3 tablespoons)
- ${c.imaging}
- Heart function test (echocardiogram or MUGA scan)`,
        },
        {
          title: "Treatment Period",
          content: `**Approximately 12–18 months:**
- You will receive your assigned treatment every 3 weeks at the clinic
- Each treatment session will take approximately 2–4 hours
- Blood tests will be done before each treatment
- Imaging scans will be repeated every 6 weeks`,
        },
        {
          title: "Follow-up Period",
          content: `**After treatment ends:**
- Clinic visits every 3 months for the first 2 years
- Telephone check-ins every 6 months after that
- Survival status will be collected for up to 5 years`,
        },
      ],
    },
    {
      title: "Risks and Discomforts",
      content: `Taking part in this study may involve risks that are currently unknown. The study team will monitor you closely and tell you about any new information that may affect your willingness to continue.`,
      children: [
        {
          title: "Common Side Effects",
          content: `**Reported in more than 1 in 10 people:**
- Tiredness or fatigue
- Nausea and decreased appetite
- Diarrhea
- Skin rash or itching`,
        },
        {
          title: "Serious Risks",
          content: `**Reported in fewer than 1 in 100 people:**
- Severe allergic reactions during infusion
- Inflammation of the lungs (pneumonitis)
- Liver or kidney problems
- Changes in heart rhythm`,
        },
      ],
    },
    {
      title: "Benefits",
      content: `You may or may not benefit from taking part in this study. If ${c.drug} works better than ${c.comparator}, your ${c.conditionShort} may improve or stop progressing for a period of time.
Information learned from this study may help future patients with ${c.conditionShort}.`,
    },
    {
      title: "Alternatives",
      content: `You do not have to take part in this study to receive treatment for ${c.conditionShort}. Other options may include:
- Standard approved treatments, including ${c.comparator}
- Participation in a different research study
- Supportive or comfort care only
Your study doctor will discuss these options with you.`,
    },
    {
      title: "Costs and Compensation",
      content: `The study drug and study-related tests will be provided at no cost to you. You or your insurance will be responsible for the costs of standard care.
You will receive reimbursement for reasonable travel and parking expenses for each completed study visit.`,
    },
    {
      title: "Confidentiality",
      content: `Your study records will be kept confidential to the extent permitted by law. Your information will be identified by a code number rather than your name.
Representatives of ${c.sponsor}, the Institutional Review Board, and regulatory authorities such as the U.S. Food and Drug Administration (FDA) may review your records.`,
    },
    {
      title: "Voluntary Participation",
      content: `Your participation in this study is entirely voluntary. You may choose not to take part, or you may leave the study at any time. Your decision will not affect your regular medical care or any benefits to which you are entitled.`,
    },
    {
      title: "Questions and Contacts",
      content: `If you have questions about the study, contact ${c.principalInvestigator} at the study site.
If you have questions about your rights as a research participant, contact the Institutional Review Board (IRB).`,
    },
    {
      title: "Consent Statement",
      content: `I have read this form, or it has been read to me. I have had the chance to ask questions, and my questions have been answered to my satisfaction. I voluntarily agree to take part in this study.`,
    },
    {
      title: "Signatures",
      content: `**Participant Name (printed):** ______________________
**Participant Signature:** ______________________   **Date:** __________
**Person Obtaining Consent:** ______________________   **Date:** __________`,
    },
  ];
}

/** Flatten nested drafts into ordered rows with numbered subsection titles. */
export function flattenIcfSections(drafts: IcfSectionDraft[]) {
  const rows: { title: string; content: string; parentIndex: number | null; number: string }[] = [];
  drafts.forEach((d, i) => {
    rows.push({ title: d.title, content: d.content, parentIndex: null, number: String(i + 1) });
    d.children?.forEach((ch, j) => {
      rows.push({ title: `${i + 1}.${j + 1} ${ch.title}`, content: ch.content, parentIndex: i, number: `${i + 1}.${j + 1}` });
    });
  });
  return rows;
}

/** Join flattened rows into a single markdown string (Document.content). */
export function sectionsToMarkdown(rows: { title: string; content: string; parent_id?: string | null }[]): string {
  let n = 0;
  return rows
    .map((r) => (r.parent_id ? `### ${r.title}\n${r.content}` : `## ${++n}. ${r.title}\n${r.content}`))
    .join("\n\n");
}
