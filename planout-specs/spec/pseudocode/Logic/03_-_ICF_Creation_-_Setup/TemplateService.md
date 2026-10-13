// Handles template retrieval for the ICF configuration wizard
function getAvailableTemplates() {
    // Returns list of available templates for the user to choose from
    return fetch("/api/catalog/templates");
}