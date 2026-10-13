import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "@shared/auth";
import { ROUTES } from "@shared/lib";
import { Button, ErrorBanner } from "@shared/ui";
import { OnboardingLayout } from "@app/frontend/01_-_Onboarding/AuthLoadingScreen";

/** Demo sign-in (no credentials): issues a session for the demo ICF author. */
export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = async () => {
    setBusy(true);
    setError(null);
    try {
      await signIn();
      navigate(ROUTES.signIn, { replace: true });
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <OnboardingLayout>
      <div className="welcome">
        <h1 className="welcome__title">Sign in to Consent IQ</h1>
        <p className="welcome__note" style={{ marginBottom: 22, fontSize: 13 }}>
          Demo environment — you will be signed in as the sample ICF author.
        </p>
        <ErrorBanner message={error} />
        <Button block size="lg" icon={<LogIn />} loading={busy} onClick={go} style={{ marginTop: 12 }}>
          Sign in
        </Button>
      </div>
    </OnboardingLayout>
  );
}
