Component RoleBadge(roleName):
  // Visual representation of user roles
  // Supports color-coded styling based on roleName
  Render:
    Span(class: "badge-" + roleName):
      Display roleName