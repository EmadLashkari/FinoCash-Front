import { createRootRoute, Outlet } from "@tanstack/react-router";
import React from "react";

// production mode, we don't want to load the devtools
const TanStackRouterDevtools = import.meta.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
            default: res.TanStackRouterDevtools,
        }))
    );

export const Route = createRootRoute({
    component: () => (
        <>
            {/* all pages and child layouts will be rendered here */}
            <Outlet />

            {/* show TanStack Router devtools only in development mode */}
            {import.meta.env.NODE_ENV !== "production" && (
                <React.Suspense fallback={null}>
                    <TanStackRouterDevtools />
                </React.Suspense>
            )}
        </>
    ),
});
