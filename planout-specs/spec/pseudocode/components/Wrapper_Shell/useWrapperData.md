// Logic layer to handle the state and conditional rendering requirements
// for the breadcrumb and header elements.

FUNCTION useWrapperData(protocolId, icfName, icfVersion, currentStep):
    // Define the navigation path
    DEFINE breadcrumbItems = [
        { label: "Dashboard", link: "/dashboard" },
        { label: "Consent Creation", link: null }
    ]

    // Logic to determine if specific metadata pills should be visible
    RETURN {
        breadcrumbItems,
        showProtocolPill: protocolId IS NOT NULL,
        showIcfName: icfName IS NOT NULL,
        showIcfVersion: icfVersion IS NOT NULL,
        currentStep: currentStep // Used for step indicator logic
    }