import { Link } from "react-router-dom";
import { ROUTES } from "@shared/lib";
import { EmptyState } from "@shared/ui";

export function NotFoundPage() {
  return (
    <div className="center-fill full-screen">
      <EmptyState
        title="Page not found"
        description="The page you’re looking for doesn’t exist."
        action={
          <Link className="btn btn--primary" to={ROUTES.icfDashboard}>
            Go to dashboard
          </Link>
        }
      />
    </div>
  );
}
