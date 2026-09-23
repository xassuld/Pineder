import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ThemeProvider } from "../core/contexts/ThemeContext";
import { MentorRedirect } from "../components/features/mentor-pages/MentorRedirect";
import { TeamsChatProvider } from "../components/features/mentor-pages/TeamsChatProvider";
import "../styles/globals.css";
import type { AppProps } from "next/app";

function PageTransitionLoader() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router.events]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/25 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/80 px-6 py-5 shadow-2xl dark:bg-slate-900/80">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Loading page...
        </p>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <TeamsChatProvider>
          <MentorRedirect />
          <PageTransitionLoader />
          <div className="transition-opacity duration-300 ease-out animate-in fade-in">
            <Component {...pageProps} />
          </div>
        </TeamsChatProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
