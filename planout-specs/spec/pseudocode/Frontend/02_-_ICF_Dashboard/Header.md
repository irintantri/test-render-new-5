export const Header = () => {
  return (
    <header>
      <div className="logo-placeholder">BeOne Logo</div>
      <h1>Consent IQ Dashboard</h1>
      <p>Manage and track Informed Consent Forms across all protocols</p>
      <button onClick={() => navigateTo('/setup')}>Create New Consent</button>
    </header>
  );
};

// ORPHAN_FIELD: navigateToPreview
// ORPHAN_FIELD: navigateToEdit
// ORPHAN_FIELD: navigateTo
// ORPHAN_FIELD: StatusBadge