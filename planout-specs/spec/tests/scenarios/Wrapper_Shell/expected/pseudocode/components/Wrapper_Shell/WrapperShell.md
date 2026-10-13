// UI layer that renders the consistent outer chrome.

COMPONENT WrapperShell(children, protocolId, icfName, icfVersion, currentStep):
    // Initialize logic hook
    DATA = useWrapperData(protocolId, icfName, icfVersion, currentStep)

    RETURN:
        <Container>
            <TopBar>
                // Global application header
            </TopBar>

            <BreadcrumbSubBar>
                Asset: assets/e368bbe4-c879-4b9e-8c43-c542dee64bfc.svg
                
                // Render breadcrumb links
                FOR EACH item IN DATA.breadcrumbItems:
                    RENDER Link(item.label, item.link)

                // Render conditional metadata
                IF DATA.showProtocolPill:
                    RENDER Pill(text: "Protocol: " + protocolId)
                
                IF DATA.showIcfName:
                    RENDER Text(DATA.icfName)
                
                IF DATA.showIcfVersion:
                    RENDER Pill(text: "v" + DATA.icfVersion)
            </BreadcrumbSubBar>

            <StepIndicator currentStep={DATA.currentStep} totalSteps={5} />

            <MainContentArea>
                // The specific page content (steps 0-4) is injected here
                {children}
            </MainContentArea>
        </Container>