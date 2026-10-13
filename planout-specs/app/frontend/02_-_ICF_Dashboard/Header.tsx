import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { ROUTES } from "@shared/lib";
import { Button } from "@shared/ui";

export const Header = () => {
  const navigateTo = useNavigate();
  return (
    <header className="dash-header">
      <div>
        <h1 className="dash-header__title">Consent IQ Dashboard</h1>
        <p className="dash-header__subtitle">Manage and track Informed Consent Forms across all protocols</p>
      </div>
      <Button size="lg" icon={<Plus />} onClick={() => navigateTo(ROUTES.setup())}>
        Create New Consent
      </Button>
    </header>
  );
};
