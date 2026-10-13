/**
 * Renders the left-hand panel TOC.
 * Maps over the sorted Section list to display titles.
 */

COMPONENT TableOfContents(documentId: UUID):
    sections = USE_STATE(fetchDocumentSections(documentId))
    
    RENDER:
        <Sidebar>
            <Button onClick={addSection}>Add Section</Button>
            <List>
                FOR EACH section IN sections:
                    <ListItem 
                        key={section.id} 
                        onClick={scrollTo(section.id)}
                        active={activeSectionId === section.id}
                    >
                        {section.title}
                        {section.ai_label ? <Badge>AI</Badge> : null}
                    </ListItem>
            </List>
            <Button onClick={addSubsection}>Add Subsection</Button>
        </Sidebar>