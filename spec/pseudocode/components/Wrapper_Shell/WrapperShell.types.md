// API signature definition for the component props

TYPE WrapperShellProps:
    protocolId: String (Optional)
    icfName: String (Optional)
    icfVersion: String (Optional)
    currentStep: Integer (0 to 4)
    children: ReactNode (The page content)