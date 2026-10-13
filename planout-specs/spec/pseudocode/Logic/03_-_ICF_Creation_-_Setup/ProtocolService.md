// Handles protocol discovery and selection logic
function getProtocolCatalog() {
    // Fetch all protocols for the initial selection panel
    return fetch("/api/catalog/protocols");
}

function searchProtocols(query) {
    // Search protocols by name or ID (min 3 chars)
    if (query.length >= 3) {
        return fetch(`/protocol/search?q=${encodeURIComponent(query)}`);
    }
    return Promise.resolve([]);
}