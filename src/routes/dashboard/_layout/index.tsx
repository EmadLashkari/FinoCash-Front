import { createFileRoute } from "@tanstack/react-router";
import MobileDashboardHome from "../../../features/Dashboard/pages/MobileDashboard";

export const Route = createFileRoute("/dashboard/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MobileDashboardHome />;
}
