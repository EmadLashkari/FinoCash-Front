import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import MobileDashboardHome from "../../../../features/Dashboard/pages/MobileDashboard";
import { api } from "@/config/axios";

export const Route = createFileRoute("/dashboard/_layout/$schoolId/")({
  // beforeLoad runs BEFORE the component is mounted or rendered
  beforeLoad: async () => {
    try {
      // Fetch the current user profile/status from the session/cookie
      const response = await api.get("/auth/me");
      const { hasSchool } = response.data.data;
      console.log("User profile fetched successfully:", response.data.data);

      // If the user hasn't created a school, throw a TanStack redirect to onboarding
      if (!hasSchool) {
        throw redirect({
          to: "/onboarding",
        });
      }
    } catch (error) {
      // If unauthorized (e.g., token expired), redirect back to login
      if (isRedirect(error)) {
        throw error;
      }
      console.log("Error fetching user profile:", error);
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MobileDashboardHome />;
}
