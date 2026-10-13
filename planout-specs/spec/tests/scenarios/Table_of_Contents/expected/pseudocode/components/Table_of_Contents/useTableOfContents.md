// Logic hook to process document sections for the TOC
// Input: Array of document sections (id, title, content)
// Output: Formatted TOC items with hierarchy and active state tracking

FUNCTION useTableOfContents(sections, activeSectionId):
    // Transform raw sections into a structured TOC tree
    // Pattern: \d+\.\d+ indicates a sub-item
    
    tocItems = sections.map((section, index) => {
        isSubItem = section.title matches regex /\d+\.\d+/
        
        RETURN {
            id: section.id,
            label: section.title,
            displayNumber: isSubItem ? section.title : (index + 1).toString(),
            isSubItem: isSubItem,
            isActive: section.id === activeSectionId
        }
    })

    FUNCTION scrollToSection(sectionId):
        element = document.getElementById(sectionId)
        IF element:
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })

    RETURN { tocItems, scrollToSection }