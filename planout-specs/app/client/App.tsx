/** Router: renders each feature page. */
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { RequireAuth } from "@shared/auth";
import { ROUTES } from "@shared/lib";
import { AuthLoadingScreen } from "@app/frontend/01_-_Onboarding/AuthLoadingScreen";
import { DashboardPage } from "@app/frontend/01_-_Onboarding/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { IcfDashboardPage } from "./pages/IcfDashboardPage";
import { SetupRoute } from "./pages/SetupRoute";
import { GenerateRoute } from "./pages/GenerateRoute";
import { EditRoute } from "./pages/EditRoute";
import { ReviewRoute } from "./pages/ReviewRoute";
import { PreviewRoute } from "./pages/PreviewRoute";
import { AiGenerateRoute } from "./pages/AiGenerateRoute";
import { NotFoundPage } from "./pages/NotFoundPage";

const guard = (el: React.ReactNode) => <RequireAuth>{el}</RequireAuth>;

function LegacyEditorRedirect() {
  const { documentId = "" } = useParams();
  return <Navigate to={ROUTES.edit(documentId)} replace />;
}

export function App() {
  return (
    <Routes>
      <Route path={ROUTES.signIn} element={<AuthLoadingScreen />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.welcome} element={guard(<DashboardPage />)} />
      <Route path={ROUTES.icfDashboard} element={guard(<IcfDashboardPage />)} />
      <Route path="/setup" element={guard(<SetupRoute />)} />
      <Route path="/setup/:protocolId" element={guard(<SetupRoute />)} />
      <Route path="/create" element={<Navigate to={ROUTES.setup()} replace />} />
      <Route path="/icf-creation-generate/:jobId" element={guard(<GenerateRoute />)} />
      <Route path="/edit/:documentId" element={guard(<EditRoute />)} />
      <Route path="/icf/editor/:documentId" element={<LegacyEditorRedirect />} />
      <Route path="/review/:documentId" element={guard(<ReviewRoute />)} />
      <Route path="/preview/:documentId" element={guard(<PreviewRoute />)} />
      <Route path={ROUTES.aiGenerate} element={guard(<AiGenerateRoute />)} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
