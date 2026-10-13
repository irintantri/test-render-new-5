// Asset: assets/c6ab4ae1-b68b-436a-9557-b60c54f4d356.svg

Component AuthLoadingScreen:
  State isLoading = true
  
  Effect on mount:
    Call GET /users/me
    On success:
      Store user data in GlobalState
      Redirect to "/dashboard"
    On error:
      Redirect to "/login"

  Render:
    If isLoading:
      Display FullScreenSpinner(label: "Signing in…")