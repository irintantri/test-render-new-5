// Component: Displays the list of available versions for comparison.

Component VersionDropdown(versions, onSelect) {
    Render {
        List(className="version-dropdown") {
            ForEach(version in versions) {
                ListItem(onClick=() => onSelect(version.id)) {
                    Text(version.versionString)
                    Badge(version.status)
                    If (version.isCurrent) {
                        Label("Current")
                    }
                }
            }
        }
    }
}