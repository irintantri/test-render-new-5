/** Welcome screen after sign-in (route /dashboard). Asset: c6ab4ae1 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@shared/lib";
import { Button, ErrorBanner, Spinner } from "@shared/ui";
import { OnboardingLayout } from "./AuthLoadingScreen";
import { DashboardHeader } from "./DashboardHeader";
import { useUserSession } from "./UserHooks";

export function DashboardPage() {
  const { user, tasks, isLoading, error } = useUserSession();
  const navigate = useNavigate();
  const [continuing, setContinuing] = useState(false);

  return (
    <OnboardingLayout>
      {isLoading ? (
        <div className="signing-in">
          <Spinner size={32} />
        </div>
      ) : error || !user || !tasks ? (
        <div className="welcome">
          <ErrorBanner message={error ?? "Could not load your profile."} />
          <Button variant="outline" onClick={() => navigate(ROUTES.login)}>
            Sign in again
          </Button>
        </div>
      ) : (
        <div className="welcome">
          <DashboardHeader user={user} tasks={tasks} />
          <button
            className="welcome__continue"
            disabled={continuing}
            onClick={() => {
              setContinuing(true);
              navigate(ROUTES.icfDashboard);
            }}
          >
            {continuing ? <Spinner size={14} light /> : null}
            Continue to Dashboard
            <ChevronRight size={16} />
          </button>
          <p className="welcome__note">Role permissions are managed by your organization administrator.</p>
        </div>
      )}
    </OnboardingLayout>
  );
}
