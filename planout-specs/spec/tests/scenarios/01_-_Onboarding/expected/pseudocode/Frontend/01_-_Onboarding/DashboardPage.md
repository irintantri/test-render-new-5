Component DashboardPage:
  Render:
    DashboardHeader()
    
    Button(
      label: "Continue to Dashboard",
      onClick: navigateTo("/icf-management"),
      // Accessibility: focus ring enabled
      // State: loading spinner on click to prevent duplicate submission
    )