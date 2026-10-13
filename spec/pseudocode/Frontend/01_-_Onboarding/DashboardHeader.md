Component DashboardHeader:
  // Data sourced from GlobalState (populated by GET /users/me)
  // Fields: firstName, avatarUrl, role, secondaryRole, 
  //         draftsInProgress, itemsAwaitingReview, rejectedItems, approvedToPublish

  Render:
    Container(header):
      AvatarSection(
        image: avatarUrl,
        initials: firstName[0] + lastName[0],
        alt: firstName + " " + lastName
      )
      
      Text("Welcome back, " + firstName)
      
      RoleBadge(role)
      If secondaryRole exists:
        RoleBadge(secondaryRole)
      
      TaskSummarySection:
        Display draftsInProgress
        Display itemsAwaitingReview
        Display rejectedItems
        Display approvedToPublish

      Text("Role permissions are managed by your organization administrator.")