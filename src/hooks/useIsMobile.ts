import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

        // Initialize the state based on the current viewport width
        setIsMobile(mediaQuery.matches);

        // Listen for changes in the viewport width
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, [breakpoint]);

    return isMobile;
}
