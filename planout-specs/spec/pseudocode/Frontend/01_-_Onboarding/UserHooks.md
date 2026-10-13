// Logic for data fetching and state management
Function useUserSession():
  // Fetches the authoritative user profile and task summary
  // GET /users/me returns:
  // USER: firstName, lastName, avatarUrl, role, locale, timezone
  // TASK_SUMMARY: draftsInProgress, itemsAwaitingReview, rejectedItems, approvedToPublish
  
  Return {
    user: { firstName, lastName, avatarUrl, role, locale, timezone },
    tasks: { draftsInProgress, itemsAwaitingReview, rejectedItems, approvedToPublish },
    isLoading,
    error
  }