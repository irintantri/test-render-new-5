// Handles retrieval of ICF generation templates
interface TemplateRepository {
  // Fetches all available templates for the wizard
  getAvailableTemplates(): Promise<Template[]>;
}