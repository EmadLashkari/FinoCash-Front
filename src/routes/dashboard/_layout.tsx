import { createFileRoute } from "@tanstack/react-router";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MobileDashboardLayout } from "../../features/layouts/MobileDashboard";
import { DesktopDashboardLayout } from "../../features/layouts/DesktopDashboard";

export const Route = createFileRoute("/dashboard/_layout")({
    component: DashboardLayoutSwitch,
});

function DashboardLayoutSwitch() {
    const isMobile = useIsMobile();

    // هر دو لایوت خروجی <Outlet /> را در قلب خود رندر خواهند کرد
    return isMobile ? <MobileDashboardLayout /> : <DesktopDashboardLayout />;
}
