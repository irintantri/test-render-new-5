// Main container orchestrating the TOC and Document Section Cards

COMPONENT DocumentView(documentData):
    STATE activeSectionId = documentData.sections[0].id

    RENDER:
        <div className="layout">
            <aside>
                <TableOfContents 
                    sections={documentData.sections} 
                    activeSectionId={activeSectionId}
                    onSectionClick={(id) => setActiveSectionId(id)}
                />
            </aside>
            
            <main>
                FOR section IN documentData.sections:
                    <DocumentSectionCard 
                        key={section.id}
                        id={section.id}
                        data={section}
                        // Logic: When card enters viewport, update activeSectionId
                        onVisible={() => setActiveSectionId(section.id)}
                    />
            </main>
        </div>