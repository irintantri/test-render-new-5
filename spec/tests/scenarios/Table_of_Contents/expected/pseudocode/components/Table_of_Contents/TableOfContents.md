// UI Component for the left panel TOC
// Asset: assets/cda38507-0965-4a06-a64e-588f5c095287.svg

COMPONENT TableOfContents(sections, activeSectionId, onSectionClick):
    { tocItems, scrollToSection } = useTableOfContents(sections, activeSectionId)

    RENDER:
        <nav className="toc-container">
            <h3>Table of Contents</h3>
            <ul>
                FOR item IN tocItems:
                    <li 
                        className={item.isActive ? "active" : ""}
                        style={{ paddingLeft: item.isSubItem ? "20px" : "0px" }}
                        onClick={() => {
                            scrollToSection(item.id)
                            onSectionClick(item.id)
                        }}
                    >
                        <span className="number">{item.displayNumber}</span>
                        <span className="title">{item.label}</span>
                    </li>
            </ul>
        </nav>