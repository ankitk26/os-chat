import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "~/components/ui/sonner";
import { cn } from "~/lib/utils";
import { useAppearanceStore } from "~/stores/appearance-store";
import appCss from "~/styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: "os-chat",
        },
        {
          name: "color-scheme",
          content: "light dark",
        },
      ],
      links: [
        // Preload critical styles early to reduce FOUC
        {
          rel: "preload",
          href: appCss,
          as: "style",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
        },
      ],
    }),
    component: RootComponent,
  }
);

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const enableAllMono = useAppearanceStore((store) => store.enableAllMono);

  return (
    <html lang="en">
      <HeadContent />
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <body
          className={cn("overflow-hidden", enableAllMono ? "font-mono" : "")}
        >
          <div>{children}</div>
          <Toaster duration={800} />
          <Scripts />
        </body>
      </NextThemesProvider>
    </html>
  );
}
