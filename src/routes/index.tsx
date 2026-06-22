import { api } from "@/config/axios";
import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    beforeLoad: async () => {
        try {
            // Fetch the current user profile/status from the session/cookie
            const response = await api.get("/auth/me");
            const { hasSchool } = response.data.data;
            console.log(
                "User profile fetched successfully:",
                response.data.data,
            );

            // If the user hasn't created a school, throw a TanStack redirect to onboarding
            if (!hasSchool) {
                throw redirect({
                    to: "/onboarding",
                });
            } else {
                throw redirect({
                    to: "/dashboard/$schoolId",
                    params: {
                        schoolId: response.data.data.schoolInfo.id,
                    },
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
    return <div>Hello "/"!</div>;
}
